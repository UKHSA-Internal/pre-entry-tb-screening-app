"""
Unit tests for migrations.py.

All DynamoDB calls are mocked via unittest.mock — no Docker / network required.
"""

from unittest.mock import MagicMock, patch

import pytest
from botocore.exceptions import ClientError

from conftest import make_statistics, _stub_awsglue

_stub_awsglue()

from migrations import (  # noqa: E402
    ApplicationStatus,
    ApplicationStatusGroup,
    migrate_applicants,
    remove_original_applicants,
    rewrite_applicant_records,
    rewrite_application_root_records,
    rewrite_clinic_records,
    set_application_statusgroup,
    scan_table,
    data_migration,
)


def mock_tables():
    at = MagicMock()
    at.name = "applicant-table"
    apt = MagicMock()
    apt.name = "application-table"
    ct = MagicMock()
    ct.name = "clinics-table"

    return at, apt, ct


def _client_error(code: str) -> ClientError:
    return ClientError({"Error": {"Code": code, "Message": "test"}}, "UpdateItem")


class TestMigrateApplicantSkips:
    """Early-return / skip logic in migrate_applicants."""

    def test_skip_when_already_migrated_pk_equals_passport_id(self):
        """pk == passportId → skipped_migrated incremented, nothing written."""
        at, apt, ct = mock_tables()
        stats = make_statistics()
        row = {
            "pk": "COUNTRY#GB#PASSPORT#1",
            "sk": "APPLICANT#DETAILS",
            "passportId": "COUNTRY#GB#PASSPORT#1",
        }
        migrate_applicants(row, at, apt, ct, False, stats)
        assert stats["skipped_migrated"] == 1
        assert stats["all_applicants"] == 0
        assert stats["migrated_applicants"] == 0
        at.put_item.assert_not_called()
        apt.update_item.assert_not_called()

    def test_skip_when_passport_id_missing(self):
        """No passportId key → skipped_missing incremented."""
        at, apt, ct = mock_tables()
        stats = make_statistics()
        row = {"pk": "APPLICATION#abc", "sk": "APPLICANT#DETAILS"}
        migrate_applicants(row, at, apt, ct, False, stats)
        assert stats["skipped_missing"] == 1
        assert stats["migrated_applicants"] == 0

    def test_skip_when_passport_id_is_none(self):
        """passportId=None → skipped_missing incremented."""
        at, apt, ct = mock_tables()
        stats = make_statistics()
        row = {"pk": "APPLICATION#abc", "sk": "APPLICANT#DETAILS", "passportId": None}
        migrate_applicants(row, at, apt, ct, False, stats)
        assert stats["skipped_missing"] == 1

    def test_skip_when_passport_id_empty_string(self):
        """passportId='' (falsy) → treated as missing."""
        at, apt, ct = mock_tables()
        stats = make_statistics()
        row = {"pk": "APPLICATION#abc", "sk": "APPLICANT#DETAILS", "passportId": ""}
        migrate_applicants(row, at, apt, ct, False, stats)
        assert stats["skipped_missing"] == 1

    def test_early_return_when_no_application_root_row(self):
        """Missing APPLICATION#ROOT row → returns early, nothing written."""
        at, apt, ct = mock_tables()
        stats = make_statistics()
        apt.get_item.return_value = {}
        row = {
            "pk": "APPLICATION#abc",
            "sk": "APPLICANT#DETAILS",
            "passportId": "COUNTRY#GB#PASSPORT#1",
        }
        migrate_applicants(row, at, apt, ct, False, stats)
        assert stats["migrated_applicants"] == 0
        at.put_item.assert_not_called()
        apt.update_item.assert_not_called()


class TestMigrateApplicantStatusDerivation:
    """applicationStatus is derived correctly from the TB certificate row."""

    BASE_ROW = {
        "pk": "APPLICATION#abc",
        "sk": "APPLICANT#DETAILS",
        "passportId": "COUNTRY#GB#PASSPORT#1",
    }

    def _run(self, tb_row_item):
        at, apt, ct = mock_tables()
        stats = make_statistics()
        apt.get_item.side_effect = [
            {"Item": {"pk": "APPLICATION#abc", "sk": "APPLICATION#ROOT"}},
            ({"Item": tb_row_item} if tb_row_item is not None else {}),
        ]
        migrate_applicants(self.BASE_ROW, at, apt, ct, False, stats)

        return apt

    def test_status_certificate_available_when_issued_yes(self):
        """isIssued='Yes' → applicationStatus = Certificate Available."""
        apt = self._run({"isIssued": "Yes"})
        ev = apt.update_item.call_args[1]["ExpressionAttributeValues"]
        assert ev[":new_application_status"] == ApplicationStatus.certificateAvailable.value

    def test_status_certificate_not_issued_when_issued_no(self):
        """isIssued='No' → applicationStatus = Certificate Not Issued."""
        apt = self._run({"isIssued": "No"})
        ev = apt.update_item.call_args[1]["ExpressionAttributeValues"]
        assert ev[":new_application_status"] == ApplicationStatus.certificateNotIssued.value

    def test_status_in_progress_when_no_tb_certificate_row(self):
        """No TB certificate row → applicationStatus = In Progress."""
        apt = self._run(None)
        ev = apt.update_item.call_args[1]["ExpressionAttributeValues"]
        assert ev[":new_application_status"] == ApplicationStatus.inProgress.value

    def test_status_in_progress_when_tb_row_has_no_is_issued(self):
        """TB row present but isIssued missing → In Progress."""
        apt = self._run({})
        ev = apt.update_item.call_args[1]["ExpressionAttributeValues"]
        assert ev[":new_application_status"] == ApplicationStatus.inProgress.value


