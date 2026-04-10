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
from unittest.mock import MagicMock, patch

from enum import Enum

from migration_script import ApplicationStatus, ApplicationStatusGroup


# Bootstrap: stub out awsglue before importing the module under test
def _load_migration(dry_run: bool = False):
    """
    Import (or re-import) migration.py with the desired DRY_RUN value and
    the awsglue package stubbed out so no Glue runtime is needed.
    """
    # Stub awsglue.utils so the top-level import doesn't fail
    awsglue_pkg = types.ModuleType("awsglue")
    awsglue_utils = types.ModuleType("awsglue.utils")
    awsglue_utils.getResolvedOptions = MagicMock(
        return_value={
            "APPLICANT_TABLE": "applicant-table",
            "APPLICATION_TABLE": "application-table",
            "DRY_RUN": str(dry_run),
        }
    )
    awsglue_pkg.utils = awsglue_utils
    sys.modules.setdefault("awsglue", awsglue_pkg)
    sys.modules["awsglue.utils"] = awsglue_utils

    # Force a fresh import each call so module-level DRY_RUN is re-evaluated
    if "migration_script" in sys.modules:
        del sys.modules["migration_script"]

    return importlib.import_module("migration_script")


# Helpers
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


# migrate_item — happy path & skip branches
class TestMigrateItemSkips:
    def setup_method(self):
        self.mod = _load_migration(dry_run=False)

    def _run(self, applicant_row, applicant_table=None, application_table=None):
        at, apt = _mock_tables()
        stats = _make_statistics()
        dry_run = False
        self.mod.migrate_item(
            applicant_row,
            applicant_table or at,
            application_table or apt,
            dry_run,
            stats,
        )
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
        self.applicant_table, self.application_table = _mock_tables()

    def _base_row(self):
        return {
            "pk": "APPLICATION#abc",
            "sk": "APPLICANT#DETAILS",
            "passportId": "COUNTRY#GB#PASSPORT#12345",
        }

    def _run(self, row, app_root_status=None, tb_issued=None):
        stats = _make_statistics()
        dry_run = True

        # application_table.get_item for APPLICATION#ROOT
        if app_root_status is not None:
            self.application_table.get_item.return_value = {
                "Item": {"applicationStatus": app_root_status}
            }
        else:
            self.application_table.get_item.return_value = {}

        self.mod.migrate_item(
            row,
            self.applicant_table,
            self.application_table,
            dry_run,
            stats,
        )

        return stats, self.applicant_table, self.application_table

    def test_dry_run_counts_migration_but_does_not_write(self):
        stats, applicant_table, application_table = self._run(
            self._base_row(),
            app_root_status="Approved"
        )
        assert stats["migrated_applicants"] == 1
        assert {"pk": "APPLICATION#abc", "sk": "APPLICANT#DETAILS"} in stats[
            "applicants_to_remove"
        ]
        applicant_table.put_item.assert_not_called()
        application_table.update_item.assert_not_called()

    def test_dry_run_status_from_root_row(self):
        stats, at, apt = self._run(self._base_row(), app_root_status="Approved")
        assert stats["migrated_applicants"] == 1

    def test_dry_run_missing_root_row_returns_early(self):
        """When ROOT row is missing in dry_run, should return early without counting."""
        stats = _make_statistics()
        dry_run = True
        self.application_table.get_item.return_value = {"Item": None}  # No ROOT row

        self.mod.migrate_item(
            self._base_row(),
            self.applicant_table,
            self.application_table,
            dry_run,
            stats,
        )

        assert stats["migrated_applicants"] == 0


