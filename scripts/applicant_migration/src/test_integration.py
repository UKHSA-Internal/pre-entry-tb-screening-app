"""
Integration tests for migration_script.py against DynamoDB Local.
"""

import importlib
import sys

import pytest

from conftest import _stub_awsglue, APPLICANT_TABLE, APPLICATION_TABLE


def make_statistics():
    return {
        "all_applicants": 0,
        "all_applications": 0,
        "skipped_missing": 0,
        "skipped_migrated": 0,
        "skipped_rows_not_root": 0,
        "skipped_updating_statusgroup": 0,
        "migrated_applicants": 0,
        "migrated_applications": 0,
        "applicants_to_remove": [],
    }


@pytest.fixture()
def migration_module():
    """Fresh import of migration_script for every test."""
    _stub_awsglue(dry_run=False)
    sys.modules.pop("migration_script", None)
    mod = importlib.import_module("migration_script")
    mod.statistics = make_statistics()
    return mod


@pytest.fixture()
def mod(migration_module):
    return migration_module


# Helpers
def _seed_applicant(table, pk, sk="APPLICANT#DETAILS", passport_id=None, **extra):
    item = {"pk": pk, "sk": sk}
    if passport_id is not None:
        item["passportId"] = passport_id
    item.update(extra)
    table.put_item(Item=item)
    return item


def _seed_application_root(table, pk, status=None, **extra):
    item = {"pk": pk, "sk": "APPLICATION#ROOT"}
    if status is not None:
        item["applicationStatus"] = status
    item.update(extra)
    table.put_item(Item=item)
    return item


def _seed_application_tb(table, pk, is_issued=None):
    item = {"pk": pk, "sk": "APPLICATION#TB#CERTIFICATE"}
    if is_issued is not None:
        item["isIssued"] = is_issued
    table.put_item(Item=item)
    return item


def _get(table, pk, sk):
    return table.get_item(Key={"pk": pk, "sk": sk}).get("Item")


def _run(mod, dry_run, dynamodb_local, migration="applicant_migration"):
    """Call data_migration and return the module-level statistics dict."""
    mod.statistics = make_statistics()
    mod.data_migration(
        APPLICANT_TABLE,
        APPLICATION_TABLE,
        "eu-west-2",
        dry_run,
        dynamodb=dynamodb_local,
        migration=migration,
    )
    return mod.statistics