class TestMigrateApplicantDryRun:
    """dry_run=True → counts updated, no writes."""

    BASE_ROW = {
        "pk": "APPLICATION#abc",
        "sk": "APPLICANT#DETAILS",
        "passportId": "COUNTRY#GB#PASSPORT#1",
    }

    def _setup(self):
        at, apt, ct = mock_tables()
        apt.get_item.side_effect = [
            {"Item": {"pk": "APPLICATION#abc", "sk": "APPLICATION#ROOT"}},
            {},
        ]
        stats = make_statistics()
        return at, apt, ct, stats

    def test_dry_run_increments_migrated_applicants(self):
        at, apt, ct, stats = self._setup()
        migrate_applicants(self.BASE_ROW, at, apt, ct, True, stats)
        assert stats["migrated_applicants"] == 1

    def test_dry_run_appends_to_applicants_to_remove(self):
        at, apt, ct, stats = self._setup()
        migrate_applicants(self.BASE_ROW, at, apt, ct, True, stats)
        assert {"pk": "APPLICATION#abc", "sk": "APPLICANT#DETAILS"} in stats["applicants_to_remove"]

    def test_dry_run_does_not_call_put_item(self):
        at, apt, ct, stats = self._setup()
        migrate_applicants(self.BASE_ROW, at, apt, ct, True, stats)
        at.put_item.assert_not_called()

    def test_dry_run_does_not_call_update_item(self):
        at, apt, ct, stats = self._setup()
        migrate_applicants(self.BASE_ROW, at, apt, ct, True, stats)
        apt.update_item.assert_not_called()


class TestMigrateApplicantLive:
    """dry_run=False → correct write operations performed."""

    BASE_ROW = {
        "pk": "APPLICATION#abc",
        "sk": "APPLICANT#DETAILS",
        "passportId": "COUNTRY#GB#PASSPORT#1",
        "name": "Alice",
    }

    def _setup(self):
        at, apt, ct = mock_tables()
        apt.get_item.side_effect = [
            {"Item": {"pk": "APPLICATION#abc", "sk": "APPLICATION#ROOT"}},
            {},
        ]
        stats = make_statistics()
        return at, apt, ct, stats

    def test_put_item_called_with_new_pk(self):
        at, apt, ct, stats = self._setup()
        migrate_applicants(self.BASE_ROW, at, apt, ct, False, stats)
        item = at.put_item.call_args[1]["Item"]
        assert item["pk"] == "COUNTRY#GB#PASSPORT#1"

    def test_put_item_preserves_all_attributes(self):
        at, apt, ct, stats = self._setup()
        migrate_applicants(self.BASE_ROW, at, apt, ct, False, stats)
        item = at.put_item.call_args[1]["Item"]
        assert item["name"] == "Alice"
        assert item["sk"] == "APPLICANT#DETAILS"

    def test_update_item_targets_application_root(self):
        at, apt, ct, stats = self._setup()
        migrate_applicants(self.BASE_ROW, at, apt, ct, False, stats)
        kwargs = apt.update_item.call_args[1]
        assert kwargs["Key"] == {"pk": "APPLICATION#abc", "sk": "APPLICATION#ROOT"}

    def test_update_item_sets_applicant_id(self):
        at, apt, ct, stats = self._setup()
        migrate_applicants(self.BASE_ROW, at, apt, ct, False, stats)
        ev = apt.update_item.call_args[1]["ExpressionAttributeValues"]
        assert ev[":new_applicant_pk"] == "COUNTRY#GB#PASSPORT#1"

    def test_migrated_applicants_incremented(self):
        at, apt, ct, stats = self._setup()
        migrate_applicants(self.BASE_ROW, at, apt, ct, False, stats)
        assert stats["migrated_applicants"] == 1

    def test_applicants_to_remove_appended(self):
        at, apt, ct, stats = self._setup()
        migrate_applicants(self.BASE_ROW, at, apt, ct, False, stats)
        assert {"pk": "APPLICATION#abc", "sk": "APPLICANT#DETAILS"} in stats["applicants_to_remove"]

    def test_conditional_check_failed_is_swallowed(self):
        """ConditionalCheckFailedException on update_item must not propagate."""
        at, apt, ct = mock_tables()
        stats = make_statistics()
        apt.get_item.side_effect = [
            {"Item": {"pk": "APPLICATION#abc", "sk": "APPLICATION#ROOT"}},
            {},
        ]
        apt.update_item.side_effect = _client_error("ConditionalCheckFailedException")
        migrate_applicants(self.BASE_ROW, at, apt, ct, False, stats)  # must not raise
        assert stats["migrated_applicants"] == 1

    def test_other_client_error_is_re_raised(self):
        """Non-ConditionalCheck ClientError must propagate."""
        at, apt, ct = mock_tables()
        stats = make_statistics()
        apt.get_item.side_effect = [
            {"Item": {"pk": "APPLICATION#abc", "sk": "APPLICATION#ROOT"}},
            {},
        ]
        apt.update_item.side_effect = _client_error("ProvisionedThroughputExceededException")
        with pytest.raises(ClientError):
            migrate_applicants(self.BASE_ROW, at, apt, ct, False, stats)


