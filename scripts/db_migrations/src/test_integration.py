"""
Integration tests for migrations.py against DynamoDB Local.
"""

import importlib
import sys

import pytest

from conftest import (
    APPLICANT_TABLE,
    APPLICATION_TABLE,
    CLINICS_TABLE,
    _stub_awsglue,
    make_statistics,
)


@pytest.fixture()
def migration_module():
    """Fresh import of migrations for every test."""
    _stub_awsglue(dry_run=False)
    sys.modules.pop("migrations", None)
    mod = importlib.import_module("migrations")
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


def _seed_clinics(table, pk, **extra):
    item = {"pk": pk, "sk": "CLINIC#ROOT"}
    item["clinicId"] = pk.split("#")[1]
    item.update(extra)
    table.put_item(Item=item)
    return item


def _get(table, pk, sk):
    return table.get_item(Key={"pk": pk, "sk": sk}).get("Item")


def _run(mod, dry_run, dynamodb_local, migration="migrate_applicants"):
    """Call data_migration and return the module-level statistics dict."""
    mod.statistics = make_statistics()
    mod.data_migration(
        APPLICANT_TABLE,
        APPLICATION_TABLE,
        CLINICS_TABLE,
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
        applicant_table, application_table, _clinics_table = tables
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
        applicant_table, application_table, _clinics_table = tables
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
        applicant_table, application_table, _clinics_table = tables
        _seed_applicant(applicant_table, "APPLICATION#abc", passport_id="COUNTRY#GB#PASSPORT#1")
        _seed_application_root(application_table, "APPLICATION#abc")

        _run(mod, dry_run=False, dynamodb_local=dynamodb_local)

        old = _get(applicant_table, "APPLICATION#abc", "APPLICANT#DETAILS")
        assert old is None

    def test_application_root_applicant_id_updated(self, mod, tables, dynamodb_local):
        """applicantId field written to APPLICATION#ROOT."""
        applicant_table, application_table, _clinics_table = tables
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
        applicant_table, application_table, _clinics_table = tables
        _seed_applicant(applicant_table, "APPLICATION#abc", passport_id="COUNTRY#GB#PASSPORT#1")
        _seed_application_root(application_table, "APPLICATION#abc")
        if is_issued is not None:
            _seed_application_tb(application_table, "APPLICATION#abc", is_issued=is_issued)

        _run(mod, dry_run=False, dynamodb_local=dynamodb_local)

        root = _get(application_table, "APPLICATION#abc", "APPLICATION#ROOT")
        assert root["applicationStatus"] == expected_status

    def test_statistics_reflect_migrated_applicants(self, mod, tables, dynamodb_local):
        """Statistics counters correct after single migration."""
        applicant_table, application_table, _clinics_table = tables
        _seed_applicant(applicant_table, "APPLICATION#abc", passport_id="COUNTRY#GB#PASSPORT#1")
        _seed_application_root(application_table, "APPLICATION#abc")

        stats = _run(mod, dry_run=False, dynamodb_local=dynamodb_local)

        assert stats["all_applicants"] == 1
        assert stats["migrated_applicants"] == 1
        assert stats["skipped_missing"] == 0
        assert stats["skipped_migrated"] == 0


class TestApplicantMigrationDryRun:
    """migrate_applicants with dry_run=True: no writes, counts correct."""

    def test_no_new_record_written(self, mod, tables, dynamodb_local):
        """dry_run=True → passport-PK record must not be created."""
        applicant_table, application_table, _clinics_table = tables
        _seed_applicant(applicant_table, "APPLICATION#abc", passport_id="COUNTRY#GB#PASSPORT#1")
        _seed_application_root(application_table, "APPLICATION#abc")

        _run(mod, dry_run=True, dynamodb_local=dynamodb_local)

        new = _get(applicant_table, "COUNTRY#GB#PASSPORT#1", "APPLICANT#DETAILS")
        assert new is None

    def test_old_record_not_deleted(self, mod, tables, dynamodb_local):
        """dry_run=True → original APPLICATION# record still exists."""
        applicant_table, application_table, _clinics_table = tables
        _seed_applicant(applicant_table, "APPLICATION#abc", passport_id="COUNTRY#GB#PASSPORT#1")
        _seed_application_root(application_table, "APPLICATION#abc")

        _run(mod, dry_run=True, dynamodb_local=dynamodb_local)

        old = _get(applicant_table, "APPLICATION#abc", "APPLICANT#DETAILS")
        assert old is not None

    def test_application_root_not_modified(self, mod, tables, dynamodb_local):
        """dry_run=True → APPLICATION#ROOT row unchanged (no applicantId)."""
        applicant_table, application_table, _clinics_table = tables
        _seed_applicant(applicant_table, "APPLICATION#abc", passport_id="COUNTRY#GB#PASSPORT#1")
        _seed_application_root(application_table, "APPLICATION#abc")

        _run(mod, dry_run=True, dynamodb_local=dynamodb_local)

        root = _get(application_table, "APPLICATION#abc", "APPLICATION#ROOT")
        assert "applicantId" not in root

    def test_statistics_still_counted(self, mod, tables, dynamodb_local):
        """dry_run=True → migrated_applicants still incremented."""
        applicant_table, application_table, _clinics_table = tables
        _seed_applicant(applicant_table, "APPLICATION#abc", passport_id="COUNTRY#GB#PASSPORT#1")
        _seed_application_root(application_table, "APPLICATION#abc")

        stats = _run(mod, dry_run=True, dynamodb_local=dynamodb_local)

        assert stats["migrated_applicants"] == 1
        assert stats["all_applicants"] == 1


class TestApplicantMigrationSkips:
    """Records that should be skipped entirely."""

    def test_already_migrated_record_not_touched(self, mod, tables, dynamodb_local):
        """pk == passportId → skipped_migrated counted, record unchanged."""
        applicant_table, _, _ = tables
        pk = "COUNTRY#GB#PASSPORT#1"
        _seed_applicant(applicant_table, pk, passport_id=pk, name="Already done")

        stats = _run(mod, dry_run=False, dynamodb_local=dynamodb_local)

        assert stats["skipped_migrated"] == 1
        assert stats["migrated_applicants"] == 0
        rec = _get(applicant_table, pk, "APPLICANT#DETAILS")
        assert rec is not None  # original record untouched

    def test_missing_passport_id_skipped(self, mod, tables, dynamodb_local):
        """No passportId → skipped_missing counted, record not migrated."""
        applicant_table, _, _ = tables
        _seed_applicant(applicant_table, "APPLICATION#abc")  # no passportId

        stats = _run(mod, dry_run=False, dynamodb_local=dynamodb_local)

        assert stats["skipped_missing"] == 1
        assert stats["migrated_applicants"] == 0
        # Original record still present
        old = _get(applicant_table, "APPLICATION#abc", "APPLICANT#DETAILS")
        assert old is not None

    def test_missing_application_root_row_skipped(self, mod, tables, dynamodb_local):
        """No APPLICATION#ROOT in application table → applicant not migrated."""
        applicant_table, _, _ = tables
        _seed_applicant(applicant_table, "APPLICATION#abc", passport_id="COUNTRY#GB#PASSPORT#1")
        # Do NOT seed APPLICATION#ROOT

        stats = _run(mod, dry_run=False, dynamodb_local=dynamodb_local)

        assert stats["migrated_applicants"] == 0
        new = _get(applicant_table, "COUNTRY#GB#PASSPORT#1", "APPLICANT#DETAILS")
        assert new is None


class TestApplicationStatusgroupLive:
    """set_application_statusgroup migration writes applicationStatusGroup correctly."""

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
        _, application_table, _ = tables
        _seed_application_root(application_table, "APPLICATION#abc", status=app_status)

        _run(
            mod,
            dry_run=False,
            dynamodb_local=dynamodb_local,
            migration="set_application_statusgroup",
        )

        root = _get(application_table, "APPLICATION#abc", "APPLICATION#ROOT")
        assert root["applicationStatusGroup"] == expected_group

    def test_non_root_row_ignored(self, mod, tables, dynamodb_local):
        """Rows with sk != APPLICATION#ROOT are not updated."""
        _, application_table, _ = tables
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
            migration="set_application_statusgroup",
        )

        # Only the root row should have been processed
        assert stats["skipped_rows_not_root"] == 0
        assert stats["migrated_applications"] == 1

    def test_statistics_migrated_applications_incremented(self, mod, tables, dynamodb_local):
        _, application_table, _ = tables
        _seed_application_root(application_table, "APPLICATION#abc", status="In Progress")

        stats = _run(
            mod,
            dry_run=False,
            dynamodb_local=dynamodb_local,
            migration="set_application_statusgroup",
        )

        assert stats["migrated_applications"] == 1
        assert stats["all_applications"] == 1


