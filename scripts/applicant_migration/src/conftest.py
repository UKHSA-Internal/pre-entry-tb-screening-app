"""
conftest.py — shared fixtures for integration tests.

Requires:
  pip install pytest pytest-docker boto3

DynamoDB Local is started automatically via pytest-docker using
docker-compose.yml in this directory. Tables are recreated before
each test so every test starts with a clean, predictable state.
"""

import time
import sys
import types
from unittest.mock import MagicMock

import boto3
import pytest
from os import path
from botocore.exceptions import ClientError

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

APPLICANT_TABLE  = "applicant-table"
APPLICATION_TABLE = "application-table"
DYNAMO_LOCAL_URL  = "http://localhost:8000"
REGION            = "eu-west-2"

# ---------------------------------------------------------------------------
# Stub awsglue so migration.py can be imported without a Glue runtime
# ---------------------------------------------------------------------------

def _stub_awsglue(dry_run: bool = False):
    awsglue_pkg   = types.ModuleType("awsglue")
    awsglue_utils = types.ModuleType("awsglue.utils")
    awsglue_utils.getResolvedOptions = MagicMock(return_value={
        "APPLICANT_TABLE":  APPLICANT_TABLE,
        "APPLICATION_TABLE": APPLICATION_TABLE,
        "DRY_RUN": str(dry_run),
    })
    awsglue_pkg.utils = awsglue_utils
    sys.modules["awsglue"]       = awsglue_pkg
    sys.modules["awsglue.utils"] = awsglue_utils


# ---------------------------------------------------------------------------
# pytest-docker: tell it where our docker-compose file lives
# ---------------------------------------------------------------------------

@pytest.fixture(scope="session")
def docker_compose_file(pytestconfig):
    return str(path.join(pytestconfig.rootdir, "src", "docker-compose.yml"))


# ---------------------------------------------------------------------------
# Session-scoped: wait for DynamoDB Local to be ready
# ---------------------------------------------------------------------------

@pytest.fixture(scope="session")
def dynamodb_local(docker_services):
    """
    Blocks until DynamoDB Local is accepting connections, then yields a
    boto3 resource pointed at it. Shared for the whole test session —
    the container starts once and stops at the end.
    """
    docker_services.wait_until_responsive(
        timeout=30.0,
        pause=0.5,
        check=lambda: _is_dynamo_ready(),
    )
    resource = boto3.resource(
        "dynamodb",
        region_name=REGION,
        endpoint_url=DYNAMO_LOCAL_URL,
        aws_access_key_id="fake",
        aws_secret_access_key="fake",
    )
    yield resource


def _is_dynamo_ready() -> bool:
    try:
        client = boto3.client(
            "dynamodb",
            region_name=REGION,
            endpoint_url=DYNAMO_LOCAL_URL,
            aws_access_key_id="fake",
            aws_secret_access_key="fake",
        )
        client.list_tables()
        return True
    except Exception:
        return False


# ---------------------------------------------------------------------------
# Function-scoped: recreate both tables before every test
# ---------------------------------------------------------------------------

@pytest.fixture()
def tables(dynamodb_local):
    """
    Drops and recreates both DynamoDB tables before each test.
    Yields (applicant_table, application_table) as boto3 Table resources.
    """
    _drop_table_if_exists(dynamodb_local, APPLICANT_TABLE)
    _drop_table_if_exists(dynamodb_local, APPLICATION_TABLE)

    applicant_table = _create_table(dynamodb_local, APPLICANT_TABLE)
    application_table = _create_table(dynamodb_local, APPLICATION_TABLE)

    yield applicant_table, application_table


def _drop_table_if_exists(dynamodb, table_name: str):
    try:
        table = dynamodb.Table(table_name)
        table.delete()
        table.wait_until_not_exists()
    except ClientError as e:
        if e.response["Error"]["Code"] != "ResourceNotFoundException":
            raise


def _create_table(dynamodb, table_name: str):
    table = dynamodb.create_table(
        TableName=table_name,
        KeySchema=[
            {"AttributeName": "pk", "KeyType": "HASH"},
            {"AttributeName": "sk", "KeyType": "RANGE"},
        ],
        AttributeDefinitions=[
            {"AttributeName": "pk", "AttributeType": "S"},
            {"AttributeName": "sk", "AttributeType": "S"},
        ],
        BillingMode="PAY_PER_REQUEST",
    )
    table.wait_until_exists()
    return table


# ---------------------------------------------------------------------------
# Helpers used by integration tests
# ---------------------------------------------------------------------------

def make_statistics():
    return {
        "all_applicants": 0,
        "skipped_missing": 0,
        "skipped_migrated": 0,
        "migrated_applicants": 0,
        "applicants_to_remove": [],
    }