class TestRemoveOriginalApplicants:
    """Batch-delete logic in remove_original_applicants."""

    def _ids(self, n):
        return [{"pk": f"APPLICATION#{i}", "sk": "APPLICANT#DETAILS"} for i in range(n)]

    def _delete_count(self, at):
        return at.batch_writer.return_value.__enter__.return_value.delete_item.call_count

    def test_empty_list_does_not_enter_batch_writer(self):
        at, _, _ = mock_tables()
        remove_original_applicants(at, [])
        at.batch_writer.assert_not_called()

    def test_exactly_25_items_one_batch_25_deletes(self):
        at, _, _ = mock_tables()
        remove_original_applicants(at, self._ids(25))
        assert self._delete_count(at) == 25

    def test_26_items_two_batches_26_deletes(self):
        at, _, _ = mock_tables()
        remove_original_applicants(at, self._ids(26))
        assert self._delete_count(at) == 26

    def test_50_items_two_batches_of_25(self):
        at, _, _ = mock_tables()
        remove_original_applicants(at, self._ids(50))
        assert self._delete_count(at) == 50
        assert at.batch_writer.call_count == 2

    def test_1_item_one_delete(self):
        at, _, _ = mock_tables()
        remove_original_applicants(at, self._ids(1))
        assert self._delete_count(at) == 1


class TestSetApplicationStatusgroup:
    """Tests for set_application_statusgroup."""

    def _row(self, application_status=None, sk="APPLICATION#ROOT"):
        row = {"pk": "APPLICATION#abc", "sk": sk}
        if application_status is not None:
            row["applicationStatus"] = application_status
        return row

    def test_non_root_sk_increments_skipped_rows_not_root(self):
        """sk != APPLICATION#ROOT → skipped and no write."""
        _, apt, _ct = mock_tables()
        stats = make_statistics()
        set_application_statusgroup(
            self._row(sk="APPLICATION#TB#CERTIFICATE"), _, apt, _ct, False, stats
        )
        assert stats["skipped_rows_not_root"] == 1
        apt.update_item.assert_not_called()

    @pytest.mark.parametrize(
        "status",
        [
            ApplicationStatus.certificateAvailable.value,
            ApplicationStatus.certificateNotIssued.value,
            ApplicationStatus.cancelled.value,
        ],
    )
    def test_complete_statuses_map_to_complete_group(self, status):
        """certificateAvailable / certificateNotIssued / cancelled → Complete."""
        _, apt, _ct = mock_tables()
        stats = make_statistics()
        set_application_statusgroup(self._row(application_status=status), _, apt, _ct, False, stats)
        ev = apt.update_item.call_args[1]["ExpressionAttributeValues"]
        assert ev[":new_status_group"] == ApplicationStatusGroup.complete.value

    def test_in_progress_maps_to_incomplete(self):
        """applicationStatus=inProgress → Incomplete."""
        _, apt, _ct = mock_tables()
        stats = make_statistics()
        set_application_statusgroup(
            self._row(application_status=ApplicationStatus.inProgress.value),
            _,
            apt,
            _ct,
            False,
            stats,
        )
        ev = apt.update_item.call_args[1]["ExpressionAttributeValues"]
        assert ev[":new_status_group"] == ApplicationStatusGroup.incomplete.value

    def test_no_application_status_defaults_to_incomplete(self):
        """No applicationStatus → defaults to Incomplete."""
        _, apt, _ct = mock_tables()
        stats = make_statistics()
        set_application_statusgroup(self._row(), _, apt, _ct, False, stats)
        ev = apt.update_item.call_args[1]["ExpressionAttributeValues"]
        assert ev[":new_status_group"] == ApplicationStatusGroup.incomplete.value

    def test_dry_run_does_not_call_update_item(self):
        _, apt, _ct = mock_tables()
        stats = make_statistics()
        set_application_statusgroup(
            self._row(application_status=ApplicationStatus.inProgress.value),
            _,
            apt,
            _ct,
            True,
            stats,
        )
        apt.update_item.assert_not_called()

    def test_dry_run_increments_migrated_applications(self):
        _, apt, _ct = mock_tables()
        stats = make_statistics()
        set_application_statusgroup(
            self._row(application_status=ApplicationStatus.inProgress.value),
            _,
            apt,
            _ct,
            True,
            stats,
        )
        assert stats["migrated_applications"] == 1

    def test_live_calls_update_item_with_correct_key(self):
        _, apt, _ct = mock_tables()
        stats = make_statistics()
        set_application_statusgroup(
            self._row(application_status=ApplicationStatus.inProgress.value),
            _,
            apt,
            _ct,
            False,
            stats,
        )
        apt.update_item.assert_called_once()
        assert apt.update_item.call_args[1]["Key"] == {
            "pk": "APPLICATION#abc",
            "sk": "APPLICATION#ROOT",
        }

    def test_live_update_expression_contains_applicationstatusgroup(self):
        _, apt, _ct = mock_tables()
        stats = make_statistics()
        set_application_statusgroup(
            self._row(application_status=ApplicationStatus.inProgress.value),
            _,
            apt,
            _ct,
            False,
            stats,
        )
        assert "applicationStatusGroup" in apt.update_item.call_args[1]["UpdateExpression"]

    def test_conditional_check_failed_is_swallowed(self):
        _, apt, _ct = mock_tables()
        stats = make_statistics()
        apt.update_item.side_effect = _client_error("ConditionalCheckFailedException")
        set_application_statusgroup(
            self._row(application_status=ApplicationStatus.inProgress.value),
            _,
            apt,
            _ct,
            False,
            stats,
        )  # must not raise

    def test_other_client_error_is_re_raised(self):
        _, apt, _ct = mock_tables()
        stats = make_statistics()
        apt.update_item.side_effect = _client_error("ServiceUnavailable")
        with pytest.raises(ClientError):
            set_application_statusgroup(
                self._row(application_status=ApplicationStatus.inProgress.value),
                _,
                apt,
                _ct,
                False,
                stats,
            )