class TestApplicantMigrationLive:
    """End-to-end applicant migration with real DynamoDB Local (dry_run=False)."""

    def test_new_applicant_record_created_under_passport_pk(self, mod, tables, dynamodb_local):
        """New record exists at passportId PK after migration."""
        applicant_table, application_table = tables
        _seed_applicant(
            applicant_table,
            "APPLICATION#abc",
            passport_id="COUNTRY#GB#PASSPORT#1",
            name="Alice",
        )
        _seed_application_root(application_table, "APPLICATION#abc")

        _run(mod, dry_run=False, dynamodb_local=dynamodb_local)

        new = _get(applicant_table, "COUNTRY#GB#PASSPORT#1", "APPLICANT#DETAILS")
        assert new is not None
        assert new["pk"] == "COUNTRY#GB#PASSPORT#1"

    def test_all_attributes_preserved_on_new_record(self, mod, tables, dynamodb_local):
        """Extra attributes copied to the new record."""
        applicant_table, application_table = tables
        _seed_applicant(
            applicant_table,
            "APPLICATION#abc",
            passport_id="COUNTRY#GB#PASSPORT#1",
            name="Alice",
            dob="1990-01-01",
            nationality="British",
        )
        _seed_application_root(application_table, "APPLICATION#abc")

        _run(mod, dry_run=False, dynamodb_local=dynamodb_local)

        new = _get(applicant_table, "COUNTRY#GB#PASSPORT#1", "APPLICANT#DETAILS")
        assert new["name"] == "Alice"
        assert new["dob"] == "1990-01-01"
        assert new["nationality"] == "British"

    def test_old_applicant_record_deleted(self, mod, tables, dynamodb_local):
        """Original APPLICATION# key is removed after migration."""
        applicant_table, application_table = tables
        _seed_applicant(applicant_table, "APPLICATION#abc", passport_id="COUNTRY#GB#PASSPORT#1")
        _seed_application_root(application_table, "APPLICATION#abc")

        _run(mod, dry_run=False, dynamodb_local=dynamodb_local)

        old = _get(applicant_table, "APPLICATION#abc", "APPLICANT#DETAILS")
        assert old is None

    def test_application_root_applicant_id_updated(self, mod, tables, dynamodb_local):
        """applicantId field written to APPLICATION#ROOT."""
        applicant_table, application_table = tables
        _seed_applicant(applicant_table, "APPLICATION#abc", passport_id="COUNTRY#GB#PASSPORT#1")
        _seed_application_root(application_table, "APPLICATION#abc")

        _run(mod, dry_run=False, dynamodb_local=dynamodb_local)

        root = _get(application_table, "APPLICATION#abc", "APPLICATION#ROOT")
        assert root["applicantId"] == "COUNTRY#GB#PASSPORT#1"

    @pytest.mark.parametrize(
        "is_issued,expected_status",
        [
            ("Yes", "Certificate Available"),
            ("No", "Certificate Not Issued"),
            (None, "In Progress"),
        ],
    )
    def test_application_status_derived_from_tb_certificate(
        self, mod, tables, dynamodb_local, is_issued, expected_status
    ):
        """applicationStatus set correctly based on TB isIssued value."""
        applicant_table, application_table = tables
        _seed_applicant(applicant_table, "APPLICATION#abc", passport_id="COUNTRY#GB#PASSPORT#1")
        _seed_application_root(application_table, "APPLICATION#abc")
        if is_issued is not None:
            _seed_application_tb(application_table, "APPLICATION#abc", is_issued=is_issued)

        _run(mod, dry_run=False, dynamodb_local=dynamodb_local)

        root = _get(application_table, "APPLICATION#abc", "APPLICATION#ROOT")
        assert root["applicationStatus"] == expected_status

    def test_statistics_reflect_migrated_applicants(self, mod, tables, dynamodb_local):
        """Statistics counters correct after single migration."""
        applicant_table, application_table = tables
        _seed_applicant(applicant_table, "APPLICATION#abc", passport_id="COUNTRY#GB#PASSPORT#1")
        _seed_application_root(application_table, "APPLICATION#abc")

        stats = _run(mod, dry_run=False, dynamodb_local=dynamodb_local)

        assert stats["all_applicants"] == 1
        assert stats["migrated_applicants"] == 1
        assert stats["skipped_missing"] == 0
        assert stats["skipped_migrated"] == 0


class TestApplicantMigrationDryRun:
    """applicant_migration with dry_run=True: no writes, counts correct."""

    def test_no_new_record_written(self, mod, tables, dynamodb_local):
        """dry_run=True → passport-PK record must not be created."""
        applicant_table, application_table = tables
        _seed_applicant(applicant_table, "APPLICATION#abc", passport_id="COUNTRY#GB#PASSPORT#1")
        _seed_application_root(application_table, "APPLICATION#abc")

        _run(mod, dry_run=True, dynamodb_local=dynamodb_local)

        new = _get(applicant_table, "COUNTRY#GB#PASSPORT#1", "APPLICANT#DETAILS")
        assert new is None

    def test_old_record_not_deleted(self, mod, tables, dynamodb_local):
        """dry_run=True → original APPLICATION# record still exists."""
        applicant_table, application_table = tables
        _seed_applicant(applicant_table, "APPLICATION#abc", passport_id="COUNTRY#GB#PASSPORT#1")
        _seed_application_root(application_table, "APPLICATION#abc")

        _run(mod, dry_run=True, dynamodb_local=dynamodb_local)

        old = _get(applicant_table, "APPLICATION#abc", "APPLICANT#DETAILS")
        assert old is not None

    def test_application_root_not_modified(self, mod, tables, dynamodb_local):
        """dry_run=True → APPLICATION#ROOT row unchanged (no applicantId)."""
        applicant_table, application_table = tables
        _seed_applicant(applicant_table, "APPLICATION#abc", passport_id="COUNTRY#GB#PASSPORT#1")
        _seed_application_root(application_table, "APPLICATION#abc")

        _run(mod, dry_run=True, dynamodb_local=dynamodb_local)

        root = _get(application_table, "APPLICATION#abc", "APPLICATION#ROOT")
        assert "applicantId" not in root

    def test_statistics_still_counted(self, mod, tables, dynamodb_local):
        """dry_run=True → migrated_applicants still incremented."""
        applicant_table, application_table = tables
        _seed_applicant(applicant_table, "APPLICATION#abc", passport_id="COUNTRY#GB#PASSPORT#1")
        _seed_application_root(application_table, "APPLICATION#abc")

        stats = _run(mod, dry_run=True, dynamodb_local=dynamodb_local)

        assert stats["migrated_applicants"] == 1
        assert stats["all_applicants"] == 1