class TestApplicationStatusgroupDryRun:
    """set_application_statusgroup with dry_run=True."""

    def test_statusgroup_not_written(self, mod, tables, dynamodb_local):
        """dry_run=True → applicationStatusGroup must NOT be written."""
        _, application_table, _ = tables
        _seed_application_root(application_table, "APPLICATION#abc", status="In Progress")

        _run(
            mod,
            dry_run=True,
            dynamodb_local=dynamodb_local,
            migration="set_application_statusgroup",
        )

        root = _get(application_table, "APPLICATION#abc", "APPLICATION#ROOT")
        assert "applicationStatusGroup" not in root

    def test_statistics_still_counted(self, mod, tables, dynamodb_local):
        """dry_run=True → migrated_applications still counted."""
        _, application_table, _ = tables
        _seed_application_root(application_table, "APPLICATION#abc", status="In Progress")

        stats = _run(
            mod,
            dry_run=True,
            dynamodb_local=dynamodb_local,
            migration="set_application_statusgroup",
        )

        assert stats["migrated_applications"] == 1


class TestPagination:
    """Seed more records than a single DynamoDB scan page and verify all are migrated."""

    def test_all_applicants_migrated_across_multiple_pages(self, mod, tables, dynamodb_local):
        """With >1 page of applicants, every record is migrated."""
        applicant_table, application_table, _clinics_table = tables
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
        _, application_table, _ = tables
        n = 30

        for i in range(n):
            _seed_application_root(application_table, f"APPLICATION#{i}", status="In Progress")

        stats = _run(
            mod,
            dry_run=False,
            dynamodb_local=dynamodb_local,
            migration="set_application_statusgroup",
        )

        assert stats["migrated_applications"] == n

        for i in [0, 14, 29]:
            root = _get(application_table, f"APPLICATION#{i}", "APPLICATION#ROOT")
            assert root.get("applicationStatusGroup") == "Incomplete"