class TestMigrateItemLive:
    def setup_method(self):
        self.mod = _load_migration(dry_run=False)
        self.applicant_table, self.application_table = _mock_tables()

    def _base_row(self):
        return {
            "pk": "APPLICATION#abc",
            "sk": "APPLICANT#DETAILS",
            "passportId": "COUNTRY#GB#PASSPORT#12345",
            "name": "John Doe",
        }

    def test_live_writes_new_item_with_updated_pk(self):
        stats = _make_statistics()
        dry_run = False
        self.application_table.get_item.return_value = {
            "Item": {"applicationStatus": "Approved"}
        }

        self.mod.migrate_item(
            self._base_row(),
            self.applicant_table,
            self.application_table,
            dry_run,
            stats,
        )

        put_call_args = self.applicant_table.put_item.call_args[1]["Item"]
        assert put_call_args["pk"] == "COUNTRY#GB#PASSPORT#12345"
        assert put_call_args["name"] == "John Doe"

    def test_live_queues_old_pk_for_removal(self):
        stats = _make_statistics()
        dry_run = False
        self.application_table.get_item.return_value = {
            "Item": {"applicationStatus": "Approved"}
        }

        self.mod.migrate_item(
            self._base_row(),
            self.applicant_table,
            self.application_table,
            dry_run,
            stats,
        )

        assert {"pk": "APPLICATION#abc", "sk": "APPLICANT#DETAILS"} in stats[
            "applicants_to_remove"
        ]

    def test_live_updates_application_root_row(self):
        stats = _make_statistics()
        dry_run = False
        self.application_table.get_item.return_value = {
            "Item": {"applicationStatus": "Approved"}
        }

        self.mod.migrate_item(
            self._base_row(),
            self.applicant_table,
            self.application_table,
            dry_run,
            stats,
        )

        self.application_table.update_item.assert_called_once()
        update_kwargs = self.application_table.update_item.call_args[1]
        assert update_kwargs["Key"] == {"pk": "APPLICATION#abc", "sk": "APPLICATION#ROOT"}
        ev = update_kwargs["ExpressionAttributeValues"]
        assert ev[":new_applicant_pk"] == "COUNTRY#GB#PASSPORT#12345"
        assert ev[":new_application_status"] == "Approved"


    def test_live_conditional_check_failed_is_swallowed(self):
        """ConditionalCheckFailedException on update_item must not raise."""
        from botocore.exceptions import ClientError

        stats = _make_statistics()
        dry_run = False
        self.application_table.get_item.return_value = {
            "Item": {"applicationStatus": "Approved"}
        }
        self.application_table.update_item.side_effect = ClientError(
            {"Error": {"Code": "ConditionalCheckFailedException", "Message": "x"}},
            "UpdateItem",
        )
        # Should complete without raising
        self.mod.migrate_item(
            self._base_row(), self.applicant_table, self.application_table, dry_run, stats
        )
        assert stats["migrated_applicants"] == 1

    def test_live_other_client_error_is_raised(self):
        """Any ClientError other than ConditionalCheckFailed must propagate."""
        from botocore.exceptions import ClientError

        stats = _make_statistics()
        dry_run = False
        self.application_table.get_item.return_value = {
            "Item": {"applicationStatus": "Approved"}
        }
        self.application_table.update_item.side_effect = ClientError(
            {"Error": {"Code": "ProvisionedThroughputExceededException", "Message": "x"}},
            "UpdateItem",
        )
        with pytest.raises(ClientError):
            self.mod.migrate_item(
                self._base_row(),
                self.applicant_table,
                self.application_table,
                dry_run,
                stats,
            )

    def test_live_increments_migrated_count(self):
        stats = _make_statistics()
        dry_run = False
        self.application_table.get_item.return_value = {
            "Item": {"applicationStatus": "Approved"}
        }
        self.mod.migrate_item(
            self._base_row(),
            self.applicant_table,
            self.application_table,
            dry_run,
            stats,
        )
        assert stats["migrated_applicants"] == 1

    def test_live_missing_root_row_skips_migration(self):
        """When ROOT row doesn't exist, migration should be skipped."""
        stats = _make_statistics()
        dry_run = False
        self.application_table.get_item.return_value = {"Item": None}  # No ROOT row

        self.mod.migrate_item(
            self._base_row(),
            self.applicant_table,
            self.application_table,
            dry_run,
            stats,
        )

        assert stats["migrated_applicants"] == 0
        self.applicant_table.put_item.assert_not_called()

    def test_live_status_derived_from_tb_certificate_issued_yes(self):
        """When TB certificate is issued, status should be certificateAvailable."""
        stats = _make_statistics()
        dry_run = False
        self.application_table.get_item.side_effect = [
            {"Item": {"applicationStatus": None}},  # ROOT row with no status
            {"Item": {"isIssued": "Yes"}},  # TB certificate issued
        ]

        self.mod.migrate_item(
            self._base_row(),
            self.applicant_table,
            self.application_table,
            dry_run,
            stats,
        )

        update_kwargs = self.application_table.update_item.call_args[1]
        ev = update_kwargs["ExpressionAttributeValues"]
        assert ev[":new_application_status"] == (
            ApplicationStatus.certificateAvailable.value
        )

    def test_live_status_derived_from_tb_certificate_issued_no(self):
        """When TB certificate is not issued, status should be certificateNotIssued."""
        stats = _make_statistics()
        dry_run = False
        self.application_table.get_item.side_effect = [
            {"Item": {"applicationStatus": None}},  # ROOT row with no status
            {"Item": {"isIssued": "No"}},  # TB certificate not issued
        ]

        self.mod.migrate_item(
            self._base_row(),
            self.applicant_table,
            self.application_table,
            dry_run,
            stats,
        )

        update_kwargs = self.application_table.update_item.call_args[1]
        ev = update_kwargs["ExpressionAttributeValues"]
        assert ev[":new_application_status"] == (
            ApplicationStatus.certificateNotIssued.value
        )

    def test_live_status_defaults_to_in_progress_when_no_tb_data(self):
        """When no TB row exists, status defaults to inProgress."""
        stats = _make_statistics()
        dry_run = False
        self.application_table.get_item.side_effect = [
            {"Item": {"applicationStatus": None}},  # ROOT row with no status
            {},  # No TB row
        ]

        self.mod.migrate_item(
            self._base_row(),
            self.applicant_table,
            self.application_table,
            dry_run,
            stats,
        )

        update_kwargs = self.application_table.update_item.call_args[1]
        ev = update_kwargs["ExpressionAttributeValues"]
        assert ev[":new_application_status"] == ApplicationStatus.inProgress.value

    def test_live_status_group_set_to_complete_when_certificate_available(self):
        """When application status is Certificate Available,
            applicationStatusGroup should be Complete.
        """
        stats = _make_statistics()
        dry_run = False
        self.application_table.get_item.side_effect = [
            # No status, no group
            {"Item": {"applicationStatus": None, "applicationStatusGroup": None}},
            # TB certificate issued
            {"Item": {"isIssued": "Yes"}},
        ]

        self.mod.migrate_item(
            self._base_row(),
            self.applicant_table,
            self.application_table,
            dry_run,
            stats,
        )

        update_kwargs = self.application_table.update_item.call_args[1]
        ev = update_kwargs["ExpressionAttributeValues"]
        assert ev[":new_status_group"] == ApplicationStatusGroup.complete.value

    def test_live_status_group_set_to_complete_when_certificate_not_issued(self):
        """When application status is Certificate Not Issued,
            applicationStatusGroup should be Complete.
        """
        stats = _make_statistics()
        dry_run = False
        self.application_table.get_item.side_effect = [
            {"Item": {"applicationStatus": None, "applicationStatusGroup": None}},
            {"Item": {"isIssued": "No"}},
        ]

        self.mod.migrate_item(
            self._base_row(),
            self.applicant_table,
            self.application_table,
            dry_run,
            stats,
        )

        update_kwargs = self.application_table.update_item.call_args[1]
        ev = update_kwargs["ExpressionAttributeValues"]
        assert ev[":new_status_group"] == ApplicationStatusGroup.complete.value

    def test_live_status_group_set_to_complete_when_cancelled(self):
        """
        When application status is Cancelled, applicationStatusGroup should be Complete.
        """
        stats = _make_statistics()
        dry_run = False
        self.application_table.get_item.return_value = {
            "Item": {"applicationStatus": "Cancelled", "applicationStatusGroup": None}
        }

        self.mod.migrate_item(
            self._base_row(),
            self.applicant_table,
            self.application_table,
            dry_run,
            stats,
        )

        update_kwargs = self.application_table.update_item.call_args[1]
        ev = update_kwargs["ExpressionAttributeValues"]
        assert ev[":new_status_group"] == ApplicationStatusGroup.complete.value

    def test_live_preserves_existing_valid_status_group(self):
        """When application status is Approved (not in complete list),
            applicationStatusGroup is Not Complete.
        """
        stats = _make_statistics()
        dry_run = False
        self.application_table.get_item.return_value = {
            "Item": {
                "applicationStatus": "Approved",
                "applicationStatusGroup": ApplicationStatusGroup.complete.value
            }
        }

        self.mod.migrate_item(
            self._base_row(),
            self.applicant_table,
            self.application_table,
            dry_run,
            stats,
        )

        update_kwargs = self.application_table.update_item.call_args[1]
        ev = update_kwargs["ExpressionAttributeValues"]
        # Approved status is not a terminal status,
        # so applicationStatusGroup should be Not Complete
        assert ev[":new_status_group"] == ApplicationStatusGroup.incomplete.value


