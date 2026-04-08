"""
conftest.py — shared fixtures for integration tests.

Requires:
  pip install pytest pytest-docker boto3

DynamoDB Local is started automatically via pytest-docker using
docker-compose-test.yml. Table is recreated before each test
so every test starts with a clean, predictable state.
"""

import boto3
import pytest
import sys
from os import getenv, path
from botocore.exceptions import ClientError
from unittest.mock import MagicMock

# Mock awsglue module before any imports that need it
sys.modules['awsglue'] = MagicMock()
sys.modules['awsglue.utils'] = MagicMock()

APPLICATION_TABLE = "application-table"
DYNAMO_LOCAL_URL = "http://localhost:8000"
REGION = getenv("AWS_REGION", "eu-west-2")


@pytest.fixture(scope="session")
def docker_compose_file(pytestconfig):
    return str(path.join(pytestconfig.rootdir, "docker-compose-test.yml"))


# Session-scoped: wait for DynamoDB Local to be ready
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


@pytest.fixture()
def table(dynamodb_local):
    """
    Drops and recreates both DynamoDB tables before each test.
    Yields (applicant_table, application_table) as boto3 Table resources.
    """
    _drop_table_if_exists(dynamodb_local, APPLICATION_TABLE)

    application_table = _create_table(dynamodb_local, APPLICATION_TABLE)

    yield application_table


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