class TestRewriteClinicRecordsLive:
    """rewrite_clinic_records migration rewrites clinicId in place (dry_run=False)."""

    def test_clinic_record_still_exists_after_rewrite(self, mod, tables, dynamodb_local):
        """Record is still present after the rewrite."""
        _, _, clinics_table = tables
        _seed_clinics(clinics_table, "CLINIC#abc")

        _run(mod, dry_run=False, dynamodb_local=dynamodb_local, migration="rewrite_clinic_records")

        record = _get(clinics_table, "CLINIC#abc", "CLINIC#ROOT")
        assert record is not None

    def test_clinic_id_value_unchanged_after_rewrite(self, mod, tables, dynamodb_local):
        """clinicId attribute value is preserved (same value written back)."""
        _, _, clinics_table = tables
        _seed_clinics(clinics_table, "CLINIC#abc", clinicName="Test Clinic")

        _run(mod, dry_run=False, dynamodb_local=dynamodb_local, migration="rewrite_clinic_records")

        record = _get(clinics_table, "CLINIC#abc", "CLINIC#ROOT")
        assert record["clinicId"] == "abc"

    def test_extra_attributes_preserved_after_rewrite(self, mod, tables, dynamodb_local):
        """Attributes other than clinicId are untouched after the rewrite."""
        _, _, clinics_table = tables
        _seed_clinics(clinics_table, "CLINIC#abc", clinicName="Test Clinic", city="London")

        _run(mod, dry_run=False, dynamodb_local=dynamodb_local, migration="rewrite_clinic_records")

        record = _get(clinics_table, "CLINIC#abc", "CLINIC#ROOT")
        assert record["clinicName"] == "Test Clinic"
        assert record["city"] == "London"

    def test_statistics_rewritten_clinic_rows_incremented(self, mod, tables, dynamodb_local):
        """rewritten_clinic_rows counter is incremented for each record."""
        _, _, clinics_table = tables
        _seed_clinics(clinics_table, "CLINIC#abc")
        _seed_clinics(clinics_table, "CLINIC#xyz")

        stats = _run(
            mod, dry_run=False, dynamodb_local=dynamodb_local, migration="rewrite_clinic_records"
        )

        assert stats["rewritten_clinic_rows"] == 2

    def test_multiple_clinic_records_all_rewritten(self, mod, tables, dynamodb_local):
        """All seeded clinic records survive the rewrite with correct clinicId."""
        _, _, clinics_table = tables
        clinic_ids = ["abc", "def", "ghi"]
        for cid in clinic_ids:
            _seed_clinics(clinics_table, f"CLINIC#{cid}")

        _run(mod, dry_run=False, dynamodb_local=dynamodb_local, migration="rewrite_clinic_records")

        for cid in clinic_ids:
            record = _get(clinics_table, f"CLINIC#{cid}", "CLINIC#ROOT")
            assert record is not None
            assert record["clinicId"] == cid


