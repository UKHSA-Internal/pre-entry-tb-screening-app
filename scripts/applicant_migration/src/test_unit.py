"""
Tests for the DynamoDB migration Glue script.

Scope:
  - migrate_item() logic (all branches)
  - remove_original_applicants() batching logic
  - scan_applicant_table() pagination + DRY_RUN flag

Out of scope:
  - AWS Glue runtime / getResolvedOptions
  - Real DynamoDB connectivity

Dependencies:
  pip install pytest pytest-cov

Run:
  pytest test_migration.py -v --cov=migration --cov-report=term-missing
"""

import sys
import types
import importlib
import pytest
from unittest.mock import MagicMock, patch, call

# ---------------------------------------------------------------------------
# Bootstrap: stub out awsglue before importing the module under test
# ---------------------------------------------------------------------------

def _load_migration(dry_run: bool = False):
    """
    Import (or re-import) migration.py with the desired DRY_RUN value and
    the awsglue package stubbed out so no Glue runtime is needed.
    """
    # Stub awsglue.utils so the top-level import doesn't fail
    awsglue_pkg = types.ModuleType("awsglue")
    awsglue_utils = types.ModuleType("awsglue.utils")
    awsglue_utils.getResolvedOptions = MagicMock(return_value={
        "APPLICANT_TABLE": "applicant-table",
        "APPLICATION_TABLE": "application-table",
        "DRY_RUN": str(dry_run),
    })
    awsglue_pkg.utils = awsglue_utils
    sys.modules.setdefault("awsglue", awsglue_pkg)
    sys.modules["awsglue.utils"] = awsglue_utils

    # Force a fresh import each call so module-level DRY_RUN is re-evaluated
    if "migration_script" in sys.modules:
        del sys.modules["migration_script"]

    return importlib.import_module("migration_script")


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _make_statistics():
    return {
        "all_applicants": 0,
        "skipped_missing": 0,
        "skipped_migrated": 0,
        "migrated_applicants": 0,
        "applicants_to_remove": [],
    }


def _mock_tables():
    """Return (applicant_table_mock, application_table_mock)."""
    applicant_table = MagicMock()
    applicant_table.name = "applicant-table"
    application_table = MagicMock()
    application_table.name = "application-table"
    return applicant_table, application_table


# ===========================================================================
# migrate_item — happy path & skip branches
# ===========================================================================

class TestMigrateItemSkips:

    def setup_method(self):
        self.mod = _load_migration(dry_run=False)

    def _run(self, applicant_row, applicant_table=None, application_table=None):
        at, apt = _mock_tables()
        stats = _make_statistics()
        self.mod.migrate_item((
            applicant_row,
            applicant_table or at,
            application_table or apt,
            stats,
        ))
        return stats, at, apt

    def test_skip_when_passport_id_missing(self):
        row = {"pk": "APPLICATION#abc", "sk": "APPLICANT#DETAILS"}
        stats, _, _ = self._run(row)
        assert stats["skipped_missing"] == 1
        assert stats["migrated_applicants"] == 0

    def test_skip_when_passport_id_is_none(self):
        row = {"pk": "APPLICATION#abc", "sk": "APPLICANT#DETAILS", "passportId": None}
        stats, _, _ = self._run(row)
        assert stats["skipped_missing"] == 1

    def test_skip_when_passport_id_empty_string(self):
        row = {"pk": "APPLICATION#abc", "sk": "APPLICANT#DETAILS", "passportId": ""}
        stats, _, _ = self._run(row)
        # empty string is falsy — treated same as missing
        assert stats["skipped_missing"] == 1

    def test_skip_when_already_migrated(self):
        """pk == passportId means the record was already migrated."""
        row = {
            "pk": "COUNTRY#GB#PASSPORT#12345",
            "sk": "APPLICANT#DETAILS",
            "passportId": "COUNTRY#GB#PASSPORT#12345",
        }
        stats, _, _ = self._run(row)
        assert stats["skipped_migrated"] == 1
        assert stats["migrated_applicants"] == 0