class TestRewriteClinicRecords:
    """Tests for rewrite_clinic_records."""

    BASE_RECORD = {"pk": "CLINIC#abc", "sk": "CLINIC#ROOT", "clinicId": "abc"}

    def test_dry_run_does_not_call_update_item(self):
        """dry_run=True → update_item must not be called."""
        at, apt, ct = mock_tables()
        stats = make_statistics()
        rewrite_clinic_records(self.BASE_RECORD, at, apt, ct, True, stats)
        ct.update_item.assert_not_called()

    def test_dry_run_increments_rewritten_clinic_rows(self):
        """dry_run=True → rewritten_clinic_rows still incremented."""
        at, apt, ct = mock_tables()
        stats = make_statistics()
        rewrite_clinic_records(self.BASE_RECORD, at, apt, ct, True, stats)
        assert stats["rewritten_clinic_rows"] == 1

    def test_live_calls_update_item_with_correct_key(self):
        """dry_run=False → update_item called with pk/sk key."""
        at, apt, ct = mock_tables()
        stats = make_statistics()
        rewrite_clinic_records(self.BASE_RECORD, at, apt, ct, False, stats)
        ct.update_item.assert_called_once()
        assert ct.update_item.call_args[1]["Key"] == {
            "pk": "CLINIC#abc",
            "sk": "CLINIC#ROOT",
        }

    def test_live_update_expression_sets_clinic_id(self):
        """UpdateExpression rewrites clinicId field."""
        at, apt, ct = mock_tables()
        stats = make_statistics()
        rewrite_clinic_records(self.BASE_RECORD, at, apt, ct, False, stats)
        assert "clinicId" in ct.update_item.call_args[1]["UpdateExpression"]

    def test_live_expression_attribute_values_contain_clinic_id(self):
        """ExpressionAttributeValues carries the original clinicId value."""
        at, apt, ct = mock_tables()
        stats = make_statistics()
        rewrite_clinic_records(self.BASE_RECORD, at, apt, ct, False, stats)
        ev = ct.update_item.call_args[1]["ExpressionAttributeValues"]
        assert ev[":id"] == "abc"

    def test_live_increments_rewritten_clinic_rows(self):
        """dry_run=False → rewritten_clinic_rows incremented."""
        at, apt, ct = mock_tables()
        stats = make_statistics()
        rewrite_clinic_records(self.BASE_RECORD, at, apt, ct, False, stats)
        assert stats["rewritten_clinic_rows"] == 1


class TestScanTable:
    """Paginated scan_table helper."""

    def _table(self):
        t = MagicMock()
        t.name = "test-table"
        return t

    def test_single_page_returns_items_and_none_lek(self):
        t = self._table()
        t.scan.return_value = {"Items": [{"pk": "A"}]}
        items, lek = scan_table(t)
        assert items == [{"pk": "A"}]
        assert lek is None

    def test_empty_table_returns_empty_list(self):
        t = self._table()
        t.scan.return_value = {"Items": []}
        items, lek = scan_table(t)
        assert items == []
        assert lek is None

    def test_first_page_returns_last_evaluated_key(self):
        """First page with LastEvaluatedKey → lek returned correctly."""
        t = self._table()
        lek_value = {"pk": "A", "sk": "X"}
        t.scan.return_value = {"Items": [{"pk": "A"}], "LastEvaluatedKey": lek_value}
        items, lek = scan_table(t)
        assert lek == lek_value

    def test_second_call_includes_exclusive_start_key(self):
        """Second scan_table call with lek → ExclusiveStartKey forwarded."""
        t = self._table()
        lek_value = {"pk": "A", "sk": "X"}
        t.scan.return_value = {"Items": [{"pk": "B"}]}
        scan_table(t, last_evaluated_key=lek_value)
        call_args = t.scan.call_args
        # ExclusiveStartKey must appear in the args passed to table.scan
        assert call_args[1].get("ExclusiveStartKey") == lek_value or (
            call_args[0] and call_args[0][0].get("ExclusiveStartKey") == lek_value
        )

    def test_scan_filter_forwarded_when_no_lek(self):
        t = self._table()
        t.scan.return_value = {"Items": []}
        sf = {
            "FilterExpression": "sk = :sk",
            "ExpressionAttributeValues": {":sk": "ROOT"},
        }
        scan_table(t, scan_filter=sf)
        t.scan.assert_called_once_with(**sf)

    def test_scan_filter_merged_with_lek(self):
        t = self._table()
        t.scan.return_value = {"Items": []}
        sf = {"FilterExpression": "sk = :sk"}
        lek = {"pk": "X", "sk": "Y"}
        scan_table(t, last_evaluated_key=lek, scan_filter=sf)
        t.scan.assert_called_once_with(FilterExpression="sk = :sk", ExclusiveStartKey=lek)