class TestRewriteClinicRecordsDryRun:
    """rewrite_clinic_records with dry_run=True: records unchanged, counter still incremented."""

    def test_dry_run_record_still_exists(self, mod, tables, dynamodb_local):
        """Record is not deleted during dry run."""
        _, _, clinics_table = tables
        _seed_clinics(clinics_table, "CLINIC#abc")

        _run(mod, dry_run=True, dynamodb_local=dynamodb_local, migration="rewrite_clinic_records")

        record = _get(clinics_table, "CLINIC#abc", "CLINIC#ROOT")
        assert record is not None

    def test_dry_run_counter_incremented(self, mod, tables, dynamodb_local):
        """dry_run=True → rewritten_clinic_rows is still counted."""
        _, _, clinics_table = tables
        _seed_clinics(clinics_table, "CLINIC#abc")

        stats = _run(
            mod, dry_run=True, dynamodb_local=dynamodb_local, migration="rewrite_clinic_records"
        )

        assert stats["rewritten_clinic_rows"] == 1


class TestRewriteClinicRecordsPagination:
    """verify all clinic records are processed across multiple scan pages."""

    def test_all_clinic_records_rewritten_across_pages(self, mod, tables, dynamodb_local):
        """With >1 page of clinic records, every record's clinicId is rewritten."""
        _, _, clinics_table = tables
        n = 30

        for i in range(n):
            _seed_clinics(clinics_table, f"CLINIC#{i}")

        stats = _run(
            mod, dry_run=False, dynamodb_local=dynamodb_local, migration="rewrite_clinic_records"
        )

        assert stats["rewritten_clinic_rows"] == n

        for i in [0, 14, 29]:
            record = _get(clinics_table, f"CLINIC#{i}", "CLINIC#ROOT")
            assert record is not None, f"Clinic record {i} missing after rewrite"
            assert record["clinicId"] == str(i)


def _seed_applicant_with_country(table, pk, country_of_issue="GB", **extra):
    item = {"pk": pk, "sk": "APPLICANT#DETAILS", "countryOfIssue": country_of_issue}
    item.update(extra)
    table.put_item(Item=item)
    return item


def _seed_application_with_date(
    table, pk, sk="APPLICATION#ROOT", date_created="2024-01-01", **extra
):
    item = {"pk": pk, "sk": sk, "dateCreated": date_created}
    item.update(extra)
    table.put_item(Item=item)
    return item


class TestRewriteApplicantRecordsLive:
    """rewrite_applicant_records migration rewrites countryOfIssue in place (dry_run=False)."""

    def test_record_still_exists_after_rewrite(self, mod, tables, dynamodb_local):
        """Record is still present after the rewrite."""
        applicant_table, _, _ = tables
        _seed_applicant_with_country(applicant_table, "COUNTRY#GB#PASSPORT#1")

        _run(
            mod, dry_run=False, dynamodb_local=dynamodb_local, migration="rewrite_applicant_records"
        )

        record = _get(applicant_table, "COUNTRY#GB#PASSPORT#1", "APPLICANT#DETAILS")
        assert record is not None

    def test_country_of_issue_value_unchanged_after_rewrite(self, mod, tables, dynamodb_local):
        """countryOfIssue attribute value is preserved (same value written back)."""
        applicant_table, _, _ = tables
        _seed_applicant_with_country(
            applicant_table, "COUNTRY#GB#PASSPORT#1", country_of_issue="GB"
        )

        _run(
            mod, dry_run=False, dynamodb_local=dynamodb_local, migration="rewrite_applicant_records"
        )

        record = _get(applicant_table, "COUNTRY#GB#PASSPORT#1", "APPLICANT#DETAILS")
        assert record["countryOfIssue"] == "GB"

    def test_unrelated_attributes_preserved_after_rewrite(self, mod, tables, dynamodb_local):
        """Attributes other than countryOfIssue are untouched after the rewrite."""
        applicant_table, _, _ = tables
        _seed_applicant_with_country(
            applicant_table, "COUNTRY#GB#PASSPORT#1", name="Alice", dob="1990-01-01"
        )

        _run(
            mod, dry_run=False, dynamodb_local=dynamodb_local, migration="rewrite_applicant_records"
        )

        record = _get(applicant_table, "COUNTRY#GB#PASSPORT#1", "APPLICANT#DETAILS")
        assert record["name"] == "Alice"
        assert record["dob"] == "1990-01-01"

    def test_statistics_rewritten_applicant_rows_incremented(self, mod, tables, dynamodb_local):
        """rewritten_applicant_rows counter is incremented for each record."""
        applicant_table, _, _ = tables
        _seed_applicant_with_country(applicant_table, "COUNTRY#GB#PASSPORT#1")
        _seed_applicant_with_country(applicant_table, "COUNTRY#GB#PASSPORT#2")

        stats = _run(
            mod, dry_run=False, dynamodb_local=dynamodb_local, migration="rewrite_applicant_records"
        )

        assert stats["rewritten_applicant_rows"] == 2

    def test_multiple_records_all_rewritten(self, mod, tables, dynamodb_local):
        """All seeded applicant records survive the rewrite with correct countryOfIssue."""
        applicant_table, _, _ = tables
        passports = ["P1", "P2", "P3"]
        for p in passports:
            _seed_applicant_with_country(
                applicant_table, f"COUNTRY#GB#PASSPORT#{p}", country_of_issue="GB"
            )

        _run(
            mod, dry_run=False, dynamodb_local=dynamodb_local, migration="rewrite_applicant_records"
        )

        for p in passports:
            record = _get(applicant_table, f"COUNTRY#GB#PASSPORT#{p}", "APPLICANT#DETAILS")
            assert record is not None
            assert record["countryOfIssue"] == "GB"


