"""
Integration tests for migration.py.

These tests run the full scan_applicant_table() flow against a real
DynamoDB Local instance (no mocks). DRY_RUN is always False so every
test exercises real read/write/delete operations.

Run:
  pytest test_integration.py -v

Requirements:
  pip install pytest pytest-docker boto3
  Docker must be available (pytest-docker handles start/stop automatically)
"""

import importlib
import os
import sys

import pytest

from conftest import _stub_awsglue, make_statistics
from enum import Enum


class ApplicationStatus(str, Enum):
  inProgress = "In Progress",
  certificateNotIssued = "Certificate Not Issued",
  certificateAvailable = "Certificate Available",
  cancelled = "Cancelled",

# ---------------------------------------------------------------------------
# Load migration module with DRY_RUN=False and tables pointing at local
# ---------------------------------------------------------------------------
@pytest.fixture(autouse=True)
def migration(tables):
    """
    Re-imports migration_script.py before each test with DRY_RUN=False.
    autouse=True means every test in this file gets a fresh module
    with clean module-level globals.
    """
    _stub_awsglue(dry_run=False)
    if "migration_script" in sys.modules:
        del sys.modules["migration_script"]
    mod = importlib.import_module("migration_script")
    return mod


@pytest.fixture()
def mod(migration):
    return migration


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _dynamodb_local(dynamodb_local):
    """Convenience alias used inside tests."""
    return dynamodb_local


def _seed_applicant(table, pk, sk="APPLICANT#DETAILS", passport_id=None, **extra):
    item = {"pk": pk, "sk": sk}
    if passport_id is not None:
        item["passportId"] = passport_id
    item.update(extra)
    table.put_item(Item=item)
    return item


def _seed_application_root(table, pk, status=None, **extra):
    item = {"pk": pk, "sk": "APPLICATION#ROOT"}
    if status:
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


def _get_item(table, pk, sk):
    response = table.get_item(Key={"pk": pk, "sk": sk})
    return response.get("Item")


def _run(mod, dynamodb_local):
    stats = make_statistics()
    mod.scan_applicant_table(stats, dynamodb=dynamodb_local)
    return stats


# ===========================================================================
# Happy path — single applicant migrated end-to-end
# ===========================================================================
class TestHappyPath:
    def setup(self):
        self.dry_run = os.getenv("DRY_RUN")
        os.putenv("DRY_RUN", "false")

    def teardown(self):
        os.putenv("DRY_RUN", str(self.dry_run))

    def test_new_applicant_record_is_created_with_passport_pk(
        self, mod, tables, dynamodb_local
    ):
        self.setup()
        applicant_table, application_table = tables
        _seed_applicant(
            applicant_table,
            pk="APPLICATION#abc",
            passport_id="COUNTRY#GB#PASSPORT#111",
            name="Alice",
        )
        _seed_application_root(application_table, "APPLICATION#abc", status="Approved")

        _run(mod, dynamodb_local)

        new_record = _get_item(
            applicant_table, "COUNTRY#GB#PASSPORT#111", "APPLICANT#DETAILS"
        )
        assert new_record is not None
        assert new_record["pk"] == "COUNTRY#GB#PASSPORT#111"
        assert new_record["name"] == "Alice"

    def test_old_applicant_record_is_deleted(self, mod, tables, dynamodb_local):
        applicant_table, application_table = tables
        _seed_applicant(
            applicant_table,
            pk="APPLICATION#abc",
            passport_id="COUNTRY#GB#PASSPORT#111",
        )
        _seed_application_root(application_table, "APPLICATION#abc", status="Approved")

        _run(mod, dynamodb_local)

        old_record = _get_item(applicant_table, "APPLICATION#abc", "APPLICANT#DETAILS")
        assert old_record is None

    def test_application_root_gets_applicant_id_and_status_updated(
        self, mod, tables, dynamodb_local
    ):
        applicant_table, application_table = tables
        _seed_applicant(
            applicant_table,
            pk="APPLICATION#abc",
            passport_id="COUNTRY#GB#PASSPORT#111",
        )
        _seed_application_root(application_table, "APPLICATION#abc", status="Approved")

        _run(mod, dynamodb_local)

        root = _get_item(application_table, "APPLICATION#abc", "APPLICATION#ROOT")
        assert root["applicantId"] == "COUNTRY#GB#PASSPORT#111"
        assert root["applicationStatus"] == "Approved"

    def test_all_extra_attributes_are_preserved_on_new_record(
        self, mod, tables, dynamodb_local
    ):
        applicant_table, application_table = tables
        _seed_applicant(
            applicant_table,
            pk="APPLICATION#abc",
            passport_id="COUNTRY#GB#PASSPORT#111",
            name="Alice",
            dob="1990-01-01",
            nationality="British",
        )
        _seed_application_root(application_table, "APPLICATION#abc", status="Approved")

        _run(mod, dynamodb_local)

        new_record = _get_item(
            applicant_table, "COUNTRY#GB#PASSPORT#111", "APPLICANT#DETAILS"
        )
        assert new_record["name"] == "Alice"
        assert new_record["dob"] == "1990-01-01"
        assert new_record["nationality"] == "British"

    def test_statistics_reflect_single_migration(self, mod, tables, dynamodb_local):
        applicant_table, application_table = tables
        _seed_applicant(
            applicant_table,
            pk="APPLICATION#abc",
            passport_id="COUNTRY#GB#PASSPORT#111",
        )
        _seed_application_root(application_table, "APPLICATION#abc", status="Approved")

        stats = _run(mod, dynamodb_local)

        assert stats["all_applicants"] == 1
        assert stats["migrated_applicants"] == 1
        assert stats["skipped_missing"] == 0
        assert stats["skipped_migrated"] == 0