class TestDataMigration:
    """Top-level data_migration orchestrator."""

    def _make_dynamodb(self, at, apt, ct=None):
        if ct is None:
            ct = MagicMock()
            ct.name = "clinics-table"
        dynamodb = MagicMock()
        dynamodb.Table.side_effect = lambda name: (
            at if name == "applicant-table" else (apt if name == "application-table" else ct)
        )
        return dynamodb

    def _reset_stats(self):
        import migrations

        migrations.statistics = make_statistics()

    @patch("migrations.scan_table")
    @patch("migrations.migrate_applicants")
    @patch("migrations.time", create=True)
    def test_calls_migrate_applicants_per_row(self, mock_time, mock_migrate, mock_scan):
        """migrate_applicants called for each row."""
        mock_time.time.return_value = 0
        mock_migrate.__name__ = "migrate_applicants"
        rows = [{"pk": "APPLICATION#1", "sk": "APPLICANT#DETAILS"}]
        mock_scan.return_value = (rows, None)
        at, apt, ct = mock_tables()
        self._reset_stats()
        data_migration(
            "applicant-table",
            "application-table",
            "clinics-table",
            "eu-west-2",
            False,
            self._make_dynamodb(at, apt, ct),
            "migrate_applicants",
        )
        assert mock_migrate.call_count == 1

    @patch("migrations.scan_table")
    @patch("migrations.migrate_applicants")
    @patch("migrations.remove_original_applicants")
    @patch("migrations.time", create=True)
    def test_migrate_applicants_dry_run_false_calls_remove(
        self, mock_time, mock_remove, mock_migrate, mock_scan
    ):
        """dry_run=False → remove_original_applicants called."""
        mock_time.time.return_value = 0
        mock_migrate.__name__ = "migrate_applicants"
        mock_scan.return_value = ([], None)
        at, apt, ct = mock_tables()
        self._reset_stats()
        data_migration(
            "applicant-table",
            "application-table",
            "clinics-table",
            "eu-west-2",
            False,
            self._make_dynamodb(at, apt, ct),
            "migrate_applicants",
        )
        mock_remove.assert_called_once()

    @patch("migrations.scan_table")
    @patch("migrations.migrate_applicants")
    @patch("migrations.remove_original_applicants")
    @patch("migrations.time", create=True)
    def test_migrate_applicants_dry_run_true_skips_remove(
        self, mock_time, mock_remove, mock_migrate, mock_scan
    ):
        """dry_run=True → remove_original_applicants not called."""
        mock_time.time.return_value = 0
        mock_migrate.__name__ = "migrate_applicants"
        mock_scan.return_value = ([], None)
        at, apt, ct = mock_tables()
        self._reset_stats()
        data_migration(
            "applicant-table",
            "application-table",
            "clinics-table",
            "eu-west-2",
            True,
            self._make_dynamodb(at, apt, ct),
            "migrate_applicants",
        )
        mock_remove.assert_not_called()

    @patch("migrations.scan_table")
    @patch("migrations.set_application_statusgroup")
    @patch("migrations.remove_original_applicants")
    @patch("migrations.time", create=True)
    def test_set_application_statusgroup_is_called(
        self, mock_time, mock_remove, mock_set, mock_scan
    ):
        """set_application_statusgroup is called per row."""
        mock_time.time.return_value = 0
        mock_set.__name__ = "set_application_statusgroup"
        rows = [{"pk": "APPLICATION#1", "sk": "APPLICATION#ROOT"}]
        mock_scan.return_value = (rows, None)
        at, apt, ct = mock_tables()
        self._reset_stats()
        data_migration(
            "applicant-table",
            "application-table",
            "clinics-table",
            "eu-west-2",
            False,
            self._make_dynamodb(at, apt, ct),
            "set_application_statusgroup",
        )
        assert mock_set.call_count == 1

    @patch("migrations.scan_table")
    @patch("migrations.set_application_statusgroup")
    @patch("migrations.remove_original_applicants")
    @patch("migrations.time", create=True)
    def test_set_application_statusgroup_never_calls_remove(
        self, mock_time, mock_remove, mock_set, mock_scan
    ):
        """set_application_statusgroup → remove_original_applicants never called."""
        mock_time.time.return_value = 0
        mock_set.__name__ = "set_application_statusgroup"
        mock_scan.return_value = ([], None)
        at, apt, ct = mock_tables()
        self._reset_stats()
        data_migration(
            "applicant-table",
            "application-table",
            "clinics-table",
            "eu-west-2",
            False,
            self._make_dynamodb(at, apt, ct),
            "set_application_statusgroup",
        )
        mock_remove.assert_not_called()

    @patch("migrations.scan_table")
    @patch("migrations.set_application_statusgroup")
    @patch("migrations.time", create=True)
    def test_set_application_statusgroup_passes_filter_expression(
        self, mock_time, mock_set, mock_scan
    ):
        """set_application_statusgroup → FilterExpression passed to scan_table."""
        mock_time.time.return_value = 0
        mock_set.__name__ = "set_application_statusgroup"
        mock_scan.return_value = ([], None)
        at, apt, ct = mock_tables()
        self._reset_stats()
        data_migration(
            "applicant-table",
            "application-table",
            "clinics-table",
            "eu-west-2",
            False,
            self._make_dynamodb(at, apt, ct),
            "set_application_statusgroup",
        )
        scan_filter = mock_scan.call_args[1].get("scan_filter", {})
        assert "FilterExpression" in scan_filter

    @patch("migrations.scan_table")
    @patch("migrations.migrate_applicants")
    @patch("migrations.time", create=True)
    def test_provided_dynamodb_used_directly(self, mock_time, mock_migrate, mock_scan):
        """When dynamodb is provided, boto3.resource is not called."""
        mock_time.time.return_value = 0
        mock_migrate.__name__ = "migrate_applicants"
        mock_scan.return_value = ([], None)
        at, apt, ct = mock_tables()
        self._reset_stats()
        with patch("migrations.boto3") as mock_boto3:
            data_migration(
                "applicant-table",
                "application-table",
                "clinics-table",
                "eu-west-2",
                True,
                self._make_dynamodb(at, apt, ct),
                "migrate_applicants",
            )
            mock_boto3.resource.assert_not_called()

    @patch("migrations.scan_table")
    @patch("migrations.rewrite_clinic_records")
    @patch("migrations.time", create=True)
    def test_rewrite_clinic_records_is_called(self, mock_time, mock_rewrite, mock_scan):
        """rewrite_clinic_records called per row when migration='rewrite_clinic_records'."""
        mock_time.time.return_value = 0
        mock_rewrite.__name__ = "rewrite_clinic_records"
        rows = [{"pk": "CLINIC#1", "sk": "CLINIC#ROOT", "clinicId": "1"}]
        mock_scan.return_value = (rows, None)
        at, apt, ct = mock_tables()
        self._reset_stats()
        data_migration(
            "applicant-table",
            "application-table",
            "clinics-table",
            "eu-west-2",
            False,
            self._make_dynamodb(at, apt, ct),
            "rewrite_clinic_records",
        )
        assert mock_rewrite.call_count == 1

    @patch("migrations.scan_table")
    @patch("migrations.rewrite_clinic_records")
    @patch("migrations.remove_original_applicants")
    @patch("migrations.time", create=True)
    def test_rewrite_clinic_records_never_calls_remove(
        self, mock_time, mock_remove, mock_rewrite, mock_scan
    ):
        """rewrite_clinic_records migration → remove_original_applicants never called."""
        mock_time.time.return_value = 0
        mock_rewrite.__name__ = "rewrite_clinic_records"
        mock_scan.return_value = ([], None)
        at, apt, ct = mock_tables()
        self._reset_stats()
        data_migration(
            "applicant-table",
            "application-table",
            "clinics-table",
            "eu-west-2",
            False,
            self._make_dynamodb(at, apt, ct),
            "rewrite_clinic_records",
        )
        mock_remove.assert_not_called()

    @patch("migrations.scan_table")
    @patch("migrations.migrate_applicants")
    @patch("migrations.time", create=True)
    @patch("migrations.boto3")
    def test_none_dynamodb_triggers_boto3_resource(
        self, mock_boto3, mock_time, mock_migrate, mock_scan
    ):
        """When dynamodb=None, boto3.resource is invoked."""
        mock_time.time.return_value = 0
        mock_migrate.__name__ = "migrate_applicants"
        mock_scan.return_value = ([], None)
        mock_resource = MagicMock()
        mock_boto3.resource.return_value = mock_resource
        mock_resource.Table.return_value = MagicMock(name="some-table")
        self._reset_stats()
        data_migration(
            "applicant-table",
            "application-table",
            "clinics-table",
            "eu-west-2",
            True,
            None,
            "migrate_applicants",
        )
        mock_boto3.resource.assert_called_once()


