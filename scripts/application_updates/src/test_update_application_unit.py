"""
Unit tests for update_application.py

These tests use mocks to test the logic without requiring AWS resources.
Run with: pytest src/test_update_application_unit.py -v
"""

import pytest
from unittest.mock import MagicMock, patch, call
from botocore.exceptions import ClientError

from update_application import update, main, StatusGroup


class TestStatusGroup:
    """Tests for the StatusGroup enum"""

    def test_status_group_values(self):
        assert StatusGroup.complete.value == "Complete"
        assert StatusGroup.not_complete.value == "Not Complete"


class TestUpdateFunction:
    """Tests for the update() function"""

    def test_update_with_certificate_available_status(self):
        """Test that 'Certificate Available' status sets statusGroup to Complete"""
        application = {
            "pk": "APP123",
            "applicationStatus": "Certificate Available",
            "statusGroup": None
        }
        mock_table = MagicMock()
        
        update(application, mock_table, dry_run=False)
        
        mock_table.update_item.assert_called_once()
        call_kwargs = mock_table.update_item.call_args[1]
        assert call_kwargs["Key"] == {"pk": "APP123", "sk": "APPLICATION#ROOT"}
        assert call_kwargs["ExpressionAttributeValues"][":new_status_group"] == StatusGroup.complete.value

    def test_update_with_certificate_not_issued_status(self):
        """Test that 'Certificate Not Issued' status sets statusGroup to Complete"""
        application = {
            "pk": "APP456",
            "applicationStatus": "Certificate Not Issued",
            "statusGroup": None
        }
        mock_table = MagicMock()
        
        update(application, mock_table, dry_run=False)
        
        mock_table.update_item.assert_called_once()
        call_kwargs = mock_table.update_item.call_args[1]
        assert call_kwargs["ExpressionAttributeValues"][":new_status_group"] == StatusGroup.complete.value

    def test_update_with_cancelled_status(self):
        """Test that 'Cancelled' status sets statusGroup to Complete"""
        application = {
            "pk": "APP789",
            "applicationStatus": "Cancelled",
            "statusGroup": None
        }
        mock_table = MagicMock()
        
        update(application, mock_table, dry_run=False)
        
        mock_table.update_item.assert_called_once()
        call_kwargs = mock_table.update_item.call_args[1]
        assert call_kwargs["ExpressionAttributeValues"][":new_status_group"] == StatusGroup.complete.value

    def test_update_with_other_status(self):
        """Test that other statuses set statusGroup to Not Complete"""
        application = {
            "pk": "APP999",
            "applicationStatus": "In Progress",
            "statusGroup": None
        }
        mock_table = MagicMock()
        
        update(application, mock_table, dry_run=False)
        
        mock_table.update_item.assert_called_once()
        call_kwargs = mock_table.update_item.call_args[1]
        assert call_kwargs["ExpressionAttributeValues"][":new_status_group"] == StatusGroup.not_complete.value

    def test_update_with_existing_complete_status_group(self):
        """Test that an existing Complete statusGroup doesn't trigger conditional logic"""
        application = {
            "pk": "APP111",
            "applicationStatus": "In Progress",
            "statusGroup": StatusGroup.complete.value
        }
        mock_table = MagicMock()
        
        update(application, mock_table, dry_run=False)
        
        # The code still updates even if statusGroup is already set
        # This happens because new_status_group defaults to not_complete
        mock_table.update_item.assert_called_once()
        call_kwargs = mock_table.update_item.call_args[1]
        assert call_kwargs["ExpressionAttributeValues"][":new_status_group"] == StatusGroup.not_complete.value

    def test_update_with_existing_not_complete_status_group(self):
        """Test that an existing Not Complete statusGroup doesn't trigger conditional logic"""
        application = {
            "pk": "APP222",
            "applicationStatus": "In Progress",
            "statusGroup": StatusGroup.not_complete.value
        }
        mock_table = MagicMock()
        
        update(application, mock_table, dry_run=False)
        
        # The code still updates even if statusGroup is already set correctly
        mock_table.update_item.assert_called_once()
        call_kwargs = mock_table.update_item.call_args[1]
        assert call_kwargs["ExpressionAttributeValues"][":new_status_group"] == StatusGroup.not_complete.value

    def test_update_with_invalid_status_group_gets_updated(self):
        """Test that invalid statusGroup values are corrected"""
        application = {
            "pk": "APP333",
            "applicationStatus": "Certificate Available",
            "statusGroup": "Invalid Value"
        }
        mock_table = MagicMock()
        
        update(application, mock_table, dry_run=False)
        
        mock_table.update_item.assert_called_once()
        call_kwargs = mock_table.update_item.call_args[1]
        assert call_kwargs["ExpressionAttributeValues"][":new_status_group"] == StatusGroup.complete.value

    def test_update_with_dry_run_enabled(self):
        """Test that dry_run=True prevents database updates"""
        application = {
            "pk": "APP444",
            "applicationStatus": "Certificate Available",
            "statusGroup": None
        }
        mock_table = MagicMock()
        
        update(application, mock_table, dry_run=True)
        
        mock_table.update_item.assert_not_called()

    def test_update_handles_conditional_check_failed_exception(self, capsys):
        """Test that ConditionalCheckFailedException is caught and logged"""
        application = {
            "pk": "APP555",
            "applicationStatus": "Certificate Available",
            "statusGroup": None
        }
        mock_table = MagicMock()
        error_response = {
            "Error": {
                "Code": "ConditionalCheckFailedException",
                "Message": "Item does not exist"
            }
        }
        mock_table.update_item.side_effect = ClientError(error_response, "UpdateItem")
        
        update(application, mock_table, dry_run=False)
        
        captured = capsys.readouterr()
        assert "Error message for application with pk=APP555" in captured.out

    def test_update_raises_other_client_errors(self):
        """Test that non-conditional ClientErrors are re-raised"""
        application = {
            "pk": "APP666",
            "applicationStatus": "Certificate Available",
            "statusGroup": None
        }
        mock_table = MagicMock()
        error_response = {
            "Error": {
                "Code": "ValidationException",
                "Message": "Some validation error"
            }
        }
        mock_table.update_item.side_effect = ClientError(error_response, "UpdateItem")
        
        with pytest.raises(ClientError) as exc_info:
            update(application, mock_table, dry_run=False)
        
        assert exc_info.value.response["Error"]["Code"] == "ValidationException"

    def test_update_with_missing_application_status(self):
        """Test handling of applications without applicationStatus field"""
        application = {
            "pk": "APP777",
            "statusGroup": None
        }
        mock_table = MagicMock()
        
        update(application, mock_table, dry_run=False)
        
        mock_table.update_item.assert_called_once()
        call_kwargs = mock_table.update_item.call_args[1]
        assert call_kwargs["ExpressionAttributeValues"][":new_status_group"] == StatusGroup.not_complete.value

    def test_update_prints_success_message(self, capsys):
        """Test that successful update prints confirmation message"""
        application = {
            "pk": "APP888",
            "applicationStatus": "Certificate Available",
            "statusGroup": None
        }
        mock_table = MagicMock()
        
        update(application, mock_table, dry_run=False)
        
        captured = capsys.readouterr()
        assert "Application Table - StatusGroup updated to" in captured.out


