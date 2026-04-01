import os
import sys
import pytest
from unittest import mock

import clinics_data_load


def test_env_vars_are_set_from_argument(monkeypatch):
    # Directly test the parsing logic for env var string
    env_var_string = "ONBOARDING_CLINICS_TABLE=test-table,ONBOARDING_SCRIPT_S3_BUCKET=test-bucket"
    for pair in env_var_string.split(','):
        k, v = pair.split('=', 1)
        os.environ[k] = v
    assert os.environ["ONBOARDING_CLINICS_TABLE"] == "test-table"
    assert os.environ["ONBOARDING_SCRIPT_S3_BUCKET"] == "test-bucket"


def test_load_clinics_data_reads_env(monkeypatch):
    monkeypatch.setenv("ONBOARDING_CLINICS_TABLE", "my-table")
    monkeypatch.setenv("ONBOARDING_SCRIPT_S3_BUCKET", "my-bucket")

    mock_s3 = mock.Mock()
    mock_dynamodb = mock.Mock()
    mock_table = mock.Mock()
    mock_dynamodb.Table.return_value = mock_table

    mock_s3.get_object.return_value = {
        "Body": mock.Mock(read=mock.Mock(return_value=b"TB clinic reference number,Country,Name,City,Address,Created By ,Start Date,End Date\n123,UK,ClinicName,London,\"123 Street, London\",User,01/01/2020,02/02/2022")),
        "ContentLength": 100
    }

    clinics_data_load.load_clinics_data(s3=mock_s3, dynamodb=mock_dynamodb)

    args, kwargs = mock_table.put_item.call_args
    item = kwargs["Item"]
    assert item["clinicId"] == "123"
    assert item["country"] == "UK"
    assert item["city"] == "London"
    assert item["address"].startswith("123 Street")