class TestMigrateItemDryRun:

    def setup_method(self):
        self.mod = _load_migration(dry_run=True)

    def _base_row(self):
        return {
            "pk": "APPLICATION#abc",
            "sk": "APPLICANT#DETAILS",
            "passportId": "COUNTRY#GB#PASSPORT#12345",
        }

    def _run(self, row, app_root_status=None, tb_issued=None):
        at, apt = _mock_tables()
        stats = _make_statistics()

        # application_table.get_item for APPLICATION#ROOT
        if app_root_status is not None:
            apt.get_item.return_value = {"Item": {"applicationStatus": app_root_status}}
        else:
            apt.get_item.return_value = {}

        self.mod.migrate_item((row, at, apt, stats))
        return stats, at, apt

    def test_dry_run_counts_migration_but_does_not_write(self):
        stats, at, apt = self._run(self._base_row(), app_root_status="Approved")
        assert stats["migrated_applicants"] == 1
        assert {"pk": "APPLICATION#abc", "sk": "APPLICANT#DETAILS"} in stats["applicants_to_remove"]
        at.put_item.assert_not_called()
        apt.update_item.assert_not_called()

    def test_dry_run_status_from_root_row(self):
        stats, at, apt = self._run(self._base_row(), app_root_status="Approved")
        assert stats["migrated_applicants"] == 1

    def test_dry_run_no_root_row_tb_issued_yes(self):
        at, apt = _mock_tables()
        stats = _make_statistics()
        # First get_item (ROOT) returns nothing; second (TB#CERTIFICATE) returns isIssued=Yes
        apt.get_item.side_effect = [
            {},                                   # APPLICATION#ROOT — not found
            {"Item": {"isIssued": "Yes"}},        # APPLICATION#TB#CERTIFICATE
        ]
        self.mod.migrate_item((self._base_row(), at, apt, stats))
        assert stats["migrated_applicants"] == 1

    def test_dry_run_no_root_row_tb_issued_no(self):
        at, apt = _mock_tables()
        stats = _make_statistics()
        apt.get_item.side_effect = [
            {},
            {"Item": {"isIssued": "No"}},
        ]
        self.mod.migrate_item((self._base_row(), at, apt, stats))
        assert stats["migrated_applicants"] == 1

    def test_dry_run_no_root_row_no_tb_row(self):
        at, apt = _mock_tables()
        stats = _make_statistics()
        apt.get_item.side_effect = [{}, {}]
        self.mod.migrate_item((self._base_row(), at, apt, stats))
        # Falls through to "In progress"
        assert stats["migrated_applicants"] == 1


class TestMigrateItemLive:

    def setup_method(self):
        self.mod = _load_migration(dry_run=False)

    def _base_row(self):
        return {
            "pk": "APPLICATION#abc",
            "sk": "APPLICANT#DETAILS",
            "passportId": "COUNTRY#GB#PASSPORT#12345",
            "name": "John Doe",
        }

    def test_live_writes_new_item_with_updated_pk(self):
        at, apt = _mock_tables()
        stats = _make_statistics()
        apt.get_item.return_value = {"Item": {"applicationStatus": "Approved"}}

        self.mod.migrate_item((self._base_row(), at, apt, stats))

        put_call_args = at.put_item.call_args[1]["Item"]
        assert put_call_args["pk"] == "COUNTRY#GB#PASSPORT#12345"
        assert put_call_args["name"] == "John Doe"

    def test_live_queues_old_pk_for_removal(self):
        at, apt = _mock_tables()
        stats = _make_statistics()
        apt.get_item.return_value = {"Item": {"applicationStatus": "Approved"}}

        self.mod.migrate_item((self._base_row(), at, apt, stats))

        assert {"pk": "APPLICATION#abc", "sk": "APPLICANT#DETAILS"} in stats["applicants_to_remove"]

    def test_live_updates_application_root_row(self):
        at, apt = _mock_tables()
        stats = _make_statistics()
        apt.get_item.return_value = {"Item": {"applicationStatus": "Approved"}}

        self.mod.migrate_item((self._base_row(), at, apt, stats))

        apt.update_item.assert_called_once()
        update_kwargs = apt.update_item.call_args[1]
        assert update_kwargs["Key"] == {"pk": "APPLICATION#abc", "sk": "APPLICATION#ROOT"}
        ev = update_kwargs["ExpressionAttributeValues"]
        assert ev[":new_applicant_pk"] == "COUNTRY#GB#PASSPORT#12345"
        assert ev[":new_application_status"] == "Approved"

    def test_live_status_derived_from_tb_certificate_issued_yes(self):
        at, apt = _mock_tables()
        stats = _make_statistics()
        apt.get_item.side_effect = [
            {},
            {"Item": {"isIssued": "Yes"}},
        ]
        self.mod.migrate_item((self._base_row(), at, apt, stats))

        update_kwargs = apt.update_item.call_args[1]
        ev = update_kwargs["ExpressionAttributeValues"]
        assert ev[":new_application_status"] == "Certificate Available"

    def test_live_status_derived_from_tb_certificate_issued_no(self):
        at, apt = _mock_tables()
        stats = _make_statistics()
        apt.get_item.side_effect = [
            {},
            {"Item": {"isIssued": "No"}},
        ]
        self.mod.migrate_item((self._base_row(), at, apt, stats))

        update_kwargs = apt.update_item.call_args[1]
        ev = update_kwargs["ExpressionAttributeValues"]
        assert ev[":new_application_status"] == "Certificate not issued"

    def test_live_status_defaults_to_in_progress_when_no_tb_row(self):
        at, apt = _mock_tables()
        stats = _make_statistics()
        apt.get_item.side_effect = [{}, {}]
        self.mod.migrate_item((self._base_row(), at, apt, stats))

        update_kwargs = apt.update_item.call_args[1]
        ev = update_kwargs["ExpressionAttributeValues"]
        assert ev[":new_application_status"] == "In progress"

    def test_live_conditional_check_failed_is_swallowed(self):
        """ConditionalCheckFailedException on update_item must not raise."""
        from botocore.exceptions import ClientError
        at, apt = _mock_tables()
        stats = _make_statistics()
        apt.get_item.return_value = {"Item": {"applicationStatus": "Approved"}}
        apt.update_item.side_effect = ClientError(
            {"Error": {"Code": "ConditionalCheckFailedException", "Message": "x"}},
            "UpdateItem",
        )
        # Should complete without raising
        self.mod.migrate_item((self._base_row(), at, apt, stats))
        assert stats["migrated_applicants"] == 1

    def test_live_other_client_error_is_raised(self):
        """Any ClientError other than ConditionalCheckFailed must propagate."""
        from botocore.exceptions import ClientError
        at, apt = _mock_tables()
        stats = _make_statistics()
        apt.get_item.return_value = {"Item": {"applicationStatus": "Approved"}}
        apt.update_item.side_effect = ClientError(
            {"Error": {"Code": "ProvisionedThroughputExceededException", "Message": "x"}},
            "UpdateItem",
        )
        with pytest.raises(ClientError):
            self.mod.migrate_item((self._base_row(), at, apt, stats))

    def test_live_increments_migrated_count(self):
        at, apt = _mock_tables()
        stats = _make_statistics()
        apt.get_item.return_value = {"Item": {"applicationStatus": "Approved"}}
        self.mod.migrate_item((self._base_row(), at, apt, stats))
        assert stats["migrated_applicants"] == 1


