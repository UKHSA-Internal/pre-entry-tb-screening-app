import boto3
import os
import sys
import time
from botocore.exceptions import ClientError
from awsglue.utils import getResolvedOptions
from enum import StrEnum


class ApplicationStatus(StrEnum):
  inProgress = "In Progress",
  certificateNotIssued = "Certificate Not Issued",
  certificateAvailable = "Certificate Available",
  cancelled = "Cancelled",


print(sys.argv)

args = getResolvedOptions(
    sys.argv,
    ["APPLICANT_TABLE", "APPLICATION_TABLE", "DRY_RUN"]
)

APPLICANT_TABLE_NAME = args["APPLICANT_TABLE"]
APPLICATION_TABLE_NAME = args["APPLICATION_TABLE"]
AWS_REGION = os.getenv("AWS_REGION", "eu-west-2")
DRY_RUN = args["DRY_RUN"]

# Print out the missing parameters
if not APPLICANT_TABLE_NAME or not APPLICATION_TABLE_NAME or DRY_RUN is None:
    print("ERROR: Missing required parameters")
    print(f"APPLICANT_TABLE_NAME: {APPLICANT_TABLE_NAME}")
    print(f"APPLICATION_TABLE_NAME: {APPLICATION_TABLE_NAME}")
    print(f"DRY_RUN: {DRY_RUN}")

    sys.exit(1)
else:
    APPLICANT_TABLE_NAME = APPLICANT_TABLE_NAME.strip()
    APPLICATION_TABLE_NAME = APPLICATION_TABLE_NAME.strip()
    DRY_RUN = DRY_RUN.lower() == "true"


def migrate_item(args):
    applicant_row, applicant_table, application_table, statistics = args
    # applicant PK is just APPLICATION#<applicationId>
    applicationId = applicant_row["pk"]
    # SK is always APPLICANT#DETAILS
    sk = applicant_row["sk"]
    # passportId = COUNTRY#<country_code>#PASSPORT#<passportNumber>
    new_applicant_pk = applicant_row.get("passportId")

    # --------------- APPLICANT RECODR CHANGES SECTION ---------------
    if not new_applicant_pk:
        print(f"SKIP Missing passportId for: {applicationId}")
        statistics["skipped_missing"] += 1
        # TODO: shouldn't it be deleted as it looks like incomplete/invalid record

        return


    if applicationId == new_applicant_pk:
        print(f"SKIP already migrated: {applicationId}")
        statistics["skipped_migrated"] += 1

        return

    print(f"MIGRATE {applicationId} -> {new_applicant_pk} (sk={sk})")

    # --------------- APPLICATION RECORD CHANGES SECTION ---------------
    # 3. Workout application status
    response = application_table.get_item(
        Key={"pk": applicationId, "sk": "APPLICATION#ROOT"}
    )
    applicationRootRow = response.get("Item")
    new_application_status = None

    # TODO: What does it mean that there's no application with the applicationId
    if applicationRootRow:
        new_application_status = applicationRootRow.get("applicationStatus")

    if new_application_status is None:
        response = application_table.get_item(
            Key={"pk": applicationId, "sk": "APPLICATION#TB#CERTIFICATE"}
        )
        applicationTBRow = response.get("Item")
        is_issued = None

        if applicationTBRow:
            is_issued = applicationTBRow.get("isIssued")

        if is_issued == "Yes":
            new_application_status =  ApplicationStatus.certificateAvailable
            # TODO: should expiryDate also be added to application in this case?
        elif is_issued == "No":
            new_application_status = ApplicationStatus.certificateNotIssued
        else:
            new_application_status = ApplicationStatus.inProgress

    print(f"Updating application status to : {new_application_status}")

    if DRY_RUN:
        # just to mark what would be done
        statistics["migrated_applicants"] += 1
        statistics["applicants_to_remove"].append({"pk": applicationId, "sk": sk})

        return

    # --------------- SAVING NEW APPLICANT DATA ---------------
    # 1. Write new item
    new_item = dict(applicant_row)
    new_item["pk"] = new_applicant_pk
    applicant_table.put_item(Item=new_item)

    print(
        "[MIGRATION] Applicant table pk updated from "
        "{applicationId} to {new_applicant_pk}"
    )

    # --------------- ADDING OLD APPLICANT RECORD TO THE LIST FOR REMOVAL ---------------
    # 2. Delete old item
    # just keep all the applicationsIds in a list for now,
    # and delete them later as a batch-action
    statistics["migrated_applicants"] += 1
    # TODO: Is it only APPLITATION#ROOT?
    statistics["applicants_to_remove"].append(
        {"pk": applicationId, "sk": sk}
    )

    # --------------- SAVING UPDATED APPLICATION DETAILS ---------------
    # 4. Update application_tab ROOT row
    try:
        application_table.update_item(
            Key={"pk": applicationId, "sk": "APPLICATION#ROOT"},
            UpdateExpression=(
                "SET applicantId = :new_applicant_pk, "
                "applicationStatus = :new_application_status"
            ),
            ExpressionAttributeValues={
                ":new_applicant_pk": new_applicant_pk,
                ":new_application_status": new_application_status
            },
            ConditionExpression=(
                "attribute_exists(pk) AND attribute_not_exists(applicantId)"
            )
        )

    except ClientError as e:
        if e.response["Error"]["Code"] == "ConditionalCheckFailedException":
            print(f"WARNING: No ROOT row in application_tab for pk={applicationId}")
        else:
            raise
    print(f"[MIGRATION] - Application Table - applicantId updated to {new_applicant_pk}")


