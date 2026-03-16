
import io
import pytest
from unittest.mock import MagicMock

import clinics_data_load

@pytest.fixture
def sample_csv():
  return (
    'TB clinic reference number,Address,Country,Name,Created By ,Start Date,End Date\n'
    '123,"123 Main St, London - UK",UK,Clinic A,admin,2020-01-01,2022-01-01\n'
    '456,"456 High St, Manchester - UK",UK,Clinic B,admin,2021-01-01,\n'
  )

def test_load_clinics_data_inserts_items(monkeypatch, sample_csv):
  # Mock S3 client
  s3_mock = MagicMock()
  s3_mock.get_object.return_value = {"Body": io.BytesIO(sample_csv.encode("cp1252"))}

  # Mock DynamoDB Table
  table_mock = MagicMock()
  dynamodb_mock = MagicMock()
  dynamodb_mock.Table.return_value = table_mock

  # Patch ConditionalCheckFailedException
  class DummyException(Exception):
    pass
  dynamodb_mock.meta.client.exceptions.ConditionalCheckFailedException = DummyException

  clinics_data_load.load_clinics_data(
    s3=s3_mock,
    dynamodb=dynamodb_mock,
    bucket="irrelevant",
    key="irrelevant.csv",
    table_name="clinics-table",
    encoding="cp1252"
  )

  # Should call put_item twice (for two rows)
  assert table_mock.put_item.call_count == 2
  # Check first call's item
  item1 = table_mock.put_item.call_args_list[0][1]["Item"]
  assert item1["pk"] == "123"
  assert item1["city"] == "London"
  assert item1["endDate"] == "2022-01-01"
  # Check second call's item
  item2 = table_mock.put_item.call_args_list[1][1]["Item"]
  assert item2["pk"] == "456"
  assert item2["city"] == "Manchester"
  assert "endDate" not in item2 or item2["endDate"] == ""

def test_load_clinics_data_handles_conditional_exception(monkeypatch, sample_csv):
  s3_mock = MagicMock()
  s3_mock.get_object.return_value = {"Body": io.BytesIO(sample_csv.encode("cp1252"))}
  table_mock = MagicMock()
  # Raise exception on first put_item, succeed on second
  class DummyException(Exception):
    pass
  def put_item_side_effect(**kwargs):
    if kwargs["Item"]["pk"] == "123":
      raise DummyException
    return None
  table_mock.put_item.side_effect = put_item_side_effect
  dynamodb_mock = MagicMock()
  dynamodb_mock.Table.return_value = table_mock
  dynamodb_mock.meta.client.exceptions.ConditionalCheckFailedException = DummyException
  clinics_data_load.load_clinics_data(
    s3=s3_mock,
    dynamodb=dynamodb_mock,
    bucket="irrelevant",
    key="irrelevant.csv",
    table_name="clinics-table",
    encoding="cp1252"
  )
  # Both rows processed, exception handled
  assert table_mock.put_item.call_count == 2
