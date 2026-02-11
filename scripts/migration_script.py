import sys
import boto3
from botocore.exceptions import ClientError
from awsglue.utils import getResolvedOptions

print(sys.argv)

args = getResolvedOptions(sys.argv, ["APPLICANT_TABLE", "APPLICATION_TABLE", "DRY_RUN"])

APPLICANT_TABLE_NAME = args["APPLICANT_TABLE"].strip()
APPLICATION_TABLE_NAME = args["APPLICATION_TABLE"].strip()

DRY_RUN = args["DRY_RUN"].lower() == "true"

dynamodb = boto3.resource("dynamodb", region_name="eu-west-2")
applicant_tab = dynamodb.Table(APPLICANT_TABLE_NAME)
application_tab = dynamodb.Table(APPLICATION_TABLE_NAME)
print(f"[MIGRATION] Applicant table - {applicant_tab}")
print(f"[MIGRATION] Application table - {application_tab}")


def migrate_item(applicant_row):
    applicationId = applicant_row["pk"]
    sk = applicant_row["sk"]
    new_applicant_pk = applicant_row.get("passportId")

    if not new_applicant_pk:
        print(f"SKIP Missing passportId for: {applicationId}")
        return

    if applicationId == new_applicant_pk:
        print(f"SKIP already migrated: {applicationId}")
        return

    print(f"MIGRATE {applicationId} -> {new_applicant_pk} (sk={sk})")

    # 3. Workout application status
    response = application_tab.get_item(
        Key={"pk": applicationId, "sk": "APPLICATION#ROOT"}
    )
    applicationRootRow = response.get("Item")

    new_application_status = None

    if applicationRootRow:
        new_application_status = applicationRootRow.get("applicationStatus")

    if new_application_status is None:
        response = application_tab.get_item(
            Key={"pk": applicationId, "sk": "APPLICATION#TB#CERTIFICATE"}
        )

        applicationTBRow = response.get("Item")
        is_issued = None
        if applicationTBRow:
            is_issued = applicationTBRow.get("isIssued")

        if is_issued == "Yes":
            new_application_status = "Certificate Available"
        elif is_issued == "No":
            new_application_status = "Certificate not issued"
        else:
            new_application_status = "In progress"

    print(f"Updating application status to : {new_application_status}")

    if DRY_RUN:
        return

    # 1. Write new item
    new_item = dict(applicant_row)
    new_item["pk"] = new_applicant_pk
    applicant_tab.put_item(Item=new_item)

    print(
        f"[MIGRATION] Applicant table pk updated from {applicationId} to {new_applicant_pk}"
    )

    # 2. Delete old item
    applicant_tab.delete_item(Key={"pk": applicationId, "sk": sk})
    print(f"[MIGRATION] Applicant table {applicationId} row deleted")

    # 4. Update application_tab ROOT row
    try:
        application_tab.update_item(
            Key={"pk": applicationId, "sk": "APPLICATION#ROOT"},
            UpdateExpression="SET applicantId = :new_applicant_pk, applicationStatus = :new_application_status",
            ExpressionAttributeValues={
                ":new_applicant_pk": new_applicant_pk,
                ":new_application_status": new_application_status,
            },
            ConditionExpression="attribute_exists(pk) AND attribute_not_exists(applicantId)",
        )

    except ClientError as e:
        if e.response["Error"]["Code"] == "ConditionalCheckFailedException":
            print(f"WARNING: No ROOT row in application_tab for pk={applicationId}")
        else:
            raise
    print(f"[MIGRATION] - Application Table - applicantId updated to {new_applicant_pk}")


def scan_applicant_tab():
    response = applicant_tab.scan()
    applicants = response.get("Items", [])

    for applicant_row in applicants:
        migrate_item(applicant_row)

    while "LastEvaluatedKey" in response:
        response = applicant_tab.scan(ExclusiveStartKey=response["LastEvaluatedKey"])
        for item in response.get("Items", []):
            migrate_item(item)


def main():
    print(f"Starting Glue DynamoDB migration (DRY_RUN={DRY_RUN})")
    scan_applicant_tab()
    print("Migration complete")


if __name__ == "__main__":
    main()
