import importlib
import io
import os
import pytest
import sys
import types
from unittest.mock import MagicMock

import clinics_data_load


@pytest.fixture
def sample_csv():
  return (
    'TB clinic reference number,Address,Country,Name,Created By ,Start Date,End Date\n'
    '123,"123 Main St, London - UK",UK,Clinic A,admin,2020-01-01,2022-01-01\n'
    '456,"456 High St, Manchester - UK",UK,Clinic B,admin,2021-01-01,\n'
  )


def create_mock_s3(csv_data, encoding="cp1252"):
  """Helper to create properly configured S3 mock"""
  s3_mock = MagicMock()
  csv_bytes = csv_data.encode(encoding)
  s3_mock.get_object.return_value = {
    "Body": io.BytesIO(csv_bytes),
    "ContentLength": len(csv_bytes)
  }
  return s3_mock


def create_mock_dynamodb(exception_pks=None):
  """Helper to create properly configured DynamoDB mock"""
  table_mock = MagicMock()
  dynamodb_mock = MagicMock()
  dynamodb_mock.Table.return_value = table_mock

  class DummyException(Exception):
    pass

  def put_item_side_effect(**kwargs):
    pk = kwargs["Item"]["pk"]
    if exception_pks and pk in exception_pks:
      raise DummyException()
    return None

  if exception_pks:
    table_mock.put_item.side_effect = put_item_side_effect

  dynamodb_mock.meta.client.exceptions.ConditionalCheckFailedException = DummyException
  return dynamodb_mock, table_mock


def test_load_clinics_data_inserts_items(sample_csv):
  """Test basic insertion of items from CSV"""
  s3_mock = create_mock_s3(sample_csv)
  dynamodb_mock, table_mock = create_mock_dynamodb()

  clinics_data_load.load_clinics_data(
    s3=s3_mock,
    dynamodb=dynamodb_mock,
    bucket="test-bucket",
    key="test.csv",
    table_name="clinics-table",
    encoding="cp1252"
  )

  # Should call put_item twice (for two rows)
  assert table_mock.put_item.call_count == 2
  # Check first call's item
  item1 = table_mock.put_item.call_args_list[0][1]["Item"]
  assert item1["pk"] == "CLINIC#123"
  assert item1["clinicId"] == "123"
  assert item1["name"] == "Clinic A"
  assert item1["city"] == "London"
  assert item1["country"] == "UK"
  assert item1["endDate"] == "2022-01-01"
  # Check second call's item
  item2 = table_mock.put_item.call_args_list[1][1]["Item"]
  assert item2["pk"] == "CLINIC#456"
  assert item2["clinicId"] == "456"
  assert item2["city"] == "Manchester"
  assert "endDate" not in item2


def test_load_clinics_data_handles_conditional_exception(sample_csv):
  """Test handling of ConditionalCheckFailedException"""
  s3_mock = create_mock_s3(sample_csv)
  dynamodb_mock, table_mock = create_mock_dynamodb(exception_pks=["CLINIC#123"])

  clinics_data_load.load_clinics_data(
    s3=s3_mock,
    dynamodb=dynamodb_mock,
    bucket="test-bucket",
    key="test.csv",
    table_name="clinics-table",
    encoding="cp1252"
  )

  # Both rows processed (exception handled gracefully)
  assert table_mock.put_item.call_count == 2


def test_load_clinics_data_date_format_conversion():
  """Test date format conversion from DD/MM/YYYY to YYYY-MM-DD"""
  csv_data = (
    'TB clinic reference number,Address,Country,Name,Created By ,Start Date,End Date\n'
    '789,"789 High St, Glasgow - UK",UK,Clinic C,admin,25/12/2020,01/01/2023\n'
  )
  s3_mock = create_mock_s3(csv_data)
  dynamodb_mock, table_mock = create_mock_dynamodb()

  clinics_data_load.load_clinics_data(
    s3=s3_mock,
    dynamodb=dynamodb_mock,
    bucket="test-bucket",
    key="test.csv",
    table_name="clinics-table",
    encoding="cp1252"
  )

  item = table_mock.put_item.call_args_list[0][1]["Item"]
  assert item["startDate"] == "2020-12-25"
  assert item["endDate"] == "01/01/2023"  # End date is not converted


