"""
Integration tests for clinics_data_load.py.

Docker must be available (pytest-docker handles start/stop automatically)
"""

import io
import pytest

import clinics_data_load


# Simulate S3 by using a local file and a mock client
class S3Mock:
  def __init__(self, test_csv):
    self.test_csv = test_csv
    self.call_count = 0

  def get_object(self, Bucket, Key):
    self.call_count += 1
    csv_bytes = self.test_csv.encode("cp1252")
    return {"Body": io.BytesIO(csv_bytes), "ContentLength": len(csv_bytes)}


# Use the real DynamoDB local resource and table
# (no need to access internal config attributes)
# Patch boto3.resource to return the local table
class DynamoDBMock:
  def __init__(self, real_table):
    self._table = real_table
    self.meta = real_table.meta
  def Table(self, name):
    return self._table


# Patch ConditionalCheckFailedException
class DummyException(Exception):
  pass


@pytest.fixture
def test_csv():
  return (
    'TB clinic reference number,Address,Country,Name,Created By ,Start Date,End Date\n'
    '789,"789 King St, Leeds - UK",UK,Clinic C,admin,2022-01-01,2023-01-01\n'
  )


def test_load_clinics_data_integration_cp1252(table, test_csv, tmp_path, monkeypatch):
  s3_mock = S3Mock(test_csv)
  dynamodb_mock = DynamoDBMock(table)
  dynamodb_mock.meta.client.exceptions.ConditionalCheckFailedException = DummyException

  clinics_data_load.load_clinics_data(
    s3=s3_mock,
    dynamodb=dynamodb_mock,
    bucket="irrelevant",
    key="irrelevant.csv",
    table_name=table.name,
    encoding="cp1252"
  )
  # Verify the item was inserted
  items = list(table.scan()["Items"])
  assert len(items) == 1
  assert items[0]["pk"] == "CLINIC#789"
  assert items[0]["city"] == "Leeds"


def test_load_clinics_data_integration_no_encoding(table, test_csv, tmp_path, monkeypatch):
  s3_mock = S3Mock(test_csv)
  dynamodb_mock = DynamoDBMock(table)
  dynamodb_mock.meta.client.exceptions.ConditionalCheckFailedException = DummyException

  clinics_data_load.load_clinics_data(
    s3=s3_mock,
    dynamodb=dynamodb_mock,
    bucket="irrelevant",
    key="irrelevant.csv",
    table_name=table.name,
  )
  # Verify the item was inserted
  items = list(table.scan()["Items"])
  assert len(items) == 1
  assert items[0]["pk"] == "CLINIC#789"
  assert items[0]["city"] == "Leeds"


def test_load_clinics_data_integration_multiple_records(table):
  """Test loading multiple clinic records"""
  csv_data = (
    'TB clinic reference number,Address,Country,Name,Created By ,Start Date,End Date\n'
    '101,"101 First St, London - UK",UK,Clinic A,admin,2021-01-01,2023-01-01\n'
    '102,"102 Second St, Manchester - UK",UK,Clinic B,user1,2021-02-01,\n'
    '103,"103 Third Ave, Birmingham - UK",UK,Clinic C,user2,2021-03-01,2024-03-01\n'
  )
  s3_mock = S3Mock(csv_data)
  dynamodb_mock = DynamoDBMock(table)
  dynamodb_mock.meta.client.exceptions.ConditionalCheckFailedException = DummyException

  clinics_data_load.load_clinics_data(
    s3=s3_mock,
    dynamodb=dynamodb_mock,
    bucket="test-bucket",
    key="test.csv",
    table_name=table.name,
  )

  # Verify all 3 items were inserted
  items = list(table.scan()["Items"])
  assert len(items) == 3

  # Verify specific items
  pks = sorted([item["pk"] for item in items])
  assert pks == ["CLINIC#101", "CLINIC#102", "CLINIC#103"]

  # Check that one has endDate and one doesn't
  item_102 = next(item for item in items if item["pk"] == "CLINIC#102")
  assert "endDate" not in item_102

  item_101 = next(item for item in items if item["pk"] == "CLINIC#101")
  assert item_101["endDate"] == "2023-01-01"


def test_load_clinics_data_integration_date_format_conversion(table):
  """Test date format conversion from DD/MM/YYYY to YYYY-MM-DD"""
  csv_data = (
    'TB clinic reference number,Address,Country,Name,Created By ,Start Date,End Date\n'
    '301,"301 Date St, Oxford - UK",UK,Clinic Date,admin,15/06/2020,31/12/2023\n'
  )
  s3_mock = S3Mock(csv_data)
  dynamodb_mock = DynamoDBMock(table)
  dynamodb_mock.meta.client.exceptions.ConditionalCheckFailedException = DummyException

  clinics_data_load.load_clinics_data(
    s3=s3_mock,
    dynamodb=dynamodb_mock,
    bucket="test-bucket",
    key="test.csv",
    table_name=table.name,
  )

  items = list(table.scan()["Items"])
  assert len(items) == 1
  # Start date should be converted
  assert items[0]["startDate"] == "2020-06-15"
  # End date is not converted (stored as-is)
  assert items[0]["endDate"] == "31/12/2023"


def test_load_clinics_data_integration_city_extraction_from_address(table):
  """Test city extraction from address when City column is missing"""
  csv_data = (
    'TB clinic reference number,Address,Country,Name,Created By ,Start Date,End Date\n'
    '401,"401 Park Lane, Cambridge - UK",UK,Clinic City,admin,2021-05-10,\n'
  )
  s3_mock = S3Mock(csv_data)
  dynamodb_mock = DynamoDBMock(table)
  dynamodb_mock.meta.client.exceptions.ConditionalCheckFailedException = DummyException

  clinics_data_load.load_clinics_data(
    s3=s3_mock,
    dynamodb=dynamodb_mock,
    bucket="test-bucket",
    key="test.csv",
    table_name=table.name,
  )

  items = list(table.scan()["Items"])
  assert len(items) == 1
  # City should be extracted from address
  assert items[0]["city"] == "Cambridge"