# ===========================================================================
# Application status derivation — real DynamoDB reads
# ===========================================================================


class TestApplicationStatusDerivation:
    def test_status_taken_from_root_row_when_present(self, mod, tables, dynamodb_local):
        applicant_table, application_table = tables
        _seed_applicant(
            applicant_table, "APPLICATION#abc", passport_id="COUNTRY#GB#PASSPORT#1"
        )
        _seed_application_root(
            application_table, "APPLICATION#abc", status="Under Review"
        )

        _run(mod, dynamodb_local)

        root = _get_item(application_table, "APPLICATION#abc", "APPLICATION#ROOT")
        assert root["applicationStatus"] == "Under Review"

    def test_status_is_certificate_available_when_tb_issued_yes(
        self, mod, tables, dynamodb_local
    ):
        applicant_table, application_table = tables
        _seed_applicant(
            applicant_table, "APPLICATION#abc", passport_id="COUNTRY#GB#PASSPORT#1"
        )
        # No ROOT row — falls through to TB certificate
        _seed_application_tb(application_table, "APPLICATION#abc", is_issued="Yes")

        _run(mod, dynamodb_local)

        root = _get_item(application_table, "APPLICATION#abc", "APPLICATION#ROOT")
        # ROOT row didn't exist so update_item should have been a no-op
        # (ConditionalCheckFailed) — verify the TB row is still intact
        tb = _get_item(application_table, "APPLICATION#abc", "APPLICATION#TB#CERTIFICATE")
        assert tb["isIssued"] == "Yes"


    def test_status_is_certificate_not_issued_when_tb_issued_no(
        self, mod, tables, dynamodb_local
    ):
        applicant_table, application_table = tables
        _seed_applicant(
            applicant_table, "APPLICATION#abc", passport_id="COUNTRY#GB#PASSPORT#1"
        )
        _seed_application_root(application_table, "APPLICATION#abc")  # no status set
        _seed_application_tb(application_table, "APPLICATION#abc", is_issued="No")

        _run(mod, dynamodb_local)

        root = _get_item(application_table, "APPLICATION#abc", "APPLICATION#ROOT")
        assert root["applicationStatus"] == ApplicationStatus.certificateNotIssued

    def test_status_defaults_to_in_progress_when_no_tb_row(
        self, mod, tables, dynamodb_local
    ):
        applicant_table, application_table = tables
        _seed_applicant(
            applicant_table, "APPLICATION#abc", passport_id="COUNTRY#GB#PASSPORT#1"
        )
        _seed_application_root(application_table, "APPLICATION#abc")  # no status

        _run(mod, dynamodb_local)

        root = _get_item(application_table, "APPLICATION#abc", "APPLICATION#ROOT")
        assert root["applicationStatus"] == ApplicationStatus.inProgress


# ===========================================================================
# Skip conditions — records must be untouched
# ===========================================================================
class TestSkipConditions:
    def test_record_without_passport_id_is_not_migrated(
        self, mod, tables, dynamodb_local
    ):
        applicant_table, _ = tables
        _seed_applicant(applicant_table, pk="APPLICATION#abc")  # no passportId

        stats = _run(mod, dynamodb_local)

        # Original record still exists
        original = _get_item(applicant_table, "APPLICATION#abc", "APPLICANT#DETAILS")
        assert original is not None
        assert stats["skipped_missing"] == 1
        assert stats["migrated_applicants"] == 0

    def test_already_migrated_record_is_not_touched(self, mod, tables, dynamodb_local):
        applicant_table, _ = tables
        already_migrated_pk = "COUNTRY#GB#PASSPORT#111"
        _seed_applicant(
            applicant_table,
            pk=already_migrated_pk,
            passport_id=already_migrated_pk,  # pk == passportId
        )

        stats = _run(mod, dynamodb_local)

        record = _get_item(applicant_table, already_migrated_pk, "APPLICANT#DETAILS")
        assert record is not None
        assert stats["skipped_migrated"] == 1
        assert stats["migrated_applicants"] == 0