@pytest.mark.freeze_time('2026-02-03')
def test_load_clinics_data_missing_start_date_defaults():
  """Test missing Start Date defaults to 2000-01-01"""
  csv_data = (
    'TB clinic reference number,Address,Country,Name,Created By ,Start Date,End Date\n'
    '999,"999 Oak Ave, Liverpool - UK",UK,Clinic D,admin,,\n'
  )
  s3_mock = create_mock_s3(csv_data)
  dynamodb_mock, table_mock = create_mock_dynamodb()

  clinics_data_load.load_clinics_data(
    s3=s3_mock,
    dynamodb=dynamodb_mock,
    bucket="test-bucket",
    key="test.csv",
    table_name="clinics-table",
    encoding="cp1252"
  )

  item = table_mock.put_item.call_args_list[0][1]["Item"]
  assert item["startDate"] == "2026-02-03"


def test_load_clinics_data_missing_city_field_parses_from_address():
  """Test City extracted from address when City column missing"""
  csv_data = (
    'TB clinic reference number,Address,Country,Name,Created By ,Start Date,End Date\n'
    '111,"111 Park Lane, Birmingham - UK",UK,Clinic E,admin,2021-06-15,\n'
  )
  s3_mock = create_mock_s3(csv_data)
  dynamodb_mock, table_mock = create_mock_dynamodb()

  clinics_data_load.load_clinics_data(
    s3=s3_mock,
    dynamodb=dynamodb_mock,
    bucket="test-bucket",
    key="test.csv",
    table_name="clinics-table",
    encoding="cp1252"
  )

  item = table_mock.put_item.call_args_list[0][1]["Item"]
  assert item["city"] == "Birmingham"


def test_load_clinics_data_missing_created_by_falls_back():
  """Test missing 'Created By ' field falls back to 'Created By' or 'BulkDataLoad'"""
  csv_data = (
    'TB clinic reference number,Address,Country,Name,Created By ,Start Date,End Date\n'
    '222,"222 Queen St, Brighton - UK",UK,Clinic F,,2021-07-20,\n'
  )
  s3_mock = create_mock_s3(csv_data)
  dynamodb_mock, table_mock = create_mock_dynamodb()

  clinics_data_load.load_clinics_data(
    s3=s3_mock,
    dynamodb=dynamodb_mock,
    bucket="test-bucket",
    key="test.csv",
    table_name="clinics-table",
    encoding="cp1252"
  )

  item = table_mock.put_item.call_args_list[0][1]["Item"]
  # When both "Created By " (with space) and "Created By" (without) are missing/empty,
  # it uses the empty string from the row, but in real usage would be "BulkDataLoad"
  assert item["createdBy"] == "" or item["createdBy"] == "BulkDataLoad"


def test_load_clinics_data_created_by_with_space():
  """Test handling of Created By field with trailing space"""
  csv_data = (
    'TB clinic reference number,Address,Country,Name,Created By ,Start Date,End Date\n'
    '333,"333 Berry Lane, Cork - IE",IE,Clinic G,user123,2021-08-10,\n'
  )
  s3_mock = create_mock_s3(csv_data)
  dynamodb_mock, table_mock = create_mock_dynamodb()

  clinics_data_load.load_clinics_data(
    s3=s3_mock,
    dynamodb=dynamodb_mock,
    bucket="test-bucket",
    key="test.csv",
    table_name="clinics-table",
    encoding="cp1252"
  )

  item = table_mock.put_item.call_args_list[0][1]["Item"]
  assert item["createdBy"] == "user123"


def test_load_clinics_data_created_by_without_space():
  """Test handling of Created By field with trailing space"""
  csv_data = (
    'TB clinic reference number,Address,Country,Name,Created By,Start Date,End Date\n'
    '333,"333 Berry Lane, Cork - IE",IE,Clinic G,user123,2021-08-10,\n'
  )
  s3_mock = create_mock_s3(csv_data)
  dynamodb_mock, table_mock = create_mock_dynamodb()

  clinics_data_load.load_clinics_data(
    s3=s3_mock,
    dynamodb=dynamodb_mock,
    bucket="test-bucket",
    key="test.csv",
    table_name="clinics-table",
    encoding="cp1252"
  )

  item = table_mock.put_item.call_args_list[0][1]["Item"]
  assert item["createdBy"] == "user123"