# remove_original_applicants — batching
class TestRemoveOriginalApplicants:
    def setup_method(self):
        self.mod = _load_migration(dry_run=False)
        self.applicant_table, self.application_table = _mock_tables()


    def _make_ids(self, n):
        return [{"pk": f"APPLICATION#{i}", "sk": "APPLICATION#ROOT"} for i in range(n)]

    def _collect_deleted_keys(self, at):
        """Return all keys passed to delete_item across all batch_writer calls."""
        deleted = []
        for ctx_call in (
            at.batch_writer.return_value.__enter__.return_value.delete_item.call_args_list
        ):
            deleted.append(ctx_call[1]["Key"])
        return deleted

    def test_empty_list_does_nothing(self):
        self.mod.remove_original_applicants(self.applicant_table, [])
        self.applicant_table.batch_writer.assert_not_called()

    def test_less_than_25_sends_single_batch(self):
        ids = self._make_ids(10)
        self.mod.remove_original_applicants(self.applicant_table, ids)
        assert self.applicant_table.batch_writer.call_count == 1

    def test_exactly_25_sends_single_batch(self):
        """25 items fits in one batch ([:25] slice) — single batch_writer call."""
        ids = self._make_ids(25)
        self.mod.remove_original_applicants(self.applicant_table, ids)
        assert self.applicant_table.batch_writer.call_count == 1

    def test_26_items_sends_two_batches(self):
        """26 items → first batch of 25, second batch of 1."""
        ids = self._make_ids(26)
        self.mod.remove_original_applicants(self.applicant_table, ids)
        assert self.applicant_table.batch_writer.call_count == 2

    def test_50_items_sends_two_batches(self):
        """50 items → two batches of 25."""
        ids = self._make_ids(50)
        self.mod.remove_original_applicants(self.applicant_table, ids)
        assert self.applicant_table.batch_writer.call_count == 2

    def test_delete_item_called_for_every_key(self):
        ids = self._make_ids(3)
        self.mod.remove_original_applicants(self.applicant_table, ids)
        batch_ctx = self.applicant_table.batch_writer.return_value.__enter__.return_value
        assert batch_ctx.delete_item.call_count == 3

    def test_each_delete_item_receives_correct_key(self):
        ids = self._make_ids(3)
        self.mod.remove_original_applicants(self.applicant_table, ids)
        batch_ctx = self.applicant_table.batch_writer.return_value.__enter__.return_value
        called_keys = [c[1]["Key"] for c in batch_ctx.delete_item.call_args_list]
        assert called_keys == ids


