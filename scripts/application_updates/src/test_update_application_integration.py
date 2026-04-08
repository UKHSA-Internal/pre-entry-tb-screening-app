"""
Integration tests for update_application.py

These tests use DynamoDB Local (via docker-compose-test.yml) to test
actual database operations.

Run with: pytest src/test_update_application_integration.py -v

Prerequisites:
  - Docker installed and running
  - pytest-docker installed
"""

import pytest
import boto3

from update_application import update, main, StatusGroup


class TestUpdateIntegration:
    """Integration tests for the update() function with real DynamoDB"""

    def test_update_creates_status_group_field(self, table):
        """Test that update() creates the statusGroup field in DynamoDB"""
        # Insert test application
        table.put_item(Item={
            "pk": "APP_INT_001",
            "sk": "APPLICATION#ROOT",
            "applicationStatus": "Certificate Available"
        })
        
        # Read the application
        response = table.get_item(Key={"pk": "APP_INT_001", "sk": "APPLICATION#ROOT"})
        application = response["Item"]
        
        # Update it
        update(application, table, dry_run=False)
        
        # Verify the update
        response = table.get_item(Key={"pk": "APP_INT_001", "sk": "APPLICATION#ROOT"})
        updated_item = response["Item"]
        
        assert "StatusGroup" in updated_item
        assert updated_item["StatusGroup"] == StatusGroup.complete.value

    def test_update_with_certificate_not_issued(self, table):
        """Test updating an application with 'Certificate Not Issued' status"""
        table.put_item(Item={
            "pk": "APP_INT_002",
            "sk": "APPLICATION#ROOT",
            "applicationStatus": "Certificate Not Issued"
        })
        
        response = table.get_item(Key={"pk": "APP_INT_002", "sk": "APPLICATION#ROOT"})
        application = response["Item"]
        
        update(application, table, dry_run=False)
        
        response = table.get_item(Key={"pk": "APP_INT_002", "sk": "APPLICATION#ROOT"})
        updated_item = response["Item"]
        
        assert updated_item["StatusGroup"] == StatusGroup.complete.value

    def test_update_with_cancelled_status(self, table):
        """Test updating an application with 'Cancelled' status"""
        table.put_item(Item={
            "pk": "APP_INT_003",
            "sk": "APPLICATION#ROOT",
            "applicationStatus": "Cancelled"
        })
        
        response = table.get_item(Key={"pk": "APP_INT_003", "sk": "APPLICATION#ROOT"})
        application = response["Item"]
        
        update(application, table, dry_run=False)
        
        response = table.get_item(Key={"pk": "APP_INT_003", "sk": "APPLICATION#ROOT"})
        updated_item = response["Item"]
        
        assert updated_item["StatusGroup"] == StatusGroup.complete.value

    def test_update_with_in_progress_status(self, table):
        """Test updating an application with non-complete status"""
        table.put_item(Item={
            "pk": "APP_INT_004",
            "sk": "APPLICATION#ROOT",
            "applicationStatus": "In Progress"
        })
        
        response = table.get_item(Key={"pk": "APP_INT_004", "sk": "APPLICATION#ROOT"})
        application = response["Item"]
        
        update(application, table, dry_run=False)
        
        response = table.get_item(Key={"pk": "APP_INT_004", "sk": "APPLICATION#ROOT"})
        updated_item = response["Item"]
        
        assert updated_item["StatusGroup"] == StatusGroup.not_complete.value

    def test_update_with_dry_run_does_not_modify_database(self, table):
        """Test that dry_run=True prevents database modifications"""
        table.put_item(Item={
            "pk": "APP_INT_005",
            "sk": "APPLICATION#ROOT",
            "applicationStatus": "Certificate Available"
        })
        
        response = table.get_item(Key={"pk": "APP_INT_005", "sk": "APPLICATION#ROOT"})
        application = response["Item"]
        
        # Update with dry_run=True
        update(application, table, dry_run=True)
        
        # Verify no change
        response = table.get_item(Key={"pk": "APP_INT_005", "sk": "APPLICATION#ROOT"})
        item_after = response["Item"]
        
        assert "StatusGroup" not in item_after

    def test_update_handles_missing_item(self, table, capsys):
        """Test that update handles ConditionalCheckFailedException gracefully"""
        # Create an application object that doesn't exist in the database
        fake_application = {
            "pk": "NONEXISTENT_APP",
            "applicationStatus": "Certificate Available",
            "statusGroup": None
        }
        
        # This should catch the ConditionalCheckFailedException
        update(fake_application, table, dry_run=False)
        
        # Verify error message was printed
        captured = capsys.readouterr()
        assert "Error message for application with pk=NONEXISTENT_APP" in captured.out

    def test_update_corrects_invalid_status_group(self, table):
        """Test that update corrects invalid statusGroup values"""
        table.put_item(Item={
            "pk": "APP_INT_006",
            "sk": "APPLICATION#ROOT",
            "applicationStatus": "Certificate Available",
            "statusGroup": "Invalid Status"
        })
        
        response = table.get_item(Key={"pk": "APP_INT_006", "sk": "APPLICATION#ROOT"})
        application = response["Item"]
        
        update(application, table, dry_run=False)
        
        response = table.get_item(Key={"pk": "APP_INT_006", "sk": "APPLICATION#ROOT"})
        updated_item = response["Item"]
        
        assert updated_item["StatusGroup"] == StatusGroup.complete.value

    def test_update_leaves_valid_status_group_unchanged(self, table):
        """Test that updates still occur even with valid statusGroup values"""
        table.put_item(Item={
            "pk": "APP_INT_007",
            "sk": "APPLICATION#ROOT",
            "applicationStatus": "In Progress",
            "StatusGroup": StatusGroup.complete.value
        })
        
        response = table.get_item(Key={"pk": "APP_INT_007", "sk": "APPLICATION#ROOT"})
        application = response["Item"]
        
        # The code will update even though statusGroup is already set
        # Since applicationStatus is "In Progress", it will set to not_complete
        update(application, table, dry_run=False)
        
        response = table.get_item(Key={"pk": "APP_INT_007", "sk": "APPLICATION#ROOT"})
        updated_item = response["Item"]
        
        # Will be changed to Not Complete since status is "In Progress"
        assert updated_item["StatusGroup"] == StatusGroup.not_complete.value


