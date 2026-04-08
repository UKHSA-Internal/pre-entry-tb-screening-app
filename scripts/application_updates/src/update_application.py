import boto3
import os
import sys
import time
from botocore.exceptions import ClientError
from awsglue.utils import getResolvedOptions
from enum import Enum


class StatusGroup(Enum):
  complete = "Complete"
  not_complete = "Not Complete"


def update(application, application_table, dry_run):
    application_pk = application["pk"]
    application_status = application.get("applicationStatus")
    # Get applicationStatus to check if it's already in the right format
    status_group = application.get("statusGroup")
    new_status_group = StatusGroup.not_complete.value

    if (
        status_group is None
        or (
           status_group != StatusGroup.complete.value
            and status_group != StatusGroup.not_complete.value
        )
    ):
        if (
           application_status == "Certificate Available"
           or application_status == "Certificate Not Issued"
           or application_status == "Cancelled"
        ):
            new_status_group = StatusGroup.complete.value

    if dry_run:
        return

    try:
        application_table.update_item(
            Key={"pk": application_pk, "sk": "APPLICATION#ROOT"},
            UpdateExpression=("SET StatusGroup = :new_status_group"),
            ExpressionAttributeValues={":new_status_group": new_status_group},
            ConditionExpression=("attribute_exists(pk)")
        )

    except ClientError as e:
        if e.response["Error"]["Code"] == "ConditionalCheckFailedException":
            print(f"Error message for application with pk={application_pk}: {e}")
        else:
            raise
    print(f"Application Table - StatusGroup updated to {new_status_group}")


def main(
    dynamodb=None,
    application_table_name="application-details",
    dry_run=True,
    region="eu-west-2",
):
    if dynamodb is None:
        dynamodb = boto3.resource("dynamodb", region_name=region)

    application_table = dynamodb.Table(application_table_name)

    # First scan without ExclusiveStartKey
    response = application_table.scan()
    applications = response.get("Items", [])

    for application in applications:
        update(application, application_table, dry_run)

    # Continue scanning if there are more pages
    while "LastEvaluatedKey" in response:
        response = application_table.scan(
            ExclusiveStartKey=response["LastEvaluatedKey"]
        )
        applications = response.get("Items", [])

        for application in applications:
            update(application, application_table, dry_run)


if __name__ == "__main__":
    print("Starting Glue job, updating applications")
    print(sys.argv)

    start_time = time.time()

    args = getResolvedOptions(
        sys.argv,
        ["APPLICATION_TABLE", "AWS_REGION", "DRY_RUN"]
    )

    APPLICATION_TABLE_NAME = args["APPLICATION_TABLE"]
    AWS_REGION = args.get("AWS_REGION", "eu-west-2")
    DRY_RUN = args["DRY_RUN"]

    # Print out the missing parameters
    if not APPLICATION_TABLE_NAME or DRY_RUN is None:
        print("ERROR: Missing required parameters")
        print(f"APPLICATION_TABLE_NAME: {APPLICATION_TABLE_NAME}")
        print(f"DRY_RUN: {DRY_RUN}")

        sys.exit(1)
    else:
        APPLICATION_TABLE_NAME = APPLICATION_TABLE_NAME.strip()
        DRY_RUN = DRY_RUN.strip().lower() == "true"

    main(application_table_name=APPLICATION_TABLE_NAME, region=AWS_REGION, dry_run=DRY_RUN)

    duration = round(time.time() - start_time)
    print(f"Duration: {duration // 60} min {duration % 60} sec")

    print("Update complete")