class TestRewriteApplicantRecords:
    """Tests for rewrite_applicant_records."""

    BASE_RECORD = {
        "pk": "COUNTRY#GB#PASSPORT#1",
        "sk": "APPLICANT#DETAILS",
        "countryOfIssue": "GB",
    }

    def test_dry_run_does_not_call_update_item(self):
        """dry_run=True → update_item must not be called."""
        at, apt, ct = mock_tables()
        stats = make_statistics()
        rewrite_applicant_records(self.BASE_RECORD, at, apt, ct, True, stats)
        at.update_item.assert_not_called()

    def test_dry_run_increments_rewritten_applicant_rows(self):
        """dry_run=True → rewritten_applicant_rows incremented."""
        at, apt, ct = mock_tables()
        stats = make_statistics()
        rewrite_applicant_records(self.BASE_RECORD, at, apt, ct, True, stats)
        assert stats["rewritten_applicant_rows"] == 1

    def test_live_calls_update_item_with_correct_key(self):
        """dry_run=False → update_item called with pk/sk key."""
        at, apt, ct = mock_tables()
        stats = make_statistics()
        rewrite_applicant_records(self.BASE_RECORD, at, apt, ct, False, stats)
        at.update_item.assert_called_once()
        assert at.update_item.call_args[1]["Key"] == {
            "pk": "COUNTRY#GB#PASSPORT#1",
            "sk": "APPLICANT#DETAILS",
        }

    def test_live_update_expression_sets_country_of_issue(self):
        """UpdateExpression rewrites countryOfIssue field."""
        at, apt, ct = mock_tables()
        stats = make_statistics()
        rewrite_applicant_records(self.BASE_RECORD, at, apt, ct, False, stats)
        assert "countryOfIssue" in at.update_item.call_args[1]["UpdateExpression"]

    def test_live_expression_attribute_values_carry_country_of_issue(self):
        """ExpressionAttributeValues carries the original countryOfIssue value."""
        at, apt, ct = mock_tables()
        stats = make_statistics()
        rewrite_applicant_records(self.BASE_RECORD, at, apt, ct, False, stats)
        ev = at.update_item.call_args[1]["ExpressionAttributeValues"]
        assert ev[":countryOfIssue"] == "GB"

    def test_live_increments_rewritten_applicant_rows(self):
        """dry_run=False → rewritten_applicant_rows incremented on success."""
        at, apt, ct = mock_tables()
        stats = make_statistics()
        rewrite_applicant_records(self.BASE_RECORD, at, apt, ct, False, stats)
        assert stats["rewritten_applicant_rows"] == 1

    def test_exception_increments_skipped_and_not_rewritten(self):
        """update_item raises Exception → skipped_applicant_rows incremented, no re-raise."""
        at, apt, ct = mock_tables()
        stats = make_statistics()
        at.update_item.side_effect = Exception("boom")
        rewrite_applicant_records(self.BASE_RECORD, at, apt, ct, False, stats)  # must not raise
        assert stats["skipped_applicant_rows"] == 1
        assert stats["rewritten_applicant_rows"] == 0