class TestRewriteApplicantRecordsDryRun:
    """rewrite_applicant_records with dry_run=True: records unchanged, counter still incremented."""

    def test_dry_run_record_value_unchanged(self, mod, tables, dynamodb_local):
        """dry_run=True → countryOfIssue not altered (record stays as seeded)."""
        applicant_table, _, _ = tables
        _seed_applicant_with_country(
            applicant_table, "COUNTRY#GB#PASSPORT#1", country_of_issue="GB"
        )

        _run(
            mod, dry_run=True, dynamodb_local=dynamodb_local, migration="rewrite_applicant_records"
        )

        record = _get(applicant_table, "COUNTRY#GB#PASSPORT#1", "APPLICANT#DETAILS")
        assert record is not None
        assert record["countryOfIssue"] == "GB"

    def test_dry_run_counter_incremented(self, mod, tables, dynamodb_local):
        """dry_run=True → rewritten_applicant_rows is still counted."""
        applicant_table, _, _ = tables
        _seed_applicant_with_country(applicant_table, "COUNTRY#GB#PASSPORT#1")

        stats = _run(
            mod, dry_run=True, dynamodb_local=dynamodb_local, migration="rewrite_applicant_records"
        )

        assert stats["rewritten_applicant_rows"] == 1


class TestRewriteApplicationRootRecordsLive:
    """rewrite_application_root_records migration rewrites dateCreated in place (dry_run=False)."""

    def test_record_still_exists_after_rewrite(self, mod, tables, dynamodb_local):
        """APPLICATION#ROOT record is still present after the rewrite."""
        _, application_table, _ = tables
        _seed_application_with_date(application_table, "APPLICATION#abc")

        _run(
            mod,
            dry_run=False,
            dynamodb_local=dynamodb_local,
            migration="rewrite_application_root_records",
        )

        record = _get(application_table, "APPLICATION#abc", "APPLICATION#ROOT")
        assert record is not None

    def test_date_created_value_unchanged_after_rewrite(self, mod, tables, dynamodb_local):
        """dateCreated attribute value is preserved (same value written back)."""
        _, application_table, _ = tables
        _seed_application_with_date(application_table, "APPLICATION#abc", date_created="2024-06-15")

        _run(
            mod,
            dry_run=False,
            dynamodb_local=dynamodb_local,
            migration="rewrite_application_root_records",
        )

        record = _get(application_table, "APPLICATION#abc", "APPLICATION#ROOT")
        assert record["dateCreated"] == "2024-06-15"

    def test_statistics_rewritten_root_rows_incremented(self, mod, tables, dynamodb_local):
        """
        rewritten_application_nonroot_rows counter is incremented for each APPLICATION#ROOT record
        (source code increments nonroot counter when sk == APPLICATION#ROOT).
        """
        _, application_table, _ = tables
        _seed_application_with_date(application_table, "APPLICATION#abc")
        _seed_application_with_date(application_table, "APPLICATION#def")

        stats = _run(
            mod,
            dry_run=False,
            dynamodb_local=dynamodb_local,
            migration="rewrite_application_root_records",
        )

        assert stats["rewritten_application_nonroot_rows"] == 2

    def test_multiple_root_records_all_rewritten(self, mod, tables, dynamodb_local):
        """All seeded APPLICATION#ROOT records survive the rewrite."""
        _, application_table, _ = tables
        pks = ["APPLICATION#1", "APPLICATION#2", "APPLICATION#3"]
        for pk in pks:
            _seed_application_with_date(application_table, pk, date_created="2024-01-01")

        _run(
            mod,
            dry_run=False,
            dynamodb_local=dynamodb_local,
            migration="rewrite_application_root_records",
        )

        for pk in pks:
            record = _get(application_table, pk, "APPLICATION#ROOT")
            assert record is not None
            assert record["dateCreated"] == "2024-01-01"