class TestApplicantMigrationSkips:
    """Records that should be skipped entirely."""

    def test_already_migrated_record_not_touched(self, mod, tables, dynamodb_local):
        """pk == passportId → skipped_migrated counted, record unchanged."""
        applicant_table, _ = tables
        pk = "COUNTRY#GB#PASSPORT#1"
        _seed_applicant(applicant_table, pk, passport_id=pk, name="Already done")

        stats = _run(mod, dry_run=False, dynamodb_local=dynamodb_local)

        assert stats["skipped_migrated"] == 1
        assert stats["migrated_applicants"] == 0
        rec = _get(applicant_table, pk, "APPLICANT#DETAILS")
        assert rec is not None  # original record untouched

    def test_missing_passport_id_skipped(self, mod, tables, dynamodb_local):
        """No passportId → skipped_missing counted, record not migrated."""
        applicant_table, _ = tables
        _seed_applicant(applicant_table, "APPLICATION#abc")  # no passportId

        stats = _run(mod, dry_run=False, dynamodb_local=dynamodb_local)

        assert stats["skipped_missing"] == 1
        assert stats["migrated_applicants"] == 0
        # Original record still present
        old = _get(applicant_table, "APPLICATION#abc", "APPLICANT#DETAILS")
        assert old is not None

    def test_missing_application_root_row_skipped(self, mod, tables, dynamodb_local):
        """No APPLICATION#ROOT in application table → applicant not migrated."""
        applicant_table, _ = tables
        _seed_applicant(applicant_table, "APPLICATION#abc", passport_id="COUNTRY#GB#PASSPORT#1")
        # Do NOT seed APPLICATION#ROOT

        stats = _run(mod, dry_run=False, dynamodb_local=dynamodb_local)

        assert stats["migrated_applicants"] == 0
        new = _get(applicant_table, "COUNTRY#GB#PASSPORT#1", "APPLICANT#DETAILS")
        assert new is None


class TestApplicationStatusgroupLive:
    """application_statusgroup migration writes applicationStatusGroup correctly."""

    @pytest.mark.parametrize(
        "app_status,expected_group",
        [
            ("Certificate Available", "Complete"),
            ("Certificate Not Issued", "Complete"),
            ("Cancelled", "Complete"),
            ("In Progress", "Incomplete"),
        ],
    )
    def test_statusgroup_written_for_each_application_status(
        self, mod, tables, dynamodb_local, app_status, expected_group
    ):
        """applicationStatusGroup derived correctly from applicationStatus."""
        _, application_table = tables
        _seed_application_root(application_table, "APPLICATION#abc", status=app_status)

        _run(
            mod,
            dry_run=False,
            dynamodb_local=dynamodb_local,
            migration="application_statusgroup",
        )

        root = _get(application_table, "APPLICATION#abc", "APPLICATION#ROOT")
        assert root["applicationStatusGroup"] == expected_group

    def test_non_root_row_ignored(self, mod, tables, dynamodb_local):
        """Rows with sk != APPLICATION#ROOT are not updated."""
        _, application_table = tables
        # Seed a root row and a non-root row in the same table
        _seed_application_root(application_table, "APPLICATION#abc", status="In Progress")
        # Seed a TB certificate row (non-root) — it should be filtered out by scan
        application_table.put_item(
            Item={
                "pk": "APPLICATION#abc",
                "sk": "APPLICATION#TB#CERTIFICATE",
                "isIssued": "Yes",
            }
        )

        stats = _run(
            mod,
            dry_run=False,
            dynamodb_local=dynamodb_local,
            migration="application_statusgroup",
        )

        # Only the root row should have been processed
        assert stats["skipped_rows_not_root"] == 0
        assert stats["migrated_applications"] == 1

    def test_statistics_migrated_applications_incremented(self, mod, tables, dynamodb_local):
        _, application_table = tables
        _seed_application_root(application_table, "APPLICATION#abc", status="In Progress")

        stats = _run(
            mod,
            dry_run=False,
            dynamodb_local=dynamodb_local,
            migration="application_statusgroup",
        )

        assert stats["migrated_applications"] == 1
        assert stats["all_applications"] == 1