class TestRewriteApplicationRootRecords:
    """Tests for rewrite_application_root_records."""

    def _record(self, sk="APPLICATION#NONROOT", date_created="2024-01-01"):
        return {"pk": "APPLICATION#abc", "sk": sk, "dateCreated": date_created}

    def test_dry_run_nonroot_sk_increments_root_rows(self):
        """dry_run=True, sk != APPLICATION#ROOT → rewritten_application_root_rows incremented."""
        at, apt, ct = mock_tables()
        stats = make_statistics()
        rewrite_application_root_records(
            self._record(sk="APPLICATION#NONROOT"), at, apt, ct, True, stats
        )
        assert stats["rewritten_application_root_rows"] == 1
        apt.update_item.assert_not_called()

    def test_dry_run_root_sk_increments_nonroot_rows(self):
        """dry_run=True, sk == APPLICATION#ROOT → rewritten_application_nonroot_rows incremented."""
        at, apt, ct = mock_tables()
        stats = make_statistics()
        rewrite_application_root_records(
            self._record(sk="APPLICATION#ROOT"), at, apt, ct, True, stats
        )
        assert stats["rewritten_application_nonroot_rows"] == 1
        apt.update_item.assert_not_called()

    def test_live_calls_update_item_with_correct_key(self):
        """dry_run=False → update_item called with correct pk/sk."""
        at, apt, ct = mock_tables()
        stats = make_statistics()
        rewrite_application_root_records(self._record(), at, apt, ct, False, stats)
        apt.update_item.assert_called_once()
        assert apt.update_item.call_args[1]["Key"] == {
            "pk": "APPLICATION#abc",
            "sk": "APPLICATION#NONROOT",
        }

    def test_live_update_expression_sets_date_created(self):
        """UpdateExpression rewrites dateCreated field."""
        at, apt, ct = mock_tables()
        stats = make_statistics()
        rewrite_application_root_records(self._record(), at, apt, ct, False, stats)
        assert "dateCreated" in apt.update_item.call_args[1]["UpdateExpression"]

    def test_live_nonroot_sk_increments_root_rows(self):
        """dry_run=False, sk != APPLICATION#ROOT → rewritten_application_root_rows incremented."""
        at, apt, ct = mock_tables()
        stats = make_statistics()
        rewrite_application_root_records(
            self._record(sk="APPLICATION#NONROOT"), at, apt, ct, False, stats
        )
        assert stats["rewritten_application_root_rows"] == 1

    def test_live_root_sk_increments_nonroot_rows(self):
        """dry_run=False, sk == APPLICATION#ROOT → rewritten_application_nonroot_rows incremented.
        """
        at, apt, ct = mock_tables()
        stats = make_statistics()
        rewrite_application_root_records(
            self._record(sk="APPLICATION#ROOT"), at, apt, ct, False, stats
        )
        assert stats["rewritten_application_nonroot_rows"] == 1

    def test_exception_nonroot_sk_increments_skipped_root_rows(self):
        """update_item raises Exception, sk != ROOT → skipped_application_root_rows incremented."""
        at, apt, ct = mock_tables()
        stats = make_statistics()
        apt.update_item.side_effect = Exception("boom")
        rewrite_application_root_records(
            self._record(sk="APPLICATION#NONROOT"), at, apt, ct, False, stats
        )  # must not raise
        assert stats["skipped_application_root_rows"] == 1

    def test_exception_root_sk_increments_skipped_nonroot_rows(self):
        """update_item raises Exception, sk == ROOT → skipped_application_nonroot_rows incremented.
        """
        at, apt, ct = mock_tables()
        stats = make_statistics()
        apt.update_item.side_effect = Exception("boom")
        rewrite_application_root_records(
            self._record(sk="APPLICATION#ROOT"), at, apt, ct, False, stats
        )  # must not raise
        assert stats["skipped_application_nonroot_rows"] == 1

    def test_all_applications_incremented(self):
        """all_applications incremented for every call regardless of dry_run."""
        at, apt, ct = mock_tables()
        stats = make_statistics()
        rewrite_application_root_records(self._record(), at, apt, ct, False, stats)
        assert stats["all_applications"] == 1

    def test_all_applications_incremented_dry_run(self):
        """all_applications incremented even in dry_run=True."""
        at, apt, ct = mock_tables()
        stats = make_statistics()
        rewrite_application_root_records(self._record(), at, apt, ct, True, stats)
        assert stats["all_applications"] == 1