# ===========================================================================
# remove_original_applicants — batching
# ===========================================================================

class TestRemoveOriginalApplicants:

    def setup_method(self):
        self.mod = _load_migration(dry_run=False)

    def _make_ids(self, n):
        return [{"pk": f"APPLICATION#{i}", "sk": "APPLICATION#ROOT"} for i in range(n)]

    def _collect_deleted_keys(self, at):
        """Return all keys passed to delete_item across all batch_writer calls."""
        deleted = []
        for ctx_call in at.batch_writer.return_value.__enter__.return_value.delete_item.call_args_list:
            deleted.append(ctx_call[1]["Key"])
        return deleted

    def test_empty_list_does_nothing(self):
        dynamodb = MagicMock()
        at, _ = _mock_tables()
        self.mod.remove_original_applicants(dynamodb, at, [])
        at.batch_writer.assert_not_called()

    def test_less_than_25_sends_single_batch(self):
        dynamodb = MagicMock()
        at, _ = _mock_tables()
        ids = self._make_ids(10)
        self.mod.remove_original_applicants(dynamodb, at, ids)
        assert at.batch_writer.call_count == 1

    def test_exactly_25_sends_single_batch(self):
        """25 items fits in one batch ([:25] slice) — single batch_writer call."""
        dynamodb = MagicMock()
        at, _ = _mock_tables()
        ids = self._make_ids(25)
        self.mod.remove_original_applicants(dynamodb, at, ids)
        assert at.batch_writer.call_count == 1

    def test_26_items_sends_two_batches(self):
        """26 items → first batch of 25, second batch of 1."""
        dynamodb = MagicMock()
        at, _ = _mock_tables()
        ids = self._make_ids(26)
        self.mod.remove_original_applicants(dynamodb, at, ids)
        assert at.batch_writer.call_count == 2

    def test_50_items_sends_two_batches(self):
        """50 items → two batches of 25."""
        dynamodb = MagicMock()
        at, _ = _mock_tables()
        ids = self._make_ids(50)
        self.mod.remove_original_applicants(dynamodb, at, ids)
        assert at.batch_writer.call_count == 2

    def test_delete_item_called_for_every_key(self):
        dynamodb = MagicMock()
        at, _ = _mock_tables()
        ids = self._make_ids(3)
        self.mod.remove_original_applicants(dynamodb, at, ids)
        batch_ctx = at.batch_writer.return_value.__enter__.return_value
        assert batch_ctx.delete_item.call_count == 3

    def test_each_delete_item_receives_correct_key(self):
        dynamodb = MagicMock()
        at, _ = _mock_tables()
        ids = self._make_ids(3)
        self.mod.remove_original_applicants(dynamodb, at, ids)
        batch_ctx = at.batch_writer.return_value.__enter__.return_value
        called_keys = [c[1]["Key"] for c in batch_ctx.delete_item.call_args_list]
        assert called_keys == ids