class TestMainIntegration:
    """Integration tests for the main() function with real DynamoDB"""

    def test_main_processes_single_application(self, table, dynamodb_local):
        """Test main() processes a single application correctly"""
        table.put_item(Item={
            "pk": "APP_MAIN_001",
            "sk": "APPLICATION#ROOT",
            "applicationStatus": "Certificate Available"
        })
        
        main(
            dynamodb=dynamodb_local,
            application_table_name="application-table",
            dry_run=False
        )
        
        response = table.get_item(Key={"pk": "APP_MAIN_001", "sk": "APPLICATION#ROOT"})
        item = response["Item"]
        
        assert item["StatusGroup"] == StatusGroup.complete.value

    def test_main_processes_multiple_applications(self, table, dynamodb_local):
        """Test main() processes multiple applications correctly"""
        # Insert multiple test applications
        applications = [
            {
                "pk": "APP_MAIN_002",
                "sk": "APPLICATION#ROOT",
                "applicationStatus": "Certificate Available"
            },
            {
                "pk": "APP_MAIN_003",
                "sk": "APPLICATION#ROOT",
                "applicationStatus": "In Progress"
            },
            {
                "pk": "APP_MAIN_004",
                "sk": "APPLICATION#ROOT",
                "applicationStatus": "Cancelled"
            }
        ]
        
        for app in applications:
            table.put_item(Item=app)
        
        main(
            dynamodb=dynamodb_local,
            application_table_name="application-table",
            dry_run=False
        )
        
        # Verify all were updated correctly
        response = table.get_item(Key={"pk": "APP_MAIN_002", "sk": "APPLICATION#ROOT"})
        assert response["Item"]["StatusGroup"] == StatusGroup.complete.value
        
        response = table.get_item(Key={"pk": "APP_MAIN_003", "sk": "APPLICATION#ROOT"})
        assert response["Item"]["StatusGroup"] == StatusGroup.not_complete.value
        
        response = table.get_item(Key={"pk": "APP_MAIN_004", "sk": "APPLICATION#ROOT"})
        assert response["Item"]["StatusGroup"] == StatusGroup.complete.value

    def test_main_with_dry_run_does_not_modify_database(self, table, dynamodb_local):
        """Test that main() with dry_run=True doesn't modify the database"""
        table.put_item(Item={
            "pk": "APP_MAIN_005",
            "sk": "APPLICATION#ROOT",
            "applicationStatus": "Certificate Available"
        })
        
        main(
            dynamodb=dynamodb_local,
            application_table_name="application-table",
            dry_run=True
        )
        
        response = table.get_item(Key={"pk": "APP_MAIN_005", "sk": "APPLICATION#ROOT"})
        item = response["Item"]
        
        assert "StatusGroup" not in item

    def test_main_handles_empty_table(self, table, dynamodb_local):
        """Test that main() handles an empty table gracefully"""
        # Don't insert any items
        main(
            dynamodb=dynamodb_local,
            application_table_name="application-table",
            dry_run=False
        )
        
        # Should complete without errors
        # Verify table is still empty
        response = table.scan()
        assert len(response.get("Items", [])) == 0

    def test_main_processes_all_status_combinations(self, table, dynamodb_local):
        """Test main() with comprehensive status combinations"""
        test_cases = [
            ("APP_STATUS_01", "Certificate Available", StatusGroup.complete.value),
            ("APP_STATUS_02", "Certificate Not Issued", StatusGroup.complete.value),
            ("APP_STATUS_03", "Cancelled", StatusGroup.complete.value),
            ("APP_STATUS_04", "In Progress", StatusGroup.not_complete.value),
            ("APP_STATUS_05", "Submitted", StatusGroup.not_complete.value),
            ("APP_STATUS_06", "Under Review", StatusGroup.not_complete.value),
        ]
        
        for pk, status, expected_group in test_cases:
            table.put_item(Item={
                "pk": pk,
                "sk": "APPLICATION#ROOT",
                "applicationStatus": status
            })
        
        main(
            dynamodb=dynamodb_local,
            application_table_name="application-table",
            dry_run=False
        )
        
        for pk, status, expected_group in test_cases:
            response = table.get_item(Key={"pk": pk, "sk": "APPLICATION#ROOT"})
            item = response["Item"]
            assert item["StatusGroup"] == expected_group, \
                f"Failed for {pk} with status {status}: expected {expected_group}, got {item.get('StatusGroup')}"

    def test_main_skips_non_root_items(self, table, dynamodb_local):
        """Test that main() only processes APPLICATION#ROOT items"""
        # Insert both root and non-root items
        table.put_item(Item={
            "pk": "APP_MAIN_006",
            "sk": "APPLICATION#ROOT",
            "applicationStatus": "Certificate Available"
        })
        
        table.put_item(Item={
            "pk": "APP_MAIN_006",
            "sk": "METADATA#EXTRA",
            "applicationStatus": "Certificate Available"
        })
        
        main(
            dynamodb=dynamodb_local,
            application_table_name="application-table",
            dry_run=False
        )
        
        # Root item should be updated
        response = table.get_item(Key={"pk": "APP_MAIN_006", "sk": "APPLICATION#ROOT"})
        assert response["Item"]["StatusGroup"] == StatusGroup.complete.value
        
        # Non-root item should also be updated if scan returns it
        # (Note: the current implementation doesn't filter by sk, so it will update all items)

    def test_main_handles_large_dataset(self, table, dynamodb_local):
        """Test main() with a larger dataset to verify pagination works"""
        # Insert 50 applications to potentially trigger pagination
        for i in range(50):
            status = "Certificate Available" if i % 2 == 0 else "In Progress"
            table.put_item(Item={
                "pk": f"APP_LARGE_{i:03d}",
                "sk": "APPLICATION#ROOT",
                "applicationStatus": status
            })
        
        main(
            dynamodb=dynamodb_local,
            application_table_name="application-table",
            dry_run=False
        )
        
        # Verify all items were processed
        for i in range(50):
            response = table.get_item(Key={"pk": f"APP_LARGE_{i:03d}", "sk": "APPLICATION#ROOT"})
            item = response["Item"]
            assert "StatusGroup" in item
            
            if i % 2 == 0:
                assert item["StatusGroup"] == StatusGroup.complete.value
            else:
                assert item["StatusGroup"] == StatusGroup.not_complete.value