def remove_original_applicants(dynamodb, applicant_table, id_list):
    while len(id_list) > 0:
        if len(id_list) >= 25:
            # ids25 is the list of IDs up to 25 elements (batch_write_item restrictions)
            ids25 = id_list[:25]
            id_list = id_list[25:]
        else:
            ids25 = id_list
            # remove elements from id_list to get out of 'while' loop
            id_list = []

        with applicant_table.batch_writer() as ddb_batch:
            for key in ids25:
                ddb_batch.delete_item(Key=key)


def scan_applicant_table(statistics, dynamodb=None):
    if dynamodb is None:
        dynamodb = boto3.resource("dynamodb", region_name=AWS_REGION)

    applicant_table = dynamodb.Table(APPLICANT_TABLE_NAME)
    application_table = dynamodb.Table(APPLICATION_TABLE_NAME)

    print(f"[MIGRATION] Applicant table - {applicant_table}")
    print(f"[MIGRATION] Application table - {application_table}")

    response = applicant_table.scan()
    applicants = response.get("Items", [])
    statistics["all_applicants"] += len(applicants)

    for applicant_row in applicants:
        migrate_item((applicant_row, applicant_table, application_table, statistics))

    while "LastEvaluatedKey" in response:
        response = applicant_table.scan(
            ExclusiveStartKey=response["LastEvaluatedKey"]
        )
        applicants = response.get("Items", [])
        statistics["all_applicants"] += len(applicants)

        for applicant_row in applicants:
            migrate_item((applicant_row, applicant_table, application_table, statistics))

    if not DRY_RUN:
        remove_original_applicants(
            dynamodb,
            applicant_table,
            statistics["applicants_to_remove"],
        )


def main():
    print(f"Starting Glue DynamoDB migration (DRY_RUN={DRY_RUN})")

    statistics = {
        "all_applicants": 0,
        "skipped_missing": 0,
        "skipped_migrated": 0,
        "migrated_applicants": 0,
        "applicants_to_remove": [],
    }
    start_time = time.time()

    scan_applicant_table(statistics)

    print()
    print(f"Read applicant rows: {statistics['all_applicants']}")
    print(f"Skipped applicants without passportId: {statistics['skipped_missing']}")
    print(f"Skipped already migrated applicants: {statistics['skipped_migrated']}")
    print(f"Migrated applicant records: {statistics['migrated_applicants']}")
    print(f"Applicants to remove/removed: {len(statistics['applicants_to_remove'])}")
    duration = round(time.time() - start_time)
    print(f"Duration: {duration // 60} min {duration % 60} sec")

    print("Migration complete")

if __name__ == "__main__":
    main()