class TestDataMigrationExtended:
    """Additional orchestration tests for data_migration."""

    def _make_dynamodb(self, at, apt, ct=None):
        if ct is None:
            ct = MagicMock()
            ct.name = "clinics-table"
        dynamodb = MagicMock()
        dynamodb.Table.side_effect = lambda name: (
            at if name == "applicant-table" else (apt if name == "application-table" else ct)
        )
        return dynamodb

    def _reset_stats(self):
        import migrations

        migrations.statistics = make_statistics()

    @patch("migrations.scan_table")
    @patch("migrations.rewrite_applicant_records")
    @patch("migrations.time", create=True)
    def test_rewrite_applicant_records_called_per_row(self, mock_time, mock_rewrite, mock_scan):
        """rewrite_applicant_records called for each row; remove not called."""
        mock_time.time.return_value = 0
        mock_rewrite.__name__ = "rewrite_applicant_records"
        rows = [{"pk": "COUNTRY#GB#PASSPORT#1", "sk": "APPLICANT#DETAILS", "countryOfIssue": "GB"}]
        mock_scan.return_value = (rows, None)
        at, apt, ct = mock_tables()
        self._reset_stats()
        with patch("migrations.remove_original_applicants") as mock_remove:
            data_migration(
                "applicant-table",
                "application-table",
                "clinics-table",
                "eu-west-2",
                False,
                self._make_dynamodb(at, apt, ct),
                "rewrite_applicant_records",
            )
            assert mock_rewrite.call_count == 1
            mock_remove.assert_not_called()

    @patch("migrations.scan_table")
    @patch("migrations.rewrite_application_root_records")
    @patch("migrations.time", create=True)
    def test_rewrite_application_root_records_filter_expression(
        self, mock_time, mock_rewrite, mock_scan
    ):
        """rewrite_application_root_records → FilterExpression for APPLICATION#ROOT sent."""
        mock_time.time.return_value = 0
        mock_rewrite.__name__ = "rewrite_application_root_records"
        mock_scan.return_value = ([], None)
        at, apt, ct = mock_tables()
        self._reset_stats()
        data_migration(
            "applicant-table",
            "application-table",
            "clinics-table",
            "eu-west-2",
            False,
            self._make_dynamodb(at, apt, ct),
            "rewrite_application_root_records",
        )
        scan_filter = mock_scan.call_args[1].get("scan_filter", {})
        assert "FilterExpression" in scan_filter
        ev = scan_filter.get("ExpressionAttributeValues", {})
        assert ev.get(":sk") == "APPLICATION#ROOT"

    @patch("migrations.scan_table")
    @patch("migrations.rewrite_application_root_records")
    @patch("migrations.time", create=True)
    def test_rewrite_application_nonroot_records_excludes_root(
        self, mock_time, mock_rewrite, mock_scan
    ):
        """rewrite_application_nonroot_records → filter excludes APPLICATION#ROOT rows."""
        mock_time.time.return_value = 0
        mock_rewrite.__name__ = "rewrite_application_root_records"
        mock_scan.return_value = ([], None)
        at, apt, ct = mock_tables()
        self._reset_stats()
        data_migration(
            "applicant-table",
            "application-table",
            "clinics-table",
            "eu-west-2",
            False,
            self._make_dynamodb(at, apt, ct),
            "rewrite_application_nonroot_records",
        )
        scan_filter = mock_scan.call_args[1].get("scan_filter", {})
        assert "<>" in scan_filter.get("FilterExpression", "")

    @patch("migrations.scan_table")
    @patch("migrations.time", create=True)
    def test_invalid_migration_name_raises_value_error(self, mock_time, mock_scan):
        """Invalid migration name → ValueError raised."""
        mock_time.time.return_value = 0
        mock_scan.return_value = ([], None)
        at, apt, ct = mock_tables()
        self._reset_stats()
        with pytest.raises(ValueError, match="Invalid migration type"):
            data_migration(
                "applicant-table",
                "application-table",
                "clinics-table",
                "eu-west-2",
                False,
                self._make_dynamodb(at, apt, ct),
                "totally_invalid",
            )

    @patch("migrations.scan_table")
    @patch("migrations.migrate_applicants")
    @patch("migrations.time", create=True)
    def test_paginated_scan_processes_all_pages(self, mock_time, mock_migrate, mock_scan):
        """Two-page scan → migration function called for rows on both pages."""
        mock_time.time.return_value = 0
        mock_migrate.__name__ = "migrate_applicants"
        page1_rows = [{"pk": "APPLICATION#1", "sk": "APPLICANT#DETAILS"}]
        page2_rows = [{"pk": "APPLICATION#2", "sk": "APPLICANT#DETAILS"}]
        mock_scan.side_effect = [
            (page1_rows, {"pk": "APPLICATION#1", "sk": "APPLICANT#DETAILS"}),
            (page2_rows, None),
        ]
        at, apt, ct = mock_tables()
        self._reset_stats()
        with patch("migrations.remove_original_applicants"):
            data_migration(
                "applicant-table",
                "application-table",
                "clinics-table",
                "eu-west-2",
                False,
                self._make_dynamodb(at, apt, ct),
                "migrate_applicants",
            )
        assert mock_migrate.call_count == 2