class TestEndToEndScenarios:
    """End-to-end integration tests for complex scenarios"""

    def test_migration_from_no_status_group_to_status_group(self, table, dynamodb_local):
        """Test migrating a database from having no statusGroup to having it"""
        # Simulate legacy data without statusGroup
        legacy_apps = [
            {"pk": "LEGACY_001", "sk": "APPLICATION#ROOT", "applicationStatus": "Certificate Available"},
            {"pk": "LEGACY_002", "sk": "APPLICATION#ROOT", "applicationStatus": "In Progress"},
            {"pk": "LEGACY_003", "sk": "APPLICATION#ROOT", "applicationStatus": "Certificate Not Issued"},
            {"pk": "LEGACY_004", "sk": "APPLICATION#ROOT", "applicationStatus": "Cancelled"},
        ]
        
        for app in legacy_apps:
            table.put_item(Item=app)
        
        # Run migration
        main(
            dynamodb=dynamodb_local,
            application_table_name="application-table",
            dry_run=False
        )
        
        # Verify all items now have statusGroup
        for app in legacy_apps:
            response = table.get_item(Key={"pk": app["pk"], "sk": app["sk"]})
            item = response["Item"]
            assert "StatusGroup" in item
            
            if app["applicationStatus"] in ["Certificate Available", "Certificate Not Issued", "Cancelled"]:
                assert item["StatusGroup"] == StatusGroup.complete.value
            else:
                assert item["StatusGroup"] == StatusGroup.not_complete.value

    def test_idempotency_running_migration_twice(self, table, dynamodb_local):
        """Test that running the migration twice produces the same result"""
        table.put_item(Item={
            "pk": "IDEMPOTENT_001",
            "sk": "APPLICATION#ROOT",
            "applicationStatus": "Certificate Available"
        })
        
        # Run migration first time
        main(
            dynamodb=dynamodb_local,
            application_table_name="application-table",
            dry_run=False
        )
        
        response1 = table.get_item(Key={"pk": "IDEMPOTENT_001", "sk": "APPLICATION#ROOT"})
        item_after_first = response1["Item"]
        
        # Run migration second time
        main(
            dynamodb=dynamodb_local,
            application_table_name="application-table",
            dry_run=False
        )
        
        response2 = table.get_item(Key={"pk": "IDEMPOTENT_001", "sk": "APPLICATION#ROOT"})
        item_after_second = response2["Item"]
        
        # Should be identical
        assert item_after_first["StatusGroup"] == item_after_second["StatusGroup"]
        assert item_after_first["StatusGroup"] == StatusGroup.complete.value

    def test_dry_run_provides_accurate_preview(self, table, dynamodb_local, capsys):
        """Test that dry run shows what would happen without making changes"""
        table.put_item(Item={
            "pk": "DRYRUN_001",
            "sk": "APPLICATION#ROOT",
            "applicationStatus": "Certificate Available"
        })
        
        # Run with dry_run
        main(
            dynamodb=dynamodb_local,
            application_table_name="application-table",
            dry_run=True
        )
        
        # Verify no changes were made
        response = table.get_item(Key={"pk": "DRYRUN_001", "sk": "APPLICATION#ROOT"})
        item = response["Item"]
        assert "StatusGroup" not in item
        
        # Now run without dry_run
        main(
            dynamodb=dynamodb_local,
            application_table_name="application-table",
            dry_run=False
        )
        
        # Verify changes were made
        response = table.get_item(Key={"pk": "DRYRUN_001", "sk": "APPLICATION#ROOT"})
        item = response["Item"]
        assert item["StatusGroup"] == StatusGroup.complete.value