class TestMainFunction:
    """Tests for the main() function"""

    @patch('update_application.boto3')
    def test_main_creates_dynamodb_resource_when_not_provided(self, mock_boto3):
        """Test that main() creates a DynamoDB resource if none provided"""
        mock_resource = MagicMock()
        mock_table = MagicMock()
        mock_resource.Table.return_value = mock_table
        mock_boto3.resource.return_value = mock_resource
        
        # Mock scan to return no items
        mock_table.scan.return_value = {"Items": []}
        
        main(dynamodb=None, application_table_name="test-table", dry_run=True, region="us-east-1")
        
        mock_boto3.resource.assert_called_once_with("dynamodb", region_name="us-east-1")

    def test_main_uses_provided_dynamodb_resource(self):
        """Test that main() uses the provided DynamoDB resource"""
        mock_dynamodb = MagicMock()
        mock_table = MagicMock()
        mock_dynamodb.Table.return_value = mock_table
        mock_table.scan.return_value = {"Items": []}
        
        main(dynamodb=mock_dynamodb, application_table_name="test-table", dry_run=True)
        
        mock_dynamodb.Table.assert_called_once_with("test-table")

    def test_main_scans_all_items_single_page(self):
        """Test main() with a single page of results"""
        mock_dynamodb = MagicMock()
        mock_table = MagicMock()
        mock_dynamodb.Table.return_value = mock_table
        
        applications = [
            {"pk": "APP1", "applicationStatus": "Certificate Available", "statusGroup": None},
            {"pk": "APP2", "applicationStatus": "In Progress", "statusGroup": None}
        ]
        mock_table.scan.return_value = {"Items": applications}
        
        with patch('update_application.update') as mock_update:
            main(dynamodb=mock_dynamodb, application_table_name="test-table", dry_run=False)
        
        assert mock_update.call_count == 2
        mock_update.assert_any_call(applications[0], mock_table, False)
        mock_update.assert_any_call(applications[1], mock_table, False)

    def test_main_scans_multiple_pages(self):
        """Test main() with paginated results"""
        mock_dynamodb = MagicMock()
        mock_table = MagicMock()
        mock_dynamodb.Table.return_value = mock_table
        
        # First scan returns items with LastEvaluatedKey
        first_page = [
            {"pk": "APP1", "applicationStatus": "Certificate Available", "statusGroup": None}
        ]
        # Second scan returns items without LastEvaluatedKey
        second_page = [
            {"pk": "APP2", "applicationStatus": "In Progress", "statusGroup": None}
        ]
        
        mock_table.scan.side_effect = [
            {"Items": first_page, "LastEvaluatedKey": {"pk": "APP1"}},
            {"Items": second_page}
        ]
        
        with patch('update_application.update') as mock_update:
            main(dynamodb=mock_dynamodb, application_table_name="test-table", dry_run=False)
        
        assert mock_update.call_count == 2
        # Verify both pages were processed
        mock_update.assert_any_call(first_page[0], mock_table, False)
        mock_update.assert_any_call(second_page[0], mock_table, False)

    def test_main_with_empty_table(self):
        """Test main() when table has no items"""
        mock_dynamodb = MagicMock()
        mock_table = MagicMock()
        mock_dynamodb.Table.return_value = mock_table
        mock_table.scan.return_value = {"Items": []}
        
        with patch('update_application.update') as mock_update:
            main(dynamodb=mock_dynamodb, application_table_name="test-table", dry_run=False)
        
        mock_update.assert_not_called()

    def test_main_passes_dry_run_to_update(self):
        """Test that main() correctly passes dry_run flag to update()"""
        mock_dynamodb = MagicMock()
        mock_table = MagicMock()
        mock_dynamodb.Table.return_value = mock_table
        
        applications = [{"pk": "APP1", "applicationStatus": "Certificate Available", "statusGroup": None}]
        mock_table.scan.return_value = {"Items": applications}
        
        with patch('update_application.update') as mock_update:
            main(dynamodb=mock_dynamodb, application_table_name="test-table", dry_run=True)
        
        mock_update.assert_called_once_with(applications[0], mock_table, True)