def test_load_clinics_data_integration_city_column_provided(table):
  """Test that City column is used when provided"""
  csv_data = (
    'TB clinic reference number,Address,Country,Name,City,Created By ,Start Date,End Date\n'
    '501,"501 Test St, Somewhere - UK",UK,Clinic WithCity,Bristol,admin,2021-06-15,\n'
  )

  s3_mock = S3Mock(csv_data)
  dynamodb_mock = DynamoDBMock(table)
  dynamodb_mock.meta.client.exceptions.ConditionalCheckFailedException = DummyException

  clinics_data_load.load_clinics_data(
    s3=s3_mock,
    dynamodb=dynamodb_mock,
    bucket="test-bucket",
    key="test.csv",
    table_name=table.name,
  )

  items = list(table.scan()["Items"])
  assert len(items) == 1
  # City should be from the City column, not extracted from address
  assert items[0]["city"] == "Bristol"


def test_load_clinics_data_integration_encoding_fallback(table):
  """Test encoding fallback when specified encoding fails"""
  csv_data = (
    'TB clinic reference number,Address,Country,Name,Created By ,Start Date,End Date\n'
    '601,"601 Encoding St, York - UK",UK,Clinic Encoding,admin,2021-07-20,\n'
  )

  s3_mock = S3Mock(csv_data)
  dynamodb_mock = DynamoDBMock(table)
  dynamodb_mock.meta.client.exceptions.ConditionalCheckFailedException = DummyException

  # Use ascii encoding which might fail, triggering fallback
  clinics_data_load.load_clinics_data(
    s3=s3_mock,
    dynamodb=dynamodb_mock,
    bucket="test-bucket",
    key="test.csv",
    table_name=table.name,
    encoding="ascii"
  )

  # Should successfully load using fallback encoding
  items = list(table.scan()["Items"])
  assert len(items) == 1
  assert items[0]["pk"] == "CLINIC#601"


def test_load_clinics_data_integration_created_by_variations(table):
  """Test different Created By field variations"""
  csv_data = (
    'TB clinic reference number,Address,Country,Name,Created By ,Start Date,End Date\n'
    '701,"701 Admin St, Bath - UK",UK,Clinic Admin,admin,2021-08-01,\n'
    '702,"702 User St, Bath - UK",UK,Clinic User,,2021-08-02,\n'
  )

  s3_mock = S3Mock(csv_data)
  dynamodb_mock = DynamoDBMock(table)
  dynamodb_mock.meta.client.exceptions.ConditionalCheckFailedException = DummyException

  clinics_data_load.load_clinics_data(
    s3=s3_mock,
    dynamodb=dynamodb_mock,
    bucket="test-bucket",
    key="test.csv",
    table_name=table.name,
  )

  items = list(table.scan()["Items"])
  assert len(items) == 2

  # Check Created By field
  item_701 = next(item for item in items if item["pk"] == "CLINIC#701")
  assert item_701["createdBy"] == "admin"

  item_702 = next(item for item in items if item["pk"] == "CLINIC#702")
  # Empty Created By should be stored (or fallback to BulkDataLoad)
  assert "createdBy" in item_702


def test_load_clinics_data_integration_missing_required_field(table):
  """Test error handling when required field is missing"""
  csv_data = (
    'TB clinic reference number,Country,Name,Created By ,Start Date,End Date\n'
    '801,UK,Clinic NoAddress,admin,2021-09-01,\n'
  )

  s3_mock = S3Mock(csv_data)
  dynamodb_mock = DynamoDBMock(table)
  dynamodb_mock.meta.client.exceptions.ConditionalCheckFailedException = DummyException

  # Should raise KeyError for missing Address field
  with pytest.raises(KeyError) as exc_info:
    clinics_data_load.load_clinics_data(
      s3=s3_mock,
      dynamodb=dynamodb_mock,
      bucket="test-bucket",
      key="test.csv",
      table_name=table.name,
    )

  assert "Address" in str(exc_info.value)


def test_load_clinics_data_integration_all_fields_populated(table):
  """Test comprehensive record with all fields properly populated"""
  csv_data = (
    'TB clinic reference number,Address,Country,Name,City,Created By ,Start Date,End Date\n'
    '901,"901 Complete St, Norwich, UK",UK,Complete Clinic,Norwich,creator,2020-01-15,2025-12-31\n'
  )

  s3_mock = S3Mock(csv_data)
  dynamodb_mock = DynamoDBMock(table)
  dynamodb_mock.meta.client.exceptions.ConditionalCheckFailedException = DummyException

  clinics_data_load.load_clinics_data(
    s3=s3_mock,
    dynamodb=dynamodb_mock,
    bucket="test-bucket",
    key="test.csv",
    table_name=table.name,
  )

  items = list(table.scan()["Items"])
  assert len(items) == 1

  item = items[0]
  # Verify all fields
  assert item["pk"] == "CLINIC#901"
  assert item["sk"] == "CLINIC#ROOT"
  assert item["clinicId"] == "901"
  assert item["country"] == "UK"
  assert item["name"] == "Complete Clinic"
  assert item["city"] == "Norwich"
  assert item["address"] == "901 Complete St, Norwich, UK"
  assert item["createdBy"] == "creator"
  assert item["startDate"] == "2020-01-15"
  assert item["endDate"] == "2025-12-31"