# ===========================================================================
# Multiple applicants — mixed scenarios in one scan
# ===========================================================================


class TestMultipleApplicants:
    def test_only_eligible_records_are_migrated(self, mod, tables, dynamodb_local):
        applicant_table, application_table = tables

        # Should migrate
        _seed_applicant(
            applicant_table, "APPLICATION#1", passport_id="COUNTRY#GB#PASSPORT#1"
        )
        _seed_application_root(application_table, "APPLICATION#1", status="Approved")

        # Should skip — no passportId
        _seed_applicant(applicant_table, "APPLICATION#2")

        # Should skip — already migrated
        _seed_applicant(
            applicant_table,
            pk="COUNTRY#GB#PASSPORT#3",
            passport_id="COUNTRY#GB#PASSPORT#3",
        )

        stats = _run(mod, dynamodb_local)

        assert stats["all_applicants"] == 3
        assert stats["migrated_applicants"] == 1
        assert stats["skipped_missing"] == 1
        assert stats["skipped_migrated"] == 1

    def test_multiple_eligible_records_are_all_migrated(
        self, mod, tables, dynamodb_local
    ):
        applicant_table, application_table = tables
        for i in range(1, 4):
            _seed_applicant(
                applicant_table,
                pk=f"APPLICATION#{i}",
                passport_id=f"COUNTRY#GB#PASSPORT#{i}",
            )
            _seed_application_root(
                application_table, f"APPLICATION#{i}", status="Approved"
            )

        stats = _run(mod, dynamodb_local)

        assert stats["migrated_applicants"] == 3
        for i in range(1, 4):
            assert (
                _get_item(
                    applicant_table, f"COUNTRY#GB#PASSPORT#{i}", "APPLICANT#DETAILS"
                )
                is not None
            )
            assert (
                _get_item(applicant_table, f"APPLICATION#{i}", "APPLICANT#DETAILS")
                is None
            )

    def test_old_records_all_deleted_after_batch_remove(
        self, mod, tables, dynamodb_local
    ):
        """Verify remove_original_applicants cleans up every queued pk."""
        applicant_table, application_table = tables
        for i in range(1, 6):
            _seed_applicant(
                applicant_table,
                pk=f"APPLICATION#{i}",
                passport_id=f"COUNTRY#GB#PASSPORT#{i}",
            )
            _seed_application_root(
                application_table, f"APPLICATION#{i}", status="Approved"
            )

        _run(mod, dynamodb_local)

        for i in range(1, 6):
            assert (
                _get_item(applicant_table, f"APPLICATION#{i}", "APPLICANT#DETAILS")
                is None
            )


# ===========================================================================
# Batch deletion boundary — exercises the 24-item slice bug
# ===========================================================================
class TestBatchDeletion:
    def test_exactly_25_records_deleted_in_single_batch(
        self, mod, tables, dynamodb_local
    ):
        """25 items fits exactly in one batch — all must be deleted."""
        applicant_table, application_table = tables
        for i in range(25):
            _seed_applicant(
                applicant_table,
                pk=f"APPLICATION#{i}",
                passport_id=f"COUNTRY#GB#PASSPORT#{i}",
            )
            _seed_application_root(
                application_table, f"APPLICATION#{i}", status="Approved"
            )

        stats = _run(mod, dynamodb_local)

        assert stats["migrated_applicants"] == 25
        for i in range(25):
            assert (
                _get_item(applicant_table, f"APPLICATION#{i}", "APPLICANT#DETAILS")
                is None
            )

    def test_more_than_25_records_are_all_deleted(self, mod, tables, dynamodb_local):
        """26+ records require multiple batch_writer calls — verify none are left behind."""
        applicant_table, application_table = tables
        for i in range(30):
            _seed_applicant(
                applicant_table,
                pk=f"APPLICATION#{i}",
                passport_id=f"COUNTRY#GB#PASSPORT#{i}",
            )
            _seed_application_root(
                application_table, f"APPLICATION#{i}", status="Approved"
            )

        stats = _run(mod, dynamodb_local)

        assert stats["migrated_applicants"] == 30
        for i in range(30):
            assert (
                _get_item(applicant_table, f"APPLICATION#{i}", "APPLICANT#DETAILS")
                is None
            )