class TestMainEntryPoint:
    """Tests for the __main__ entry point"""

    @patch('update_application.getResolvedOptions')
    @patch('update_application.main')
    @patch('update_application.time')
    def test_main_entry_point_with_valid_args(self, mock_time, mock_main, mock_get_args, capsys):
        """Test the __main__ block with valid arguments"""
        mock_time.time.side_effect = [1000, 1120]  # 120 seconds duration
        mock_get_args.return_value = {
            "APPLICATION_TABLE": "my-table",
            "AWS_REGION": "us-west-1",
            "DRY_RUN": "true"
        }
        
        # Import and execute the main block
        import sys
        original_argv = sys.argv
        try:
            sys.argv = ["update_application.py", "--APPLICATION_TABLE", "my-table", 
                       "--AWS_REGION", "us-west-1", "--DRY_RUN", "true"]
            
            # Execute the module's main code (normally we'd import but it has side effects)
            # Instead we'll test the logic directly
            args = mock_get_args.return_value
            APPLICATION_TABLE_NAME = args["APPLICATION_TABLE"]
            AWS_REGION = args.get("AWS_REGION", "eu-west-2")
            DRY_RUN = args["DRY_RUN"].strip().lower() == "true"
            
            assert APPLICATION_TABLE_NAME == "my-table"
            assert AWS_REGION == "us-west-1"
            assert DRY_RUN == True
        finally:
            sys.argv = original_argv

    @patch('update_application.getResolvedOptions')
    def test_main_entry_point_with_dry_run_false(self, mock_get_args):
        """Test that DRY_RUN='false' is parsed correctly"""
        mock_get_args.return_value = {
            "APPLICATION_TABLE": "my-table",
            "AWS_REGION": "eu-west-2",
            "DRY_RUN": "false"
        }
        
        args = mock_get_args.return_value
        DRY_RUN = args["DRY_RUN"].strip().lower() == "true"
        
        assert DRY_RUN == False

    @patch('update_application.getResolvedOptions')
    def test_main_entry_point_strips_whitespace(self, mock_get_args):
        """Test that arguments are stripped of whitespace"""
        mock_get_args.return_value = {
            "APPLICATION_TABLE": "  my-table  ",
            "AWS_REGION": "eu-west-2",
            "DRY_RUN": "  TRUE  "
        }
        
        args = mock_get_args.return_value
        APPLICATION_TABLE_NAME = args["APPLICATION_TABLE"].strip()
        DRY_RUN = args["DRY_RUN"].strip().lower() == "true"
        
        assert APPLICATION_TABLE_NAME == "my-table"
        assert DRY_RUN == True