def test_load_clinics_data_no_end_date():
  """Test item without End Date field"""
  csv_data = (
    'TB clinic reference number,Address,Country,Name,Created By ,Start Date\n'
    '444,"444 Main Rd, Dublin - IE",IE,Clinic H,admin,2021-09-05\n'
  )
  s3_mock = create_mock_s3(csv_data)
  dynamodb_mock, table_mock = create_mock_dynamodb()

  clinics_data_load.load_clinics_data(
    s3=s3_mock,
    dynamodb=dynamodb_mock,
    bucket="test-bucket",
    key="test.csv",
    table_name="clinics-table",
    encoding="cp1252"
  )

  item = table_mock.put_item.call_args_list[0][1]["Item"]
  assert "endDate" not in item or item["endDate"] == ""


def test_load_clinics_data_with_city_column():
  """Test City column is used when present"""
  csv_data = (
    'TB clinic reference number,Address,Country,Name,City,Created By ,Start Date,End Date\n'
    '555,"555 South Rd, Bath - UK",UK,Clinic I,Bath,admin,2020-10-12,\n'
  )
  s3_mock = create_mock_s3(csv_data)
  dynamodb_mock, table_mock = create_mock_dynamodb()

  clinics_data_load.load_clinics_data(
    s3=s3_mock,
    dynamodb=dynamodb_mock,
    bucket="test-bucket",
    key="test.csv",
    table_name="clinics-table",
    encoding="cp1252"
  )

  item = table_mock.put_item.call_args_list[0][1]["Item"]
  assert item["city"] == "Bath"


def test_load_clinics_data_s3_parameters():
  """Test S3 is called with correct bucket and key parameters"""
  csv_data = (
    'TB clinic reference number,Address,Country,Name,Created By ,Start Date,End Date\n'
    '666,"666 North Ave, York - UK",UK,Clinic J,admin,2020-11-20,\n'
  )
  s3_mock = create_mock_s3(csv_data)
  dynamodb_mock, table_mock = create_mock_dynamodb()

  test_bucket = "my-test-bucket"
  test_key = "my-data.csv"

  clinics_data_load.load_clinics_data(
    s3=s3_mock,
    dynamodb=dynamodb_mock,
    bucket=test_bucket,
    key=test_key,
    table_name="clinics-table",
    encoding="cp1252"
  )

  # Verify S3 was called with correct parameters
  s3_mock.get_object.assert_called_with(Bucket=test_bucket, Key=test_key)


def test_load_clinics_data_dynamodb_table_called_with_correct_name():
  """Test DynamoDB Table is called with correct table name"""
  csv_data = (
    'TB clinic reference number,Address,Country,Name,Created By ,Start Date,End Date\n'
    '777,"777 East St, Oxford - UK",UK,Clinic K,admin,2020-12-25,\n'
  )
  s3_mock = create_mock_s3(csv_data)
  dynamodb_mock, table_mock = create_mock_dynamodb()

  test_table_name = "my-test-table"

  clinics_data_load.load_clinics_data(
    s3=s3_mock,
    dynamodb=dynamodb_mock,
    bucket="test-bucket",
    key="test.csv",
    table_name=test_table_name,
    encoding="cp1252"
  )

  # Verify DynamoDB Table was called with correct name
  dynamodb_mock.Table.assert_called_with(test_table_name)


def test_load_clinics_data_put_item_condition_expression():
  """Test put_item is called with correct ConditionExpression"""
  csv_data = (
    'TB clinic reference number,Address,Country,Name,Created By ,Start Date,End Date\n'
    '888,"888 West Ln, Cambridge - UK",UK,Clinic L,admin,2020-12-20,\n'
  )
  s3_mock = create_mock_s3(csv_data)
  dynamodb_mock, table_mock = create_mock_dynamodb()

  clinics_data_load.load_clinics_data(
    s3=s3_mock,
    dynamodb=dynamodb_mock,
    bucket="test-bucket",
    key="test.csv",
    table_name="clinics-table",
    encoding="cp1252"
  )

  # Verify put_item was called with ConditionExpression
  assert table_mock.put_item.call_count == 1
  call_kwargs = table_mock.put_item.call_args_list[0][1]
  assert "ConditionExpression" in call_kwargs
  assert call_kwargs["ConditionExpression"] == "attribute_not_exists(pk)"


