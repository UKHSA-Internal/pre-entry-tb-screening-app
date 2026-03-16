"""
Integration tests for clinics_data_load.py.

Run:
  pytest test_integration.py -v

Requirements:
  pip install pytest pytest-docker boto3
  Docker must be available (pytest-docker handles start/stop automatically)
"""

import io
import pytest

import clinics_data_load


@pytest.fixture
def test_csv():
  return (
    'TB clinic reference number,Address,Country,Name,Created By ,Start Date,End Date\n'
    '789,"789 King St, Leeds - UK",UK,Clinic C,admin,2022-01-01,2023-01-01\n'
  )

def test_load_clinics_data_integration(tables, test_csv, tmp_path, monkeypatch):
  # Simulate S3 by using a local file and a mock client
  class S3Mock:
    def get_object(self, Bucket, Key):
      return {"Body": io.BytesIO(test_csv.encode("cp1252"))}

  s3_mock = S3Mock()
  # Use the real DynamoDB local resource and table
  # (no need to access internal config attributes)
  # Patch boto3.resource to return the local table
  class DynamoDBMock:
    def __init__(self, real_table):
      self._table = real_table
      self.meta = real_table.meta
    def Table(self, name):
      return self._table
  dynamodb_mock = DynamoDBMock(tables)
  # Patch ConditionalCheckFailedException
  class DummyException(Exception):
    pass
  dynamodb_mock.meta.client.exceptions.ConditionalCheckFailedException = DummyException

  clinics_data_load.load_clinics_data(
    s3=s3_mock,
    dynamodb=dynamodb_mock,
    bucket="irrelevant",
    key="irrelevant.csv",
    table_name=tables.name,
    encoding="cp1252"
  )
  # Verify the item was inserted
  items = list(tables.scan()["Items"])
  assert len(items) == 1
  assert items[0]["pk"] == "789"
  assert items[0]["city"] == "Leeds"