class TestRewriteApplicationRootRecordsDryRun:
    """rewrite_application_root_records with dry_run=True."""

    def test_dry_run_record_value_unchanged(self, mod, tables, dynamodb_local):
        """dry_run=True → dateCreated not altered."""
        _, application_table, _ = tables
        _seed_application_with_date(application_table, "APPLICATION#abc", date_created="2024-06-15")

        _run(
            mod,
            dry_run=True,
            dynamodb_local=dynamodb_local,
            migration="rewrite_application_root_records",
        )

        record = _get(application_table, "APPLICATION#abc", "APPLICATION#ROOT")
        assert record["dateCreated"] == "2024-06-15"

    def test_dry_run_counter_incremented(self, mod, tables, dynamodb_local):
        """dry_run=True → rewritten_application_root_rows is still counted."""
        _, application_table, _ = tables
        _seed_application_with_date(application_table, "APPLICATION#abc")

        stats = _run(
            mod,
            dry_run=True,
            dynamodb_local=dynamodb_local,
            migration="rewrite_application_root_records",
        )

        # Note: source code increments rewritten_application_nonroot_rows for ROOT sk in dry_run
        assert stats["rewritten_application_nonroot_rows"] == 1


class TestRewriteApplicationNonrootRecordsLive:
    """rewrite_application_nonroot_records processes non-root rows only (dry_run=False)."""

    def test_nonroot_rows_counter_reflects_only_nonroot_seeds(self, mod, tables, dynamodb_local):
        """Only non-root rows are processed; ROOT rows not counted in nonroot counter."""
        _, application_table, _ = tables
        # Seed one ROOT row and two non-root rows
        _seed_application_with_date(
            application_table, "APPLICATION#abc", sk="APPLICATION#ROOT", date_created="2024-01-01"
        )
        _seed_application_with_date(
            application_table,
            "APPLICATION#abc",
            sk="APPLICATION#TB#CERTIFICATE",
            date_created="2024-01-01",
        )
        _seed_application_with_date(
            application_table,
            "APPLICATION#abc",
            sk="APPLICATION#SPUTUM",
            date_created="2024-01-01",
        )

        stats = _run(
            mod,
            dry_run=False,
            dynamodb_local=dynamodb_local,
            migration="rewrite_application_nonroot_records",
        )

        # source code: sk != APPLICATION#ROOT → rewritten_application_root_rows incremented
        assert stats["rewritten_application_root_rows"] == 2
        # rewritten_application_nonroot_rows should be zero (that branch needs sk = APPLICATION#ROOT
        # but those rows are excluded by the scan filter)
        assert stats["rewritten_application_nonroot_rows"] == 0

    def test_root_row_not_updated_by_nonroot_migration(self, mod, tables, dynamodb_local):
        """APPLICATION#ROOT row dateCreated is preserved (filtered out by scan)."""
        _, application_table, _ = tables
        _seed_application_with_date(
            application_table, "APPLICATION#abc", sk="APPLICATION#ROOT", date_created="ORIGINAL"
        )
        _seed_application_with_date(
            application_table,
            "APPLICATION#abc",
            sk="APPLICATION#TB#CERTIFICATE",
            date_created="2024-01-01",
        )

        _run(
            mod,
            dry_run=False,
            dynamodb_local=dynamodb_local,
            migration="rewrite_application_nonroot_records",
        )

        root = _get(application_table, "APPLICATION#abc", "APPLICATION#ROOT")
        # Root row must still exist and retain its original value (never touched by this migration)
        assert root is not None
        assert root["dateCreated"] == "ORIGINAL"