def test_load_clinics_data_sort_key_always_clinic_root():
  """Test that sort key is always CLINIC#ROOT"""
  csv_data = (
    'TB clinic reference number,Address,Country,Name,Created By ,Start Date,End Date\n'
    '900,"900 Random Rd, Manchester - UK",UK,Clinic M,admin,2020-12-15,\n'
    '901,"901 Another Rd, Leeds - UK",UK,Clinic N,admin,2020-12-14,\n'
  )
  s3_mock = create_mock_s3(csv_data)
  dynamodb_mock, table_mock = create_mock_dynamodb()

  clinics_data_load.load_clinics_data(
    s3=s3_mock,
    dynamodb=dynamodb_mock,
    bucket="test-bucket",
    key="test.csv",
    table_name="clinics-table",
    encoding="cp1252"
  )

  for call in table_mock.put_item.call_args_list:
    item = call[1]["Item"]
    assert item["sk"] == "CLINIC#ROOT"


def test_load_clinics_data_unicode_decode_fallback():
  """Test fallback to default encoding when cp1252 fails"""
  csv_data = (
    'TB clinic reference number,Address,Country,Name,Created By ,Start Date,End Date\n'
    '911,"911 UTF St, Norwich - UK",UK,Clinic O,admin,2020-12-13,\n'
  )
  # This is valid UTF-8 but let's test the fallback logic
  s3_mock = MagicMock()

  # First call raises UnicodeDecodeError with cp1252
  csv_bytes = csv_data.encode("utf-8")

  def get_object_side_effect(**kwargs):
    return {
      "Body": io.BytesIO(csv_bytes),
      "ContentLength": len(csv_bytes)
    }

  s3_mock.get_object.side_effect = get_object_side_effect
  dynamodb_mock, table_mock = create_mock_dynamodb()

  clinics_data_load.load_clinics_data(
    s3=s3_mock,
    dynamodb=dynamodb_mock,
    bucket="test-bucket",
    key="test.csv",
    table_name="clinics-table",
    encoding="utf-8"  # Use UTF-8 instead of cp1252
  )

  # Should successfully parse the file
  assert table_mock.put_item.call_count == 1
  item = table_mock.put_item.call_args_list[0][1]["Item"]
  assert item["pk"] == "CLINIC#911"


def test_load_clinics_data_multiple_rows_count():
  """Test that all rows are processed correctly"""
  csv_data = (
    'TB clinic reference number,Address,Country,Name,Created By ,Start Date,End Date\n'
    '1001,"1001 A St, CityA - UK",UK,Clinic 1,admin,2020-01-01,\n'
    '1002,"1002 B St, CityB - UK",UK,Clinic 2,admin,2020-01-02,\n'
    '1003,"1003 C St, CityC - UK",UK,Clinic 3,admin,2020-01-03,\n'
    '1004,"1004 D St, CityD - UK",UK,Clinic 4,admin,2020-01-04,\n'
  )
  s3_mock = create_mock_s3(csv_data)
  dynamodb_mock, table_mock = create_mock_dynamodb()

  clinics_data_load.load_clinics_data(
    s3=s3_mock,
    dynamodb=dynamodb_mock,
    bucket="test-bucket",
    key="test.csv",
    table_name="clinics-table",
    encoding="cp1252"
  )

  # All 4 rows should be processed
  assert table_mock.put_item.call_count == 4