# ===========================================================================
# scan_applicant_table — pagination & DRY_RUN wiring
# ===========================================================================

class TestScanApplicantTable:

    def _make_scan_response(self, items, last_key=None):
        r = {"Items": items}
        if last_key:
            r["LastEvaluatedKey"] = last_key
        return r

    @patch("boto3.resource")
    def test_single_page_counts_all_applicants(self, mock_boto3_resource):
        mod = _load_migration(dry_run=True)
        dynamodb = MagicMock()
        mock_boto3_resource.return_value = dynamodb

        at, apt = _mock_tables()
        dynamodb.Table.side_effect = [at, apt]

        at.scan.return_value = self._make_scan_response([
            {"pk": "APPLICATION#1", "sk": "APPLICANT#DETAILS", "passportId": "COUNTRY#GB#PASSPORT#111"},
            {"pk": "APPLICATION#2", "sk": "APPLICANT#DETAILS"},  # missing passportId
        ])
        apt.get_item.return_value = {"Item": {"applicationStatus": "Approved"}}

        stats = _make_statistics()
        mod.scan_applicant_table(stats)

        assert stats["all_applicants"] == 2
        assert stats["skipped_missing"] == 1
        assert stats["migrated_applicants"] == 1

    @patch("boto3.resource")
    def test_paginated_scan_accumulates_counts(self, mock_boto3_resource):
        mod = _load_migration(dry_run=True)
        dynamodb = MagicMock()
        mock_boto3_resource.return_value = dynamodb

        at, apt = _mock_tables()
        dynamodb.Table.side_effect = [at, apt]

        page1 = self._make_scan_response(
            [{"pk": "APPLICATION#1", "sk": "APPLICANT#DETAILS", "passportId": "COUNTRY#GB#PASSPORT#1"}],
            last_key={"pk": "APPLICATION#1"},
        )
        page2 = self._make_scan_response(
            [{"pk": "APPLICATION#2", "sk": "APPLICANT#DETAILS", "passportId": "COUNTRY#GB#PASSPORT#2"}],
        )
        at.scan.side_effect = [page1, page2]
        apt.get_item.return_value = {"Item": {"applicationStatus": "Approved"}}

        stats = _make_statistics()
        mod.scan_applicant_table(stats)

        assert stats["all_applicants"] == 2
        assert stats["migrated_applicants"] == 2

    @patch("boto3.resource")
    def test_live_run_calls_remove_original_applicants(self, mock_boto3_resource):
        mod = _load_migration(dry_run=False)
        dynamodb = MagicMock()
        mock_boto3_resource.return_value = dynamodb

        at, apt = _mock_tables()
        dynamodb.Table.side_effect = [at, apt]

        at.scan.return_value = self._make_scan_response([
            {"pk": "APPLICATION#1", "sk": "APPLICANT#DETAILS", "passportId": "COUNTRY#GB#PASSPORT#111"},
        ])
        apt.get_item.return_value = {"Item": {"applicationStatus": "Approved"}}

        stats = _make_statistics()
        mod.scan_applicant_table(stats)

        # batch_writer context manager should have been entered (remove step)
        at.batch_writer.assert_called()

    @patch("boto3.resource")
    def test_dry_run_skips_remove_original_applicants(self, mock_boto3_resource):
        mod = _load_migration(dry_run=True)
        dynamodb = MagicMock()
        mock_boto3_resource.return_value = dynamodb

        at, apt = _mock_tables()
        dynamodb.Table.side_effect = [at, apt]

        at.scan.return_value = self._make_scan_response([
            {"pk": "APPLICATION#1", "sk": "APPLICANT#DETAILS", "passportId": "COUNTRY#GB#PASSPORT#111"},
        ])
        apt.get_item.return_value = {"Item": {"applicationStatus": "Approved"}}

        stats = _make_statistics()
        mod.scan_applicant_table(stats)

        at.batch_writer.assert_not_called()

    @patch("boto3.resource")
    def test_empty_table_produces_zero_stats(self, mock_boto3_resource):
        mod = _load_migration(dry_run=True)
        dynamodb = MagicMock()
        mock_boto3_resource.return_value = dynamodb

        at, apt = _mock_tables()
        dynamodb.Table.side_effect = [at, apt]
        at.scan.return_value = self._make_scan_response([])

        stats = _make_statistics()
        mod.scan_applicant_table(stats)

        assert stats["all_applicants"] == 0
        assert stats["migrated_applicants"] == 0
        assert stats["skipped_missing"] == 0