class TestApplicationStatusgroupDryRun:
    """application_statusgroup with dry_run=True."""

    def test_statusgroup_not_written(self, mod, tables, dynamodb_local):
        """dry_run=True → applicationStatusGroup must NOT be written."""
        _, application_table = tables
        _seed_application_root(application_table, "APPLICATION#abc", status="In Progress")

        _run(
            mod,
            dry_run=True,
            dynamodb_local=dynamodb_local,
            migration="application_statusgroup",
        )

        root = _get(application_table, "APPLICATION#abc", "APPLICATION#ROOT")
        assert "applicationStatusGroup" not in root

    def test_statistics_still_counted(self, mod, tables, dynamodb_local):
        """dry_run=True → migrated_applications still counted."""
        _, application_table = tables
        _seed_application_root(application_table, "APPLICATION#abc", status="In Progress")

        stats = _run(
            mod,
            dry_run=True,
            dynamodb_local=dynamodb_local,
            migration="application_statusgroup",
        )

        assert stats["migrated_applications"] == 1


class TestPagination:
    """Seed more records than a single DynamoDB scan page and verify all are migrated."""

    def test_all_applicants_migrated_across_multiple_pages(self, mod, tables, dynamodb_local):
        """With >1 page of applicants, every record is migrated."""
        applicant_table, application_table = tables
        n = 30  # Enough to span multiple pages at default DynamoDB Local limit

        for i in range(n):
            pk = f"APPLICATION#{i}"
            passport_id = f"COUNTRY#GB#PASSPORT#{i}"
            _seed_applicant(applicant_table, pk, passport_id=passport_id)
            _seed_application_root(application_table, pk)

        stats = _run(mod, dry_run=False, dynamodb_local=dynamodb_local)

        assert stats["migrated_applicants"] == n
        assert stats["all_applicants"] == n

        # Spot-check a few new records exist and old ones are gone
        for i in [0, 14, 29]:
            new = _get(applicant_table, f"COUNTRY#GB#PASSPORT#{i}", "APPLICANT#DETAILS")
            assert new is not None, f"Record {i} was not migrated"
            old = _get(applicant_table, f"APPLICATION#{i}", "APPLICANT#DETAILS")
            assert old is None, f"Old record {i} was not deleted"

    def test_all_applications_statusgroup_set_across_multiple_pages(
        self, mod, tables, dynamodb_local
    ):
        """With >1 page of application root rows, every row gets a statusGroup."""
        _, application_table = tables
        n = 30

        for i in range(n):
            _seed_application_root(application_table, f"APPLICATION#{i}", status="In Progress")

        stats = _run(
            mod,
            dry_run=False,
            dynamodb_local=dynamodb_local,
            migration="application_statusgroup",
        )

        assert stats["migrated_applications"] == n

        for i in [0, 14, 29]:
            root = _get(application_table, f"APPLICATION#{i}", "APPLICATION#ROOT")
            assert root.get("applicationStatusGroup") == "Incomplete"