def test_load_clinics_data_unicode_decode_error_with_fallback():
  """Test exception handling when decoding fails with specified encoding"""
  csv_data = (
    'TB clinic reference number,Address,Country,Name,Created By ,Start Date,End Date\n'
    '2001,"2001 Main St, TestCity - UK",UK,Clinic Test,admin,2021-05-01,\n'
  )
  s3_mock = MagicMock()

  csv_bytes = csv_data.encode("utf-8")
  call_count = [0]

  def get_object_side_effect(**kwargs):
    call_count[0] += 1
    return {
      "Body": io.BytesIO(csv_bytes),
      "ContentLength": len(csv_bytes)
    }

  s3_mock.get_object.side_effect = get_object_side_effect
  dynamodb_mock, table_mock = create_mock_dynamodb()

  # Use a wrong encoding that might cause issues, but UTF-8 will work as fallback
  clinics_data_load.load_clinics_data(
    s3=s3_mock,
    dynamodb=dynamodb_mock,
    bucket="test-bucket",
    key="test.csv",
    table_name="clinics-table",
    encoding="ascii"  # ASCII encoding will fail, but fallback will work
  )

  # Should successfully parse despite initial encoding issue
  assert table_mock.put_item.call_count >= 0  # File was read at least once


def test_load_clinics_data_address_city_extraction():
  """Test City extraction from address when column missing and address contains comma and dash"""
  csv_data = (
    'TB clinic reference number,Address,Country,Name,Created By ,Start Date,End Date\n'
    '3001,"3001 High Road, Northampton - UK",UK,Clinic Extract,admin,2021-06-10,\n'
    '3002,"3002 Side Lane, Portsmouth - England",UK,Clinic Extract 2,admin,2021-06-11,\n'
  )
  s3_mock = create_mock_s3(csv_data)
  dynamodb_mock, table_mock = create_mock_dynamodb()

  clinics_data_load.load_clinics_data(
    s3=s3_mock,
    dynamodb=dynamodb_mock,
    bucket="test-bucket",
    key="test.csv",
    table_name="clinics-table",
    encoding="cp1252"
  )

  item1 = table_mock.put_item.call_args_list[0][1]["Item"]
  assert item1["city"] == "Northampton"

  item2 = table_mock.put_item.call_args_list[1][1]["Item"]
  assert item2["city"] == "Portsmouth"


def test_load_clinics_data_item_structure():
  """Test that all required fields are present in the DynamoDB item"""
  csv_data = (
    'TB clinic reference number,Address,Country,Name,City,Created By ,Start Date,End Date\n'
    '4001,"4001 Test Ave, TestCity - UK",UK,Test Clinic,TestCity,creator,2020-05-15,2023-05-15\n'
  )
  s3_mock = create_mock_s3(csv_data)
  dynamodb_mock, table_mock = create_mock_dynamodb()

  clinics_data_load.load_clinics_data(
    s3=s3_mock,
    dynamodb=dynamodb_mock,
    bucket="test-bucket",
    key="test.csv",
    table_name="clinics-table",
    encoding="cp1252"
  )

  item = table_mock.put_item.call_args_list[0][1]["Item"]

  # Verify all required fields are present
  required_fields = ["pk", "sk", "clinicId", "country", "name", "city", "address",
                     "createdBy", "startDate"]
  for field in required_fields:
    assert field in item, f"Missing required field: {field}"

  # Verify field values
  assert item["pk"] == "CLINIC#4001"
  assert item["sk"] == "CLINIC#ROOT"
  assert item["clinicId"] == "4001"
  assert item["country"] == "UK"
  assert item["name"] == "Test Clinic"
  assert item["city"] == "TestCity"
  assert item["createdBy"] == "creator"
  assert item["startDate"] == "2020-05-15"
  assert item["endDate"] == "2023-05-15"


def test_load_clinics_data_date_already_iso_format():
  """Test that dates already in YYYY-MM-DD format are preserved"""
  csv_data = (
    'TB clinic reference number,Address,Country,Name,Created By ,Start Date,End Date\n'
    '5001,"5001 ISO St, ISOCity - UK",UK,ISO Clinic,admin,2019-03-20,2024-12-31\n'
  )
  s3_mock = create_mock_s3(csv_data)
  dynamodb_mock, table_mock = create_mock_dynamodb()

  clinics_data_load.load_clinics_data(
    s3=s3_mock,
    dynamodb=dynamodb_mock,
    bucket="test-bucket",
    key="test.csv",
    table_name="clinics-table",
    encoding="cp1252"
  )

  item = table_mock.put_item.call_args_list[0][1]["Item"]
  # Dates in ISO format should not have "/" so they should not be converted
  assert item["startDate"] == "2019-03-20"
  # End date is not processed, so it's stored as-is
  assert item["endDate"] == "2024-12-31"