# scan_applicant_table — pagination
class TestScanApplicantTable:
    def setup_method(self):
        self.mod = _load_migration(dry_run=False)
        self.applicant_table, self.application_table = _mock_tables()
        self.dynamodb = MagicMock()

    def _make_scan_response(self, items, last_key=None):
        """Create a scan response with optional pagination key."""
        r = {"Items": items}
        if last_key:
            r["LastEvaluatedKey"] = last_key
        return r

    @patch("boto3.resource")
    def test_pagination_processes_multiple_pages(self, mock_boto3_resource):
        """Test that pagination loop processes multiple pages correctly."""
        mock_boto3_resource.return_value = self.dynamodb

        self.dynamodb.Table.side_effect = [self.applicant_table, self.application_table]

        # Page 1: has 2 items + LastEvaluatedKey
        page1 = self._make_scan_response(
            [
                {
                    "pk": "APPLICATION#1",
                    "sk": "APPLICANT#DETAILS",
                    "passportId": "COUNTRY#GB#PASSPORT#1",
                },
                {
                    "pk": "APPLICATION#2",
                    "sk": "APPLICANT#DETAILS",
                    "passportId": "COUNTRY#GB#PASSPORT#2",
                },
            ],
            last_key={"pk": "APPLICATION#2"},
        )
        # Page 2: has 1 item, no more pagination
        page2 = self._make_scan_response(
            [
                {
                    "pk": "APPLICATION#3",
                    "sk": "APPLICANT#DETAILS",
                    "passportId": "COUNTRY#GB#PASSPORT#3",
                }
            ]
        )

        self.applicant_table.scan.side_effect = [page1, page2]
        self.application_table.get_item.return_value = {
            "Item": {"applicationStatus": "Approved"}
        }

        stats = _make_statistics()
        self.mod.scan_applicant_table(
            stats,
            "applicant-table",
            "application-table",
            "eu-west-2",
            False,
            self.dynamodb,
        )

        assert stats["all_applicants"] == 3
        assert stats["migrated_applicants"] == 3

    @patch("boto3.resource")
    def test_scan_with_dry_run_skips_removal(self, mock_boto3_resource):
        """Test that DRY_RUN=True prevents remove_original_applicants call."""
        mock_boto3_resource.return_value = self.dynamodb

        self.dynamodb.Table.side_effect = [self.applicant_table, self.application_table]

        self.applicant_table.scan.return_value = self._make_scan_response(
            [
                {
                    "pk": "APPLICATION#1",
                    "sk": "APPLICANT#DETAILS",
                    "passportId": "COUNTRY#GB#PASSPORT#1",
                }
            ]
        )
        self.application_table.get_item.return_value = {
            "Item": {"applicationStatus": "Approved"}
        }

        stats = _make_statistics()
        self.mod.scan_applicant_table(
            stats,
            "applicant-table",
            "application-table",
            "eu-west-2",
            True,  # dry_run=True
            self.dynamodb,
        )

        assert stats["migrated_applicants"] == 1
        self.applicant_table.batch_writer.assert_not_called()

    @patch("boto3.resource")
    def test_scan_with_live_run_calls_removal(self, mock_boto3_resource):
        """Test that DRY_RUN=False calls remove_original_applicants."""
        mock_boto3_resource.return_value = self.dynamodb

        self.dynamodb.Table.side_effect = [self.applicant_table, self.application_table]

        self.applicant_table.scan.return_value = self._make_scan_response(
            [
                {
                    "pk": "APPLICATION#1",
                    "sk": "APPLICANT#DETAILS",
                    "passportId": "COUNTRY#GB#PASSPORT#1",
                }
            ]
        )
        self.application_table.get_item.return_value = {
            "Item": {"applicationStatus": "Approved"}
        }

        stats = _make_statistics()
        self.mod.scan_applicant_table(
            stats,
            "applicant-table",
            "application-table",
            "eu-west-2",
            False,  # dry_run=False
            self.dynamodb,
        )

        assert stats["migrated_applicants"] == 1
        self.applicant_table.batch_writer.assert_called()

    @patch("boto3.resource")
    def test_scan_creates_dynamodb_resource_when_not_provided(self, mock_boto3_resource):
        """Test that boto3.resource is called when dynamodb=None."""
        mock_boto3_resource.return_value = self.dynamodb

        self.dynamodb.Table.side_effect = [self.applicant_table, self.application_table]

        self.applicant_table.scan.return_value = self._make_scan_response([])

        stats = _make_statistics()
        # Call WITHOUT passing dynamodb parameter (None by default)
        self.mod.scan_applicant_table(
            stats,
            "applicant-table",
            "application-table",
            "eu-west-2",
            False,
            dynamodb=None,  # Explicitly None
        )

        # Verify boto3.resource was called with correct region
        mock_boto3_resource.assert_called_once_with("dynamodb", region_name="eu-west-2")

    @patch("boto3.resource")
    def test_scan_handles_empty_table(self, mock_boto3_resource):
        """Test scanning a table with no applicants."""
        mock_boto3_resource.return_value = self.dynamodb

        self.dynamodb.Table.side_effect = [self.applicant_table, self.application_table]

        self.applicant_table.scan.return_value = self._make_scan_response([])

        stats = _make_statistics()
        self.mod.scan_applicant_table(
            stats,
            "applicant-table",
            "application-table",
            "eu-west-2",
            False,
            self.dynamodb,
        )

        assert stats["all_applicants"] == 0
        assert stats["migrated_applicants"] == 0