# ===========================================================================
# main() — orchestration, statistics summary output, DRY_RUN flag
# ===========================================================================

class TestMain:
    """
    Strategy:
      - Patch scan_applicant_table so no real DynamoDB calls are made.
      - Use a side_effect to inject known statistics values into the dict
        that main() creates and passes in — this lets us assert the printed
        summary reflects those values accurately.
      - Capture stdout with capsys to assert every summary line is printed.
    """

    def _run_main(self, mod, stats_override: dict):
        """
        Run mod.main() with scan_applicant_table mocked.
        stats_override values are merged into the statistics dict
        that main() creates internally.
        """
        def fake_scan(statistics):
            statistics.update(stats_override)

        with patch.object(mod, "scan_applicant_table", side_effect=fake_scan):
            mod.main()

    def test_main_calls_scan_applicant_table_once(self, capsys):
        mod = _load_migration(dry_run=True)
        with patch.object(mod, "scan_applicant_table") as mock_scan:
            mod.main()
        mock_scan.assert_called_once()

    def test_main_passes_correct_initial_statistics_shape(self, capsys):
        """main() must initialise statistics with all required keys."""
        mod = _load_migration(dry_run=True)
        captured_stats = {}

        def fake_scan(statistics):
            captured_stats.update(statistics)

        with patch.object(mod, "scan_applicant_table", side_effect=fake_scan):
            mod.main()

        expected_keys = {
            "all_applicants",
            "skipped_missing",
            "skipped_migrated",
            "migrated_applicants",
            "applicants_to_remove",
        }
        assert expected_keys == set(captured_stats.keys())

    def test_main_prints_all_applicants_count(self, capsys):
        mod = _load_migration(dry_run=True)
        self._run_main(mod, {"all_applicants": 42, "applicants_to_remove": []})
        out = capsys.readouterr().out
        assert "42" in out

    def test_main_prints_skipped_missing_count(self, capsys):
        mod = _load_migration(dry_run=True)
        self._run_main(mod, {"skipped_missing": 7, "applicants_to_remove": []})
        out = capsys.readouterr().out
        assert "7" in out

    def test_main_prints_skipped_migrated_count(self, capsys):
        mod = _load_migration(dry_run=True)
        self._run_main(mod, {"skipped_migrated": 3, "applicants_to_remove": []})
        out = capsys.readouterr().out
        assert "3" in out

    def test_main_prints_migrated_applicants_count(self, capsys):
        mod = _load_migration(dry_run=True)
        self._run_main(mod, {"migrated_applicants": 15, "applicants_to_remove": []})
        out = capsys.readouterr().out
        assert "15" in out

    def test_main_prints_applicants_to_remove_count(self, capsys):
        mod = _load_migration(dry_run=True)
        fake_removals = [{"pk": f"APPLICATION#{i}", "sk": "APPLICATION#ROOT"} for i in range(5)]
        self._run_main(mod, {"applicants_to_remove": fake_removals})
        out = capsys.readouterr().out
        assert "5" in out

    def test_main_prints_migration_complete(self, capsys):
        mod = _load_migration(dry_run=True)
        self._run_main(mod, {"applicants_to_remove": []})
        out = capsys.readouterr().out
        assert "Migration complete" in out

    def test_main_prints_dry_run_flag_in_start_message(self, capsys):
        mod = _load_migration(dry_run=True)
        self._run_main(mod, {"applicants_to_remove": []})
        out = capsys.readouterr().out
        assert "DRY_RUN=True" in out

    def test_main_prints_live_run_flag_in_start_message(self, capsys):
        mod = _load_migration(dry_run=False)
        self._run_main(mod, {"applicants_to_remove": []})
        out = capsys.readouterr().out
        assert "DRY_RUN=False" in out

    def test_main_prints_duration(self, capsys):
        mod = _load_migration(dry_run=True)
        self._run_main(mod, {"applicants_to_remove": []})
        out = capsys.readouterr().out
        # Duration line always contains "min" and "sec"
        assert "min" in out and "sec" in out