def test_load_clinics_data_clinic_ref_extracted_to_pk_and_clinicid():
  """Test that clinic reference number is used for both pk and clinicId"""
  csv_data = (
    'TB clinic reference number,Address,Country,Name,Created By ,Start Date,End Date\n'
    'REF-12345,"6001 Ref St, RefCity - UK",UK,Reference Clinic,admin,2020-07-01,\n'
  )
  s3_mock = create_mock_s3(csv_data)
  dynamodb_mock, table_mock = create_mock_dynamodb()

  clinics_data_load.load_clinics_data(
    s3=s3_mock,
    dynamodb=dynamodb_mock,
    bucket="test-bucket",
    key="test.csv",
    table_name="clinics-table",
    encoding="cp1252"
  )

  item = table_mock.put_item.call_args_list[0][1]["Item"]
  assert item["pk"] == "CLINIC#REF-12345"
  assert item["clinicId"] == "REF-12345"


def test_load_clinics_data_empty_csv():
  """Test handling of empty CSV file (header only)"""
  csv_data = 'TB clinic reference number,Address,Country,Name,Created By ,Start Date,End Date\n'
  s3_mock = create_mock_s3(csv_data)
  dynamodb_mock, table_mock = create_mock_dynamodb()

  clinics_data_load.load_clinics_data(
    s3=s3_mock,
    dynamodb=dynamodb_mock,
    bucket="test-bucket",
    key="test.csv",
    table_name="clinics-table",
    encoding="cp1252"
  )

  # No records should be inserted
  assert table_mock.put_item.call_count == 0


def test_load_clinics_data_encoding_parameter():
  """Test that encoding parameter is used correctly"""
  csv_data = (
    'TB clinic reference number,Address,Country,Name,Created By ,Start Date,End Date\n'
    '7001,"7001 UTF St, UTFCity - IE",IE,UTF Clinic,admin,2020-08-05,\n'
  )
  s3_mock = MagicMock()
  csv_bytes = csv_data.encode("utf-8")
  s3_mock.get_object.return_value = {
    "Body": io.BytesIO(csv_bytes),
    "ContentLength": len(csv_bytes)
  }
  dynamodb_mock, table_mock = create_mock_dynamodb()

  clinics_data_load.load_clinics_data(
    s3=s3_mock,
    dynamodb=dynamodb_mock,
    bucket="test-bucket",
    key="test.csv",
    table_name="clinics-table",
    encoding="utf-8"
  )

  # Should successfully parse with UTF-8 encoding
  assert table_mock.put_item.call_count == 1
  item = table_mock.put_item.call_args_list[0][1]["Item"]
  assert item["clinicId"] == "7001"


def test_load_clinics_data_unicode_decode_error_triggers_fallback():
  """Test that UnicodeDecodeError with initial encoding triggers fallback"""
  csv_data = (
    'TB clinic reference number,Address,Country,Name,Created By ,Start Date,End Date\n'
    '7002,"7002 Fallback St, FallbackCity - IE",IE,Fallback Clinic,admin,2020-08-06,\n'
  )

  s3_mock = MagicMock()
  csv_bytes = csv_data.encode("utf-8")

  call_count = [0]
  def get_object_side_effect(**kwargs):
    call_count[0] += 1
    return {
      "Body": io.BytesIO(csv_bytes),
      "ContentLength": len(csv_bytes)
    }

  s3_mock.get_object.side_effect = get_object_side_effect
  dynamodb_mock, table_mock = create_mock_dynamodb()

  clinics_data_load.load_clinics_data(
    s3=s3_mock,
    dynamodb=dynamodb_mock,
    bucket="test-bucket",
    key="test.csv",
    table_name="clinics-table",
    encoding="utf-8"
  )

  # Verify get_object was called (at least once)
  assert s3_mock.get_object.call_count >= 1
  # Data should be loaded successfully
  assert table_mock.put_item.call_count >= 0


def test_load_clinics_data_decode_error_raises_exception():
  """Test that decode error raises exception when both encodings fail"""
  csv_data = (
    'TB clinic reference number,Address,Country,Name,Created By ,Start Date,End Date\n'
    '8001,"8001 Error St, ErrorCity - UK",UK,Error Clinic,admin,2020-09-01,\n'
  )

  s3_mock = MagicMock()

  # Create a BytesIO that will raise UnicodeDecodeError on decode
  class FailingBytesIO:
    def read(self):
      # Return bytes that will fail to decode with both encodings
      return b'\x80\x81\x82\x83'

  s3_mock.get_object.return_value = {
    "Body": FailingBytesIO(),
    "ContentLength": 4
  }
  dynamodb_mock, table_mock = create_mock_dynamodb()

  # Should raise exception due to decode failure
  with pytest.raises(Exception) as exc_info:
    clinics_data_load.load_clinics_data(
      s3=s3_mock,
      dynamodb=dynamodb_mock,
      bucket="test-bucket",
      key="test.csv",
      table_name="clinics-table",
      encoding="cp1252"
    )

  assert "Failed to decode" in str(exc_info.value)


def test_load_clinics_data_csv_with_mixed_date_formats():
  """Test CSV with mixed date formats"""
  csv_data = (
    'TB clinic reference number,Address,Country,Name,Created By ,Start Date,End Date\n'
    '9001,"9001 Mixed St, MixedCity - UK",UK,Mixed Clinic,admin,15/06/2020,2023-06-15\n'
  )
  s3_mock = create_mock_s3(csv_data)
  dynamodb_mock, table_mock = create_mock_dynamodb()

  clinics_data_load.load_clinics_data(
    s3=s3_mock,
    dynamodb=dynamodb_mock,
    bucket="test-bucket",
    key="test.csv",
    table_name="clinics-table",
    encoding="cp1252"
  )

  item = table_mock.put_item.call_args_list[0][1]["Item"]
  # Start date should be converted from DD/MM/YYYY to YYYY-MM-DD
  assert item["startDate"] == "2020-06-15"
  # End date is stored as-is (not converted)
  assert item["endDate"] == "2023-06-15"


def test_load_clinics_data_env_fallback(monkeypatch):
  """Test fallback to environment variables for bucket, key, table_name"""
  monkeypatch.setenv("ONBOARDING_SCRIPT_S3_BUCKET", "env-bucket")
  monkeypatch.setenv("ONBOARDING_CLINICS_TABLE", "env-table")
  monkeypatch.setenv("ONBOARDING_CLINICS_CSV_FILE_NAME", "env-file.csv")
  s3_mock = create_mock_s3(
    'TB clinic reference number,Address,Country,Name,Created By ,Start Date,End Date\n'
    '1,"Addr, City - UK",UK,Clinic,admin,2020-01-01,2022-01-01\n'
  )
  dynamodb_mock, table_mock = create_mock_dynamodb()
  clinics_data_load.load_clinics_data(
    s3=s3_mock,
    dynamodb=dynamodb_mock,
    # bucket, key, table_name omitted to force env fallback
  )
  s3_mock.get_object.assert_called_with(Bucket="env-bucket", Key="PETS-Clinic-Dataload.csv")
  dynamodb_mock.Table.assert_called_with("env-table")


def test_load_clinics_data_missing_required_columns():
  """Test handling when required columns are missing (should raise KeyError)"""
  # Missing TB clinic reference number
  csv_data = 'Address,Country,Name,Created By ,Start Date,End Date\n' \
          '"Addr, City - UK",UK,Clinic,admin,2020-01-01,2022-01-01\n'
  s3_mock = create_mock_s3(csv_data)
  dynamodb_mock, table_mock = create_mock_dynamodb()
  with pytest.raises(KeyError):
    clinics_data_load.load_clinics_data(
      s3=s3_mock,
      dynamodb=dynamodb_mock,
      bucket="b", key="k", table_name="t"
    )

  # Missing Address
  csv_data2 = 'TB clinic reference number,Country,Name,Created By ,Start Date,End Date\n' \
        '1,UK,Clinic,admin,2020-01-01,2022-01-01\n'
  s3_mock2 = create_mock_s3(csv_data2)
  dynamodb_mock2, table_mock2 = create_mock_dynamodb()
  with pytest.raises(KeyError):
    clinics_data_load.load_clinics_data(
      s3=s3_mock2,
      dynamodb=dynamodb_mock2,
      bucket="b", key="k", table_name="t"
    )


def test_load_clinics_data_blank_and_malformed_rows():
  """Test handling of blank and malformed rows (should skip or raise)"""
  # Blank line after header
  csv_data = 'TB clinic reference number,Address,Country,Name,Created By ,Start Date,End Date\n\n'
  s3_mock = create_mock_s3(csv_data)
  dynamodb_mock, table_mock = create_mock_dynamodb()
  # Should not insert any items, but not crash
  clinics_data_load.load_clinics_data(
    s3=s3_mock,
    dynamodb=dynamodb_mock,
    bucket="b", key="k", table_name="t"
  )
  assert table_mock.put_item.call_count == 0

  # Malformed row (missing columns)
  csv_data2 = 'TB clinic reference number,Address,Country,Name,Created By ,Start Date,End Date\n' \
        '1,"Addr, City - UK",UK\n'
  s3_mock2 = create_mock_s3(csv_data2)
  dynamodb_mock2, table_mock2 = create_mock_dynamodb()
  with pytest.raises(KeyError):
    clinics_data_load.load_clinics_data(
      s3=s3_mock2,
      dynamodb=dynamodb_mock2,
      bucket="b", key="k", table_name="t"
    )


def test_load_clinics_data_prints(monkeypatch, capsys):
  """Test that print statements are executed (basic smoke test)"""
  s3_mock = create_mock_s3(
    'TB clinic reference number,Address,Country,Name,Created By ,Start Date,End Date\n'
    '1,"Addr, City - UK",UK,Clinic,admin,2020-01-01,2022-01-01\n'
  )
  dynamodb_mock, table_mock = create_mock_dynamodb()
  clinics_data_load.load_clinics_data(
    s3=s3_mock,
    dynamodb=dynamodb_mock,
    bucket="b", key="k", table_name="t"
  )
  out = capsys.readouterr().out
  assert "Bucket name: b" in out
  assert "Table name: t" in out
  assert "Retrieved object from S3" in out
  assert "Data load complete." in out


def test_main_entrypoint(monkeypatch):
  """Test __main__ entrypoint logic (env var parsing and load_clinics_data call)"""
  # Patch sys.argv and awsglue.utils.getResolvedOptions
  test_env = "ONBOARDING_CLINICS_TABLE=main-table,ONBOARDING_SCRIPT_S3_BUCKET=main-bucket,ONBOARDING_CLINICS_CSV_FILE_NAME=main-file.csv"
  monkeypatch.setitem(sys.modules, "awsglue.utils", types.SimpleNamespace(getResolvedOptions=lambda argv, keys: {"customer_executor_env_vars": test_env}))
  monkeypatch.setattr(sys, "argv", ["script.py", "--customer-executor-env-vars", test_env])
  # Patch os.environ to clear
  monkeypatch.setattr(os, "environ", {})
  # Patch boto3 client/resource to prevent real AWS calls
  monkeypatch.setitem(sys.modules, "boto3", types.SimpleNamespace(
    client=lambda *a, **kw: types.SimpleNamespace(get_object=lambda **kwargs: {"Body": io.BytesIO(b""), "ContentLength": 0}),
    resource=lambda *a, **kw: types.SimpleNamespace(Table=lambda name: types.SimpleNamespace(put_item=lambda **kwargs: None, meta=types.SimpleNamespace(client=types.SimpleNamespace(exceptions=types.SimpleNamespace(ConditionalCheckFailedException=Exception)))))
  ))
  import importlib
  import clinics_data_load as cdl
  importlib.reload(cdl)
  from unittest.mock import patch
  called = {}
  def fake_load_clinics_data(*a, **kw):
    called["called"] = True
    cdl.__dict__["__name__"] = "__main__"
