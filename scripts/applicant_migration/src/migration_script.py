# It has to be import early for pytest to be able to test
# the functions separately without running the whole script
import logging
import boto3
from botocore.exceptions import ClientError
from enum import Enum

# These enums can't be modified as they are defined in:
# pets-core-services/src/shared/types/enum.ts and used in the back-end code.
class ApplicationStatus(Enum):
  inProgress = "In Progress"
  certificateNotIssued = "Certificate Not Issued"
  certificateAvailable = "Certificate Available"
  cancelled = "Cancelled"

# See the above comment.
class ApplicationStatusGroup(Enum):
  complete = "Complete"
  incomplete = "Incomplete"


def migrate_applicant(
        applicant_row,
        applicant_table,
        application_table,
        dry_run,
        statistics,
    ):
    # applicant PK is just APPLICATION#<applicationId>
    applicationId = applicant_row["pk"]
    # SK is always APPLICANT#DETAILS
    sk = applicant_row["sk"]
    # passportId = COUNTRY#<country_code>#PASSPORT#<passportNumber>
    new_applicant_pk = applicant_row.get("passportId")

    # --------------- APPLICANT RECORD CHANGES SECTION ---------------
    if not new_applicant_pk:
        logging.info(f"SKIP Missing passportId for: {applicationId}")
        statistics["skipped_missing"] += 1
        # TODO: shouldn't it be deleted as it looks like incomplete/invalid record

        return


    if applicationId == new_applicant_pk:
        logging.info(f"SKIP already migrated: {applicationId}")
        statistics["skipped_migrated"] += 1

        return

    logging.info(f"MIGRATE {applicationId} -> {new_applicant_pk} (sk={sk})")

    # --------------- APPLICATION RECORD CHANGES SECTION ---------------
    response = application_table.get_item(
        Key={"pk": applicationId, "sk": "APPLICATION#ROOT"}
    )
    applicationRootRow = response.get("Item")

    if not applicationRootRow:
        logging.warning(
            f"WARNING: No ROOT row in application table for pk={applicationId}"
        )
        return

    new_application_status = None

    # Getting new applicationStatus
    if new_application_status is None:
        response = application_table.get_item(
            Key={"pk": applicationId, "sk": "APPLICATION#TB#CERTIFICATE"}
        )
        applicationTBRow = response.get("Item")
        is_issued = None

        if applicationTBRow:
            is_issued = applicationTBRow.get("isIssued")

        if is_issued == "Yes":
            new_application_status =  ApplicationStatus.certificateAvailable.value
            # TODO: should expiryDate also be added to application in this case?
        elif is_issued == "No":
            new_application_status = ApplicationStatus.certificateNotIssued.value
        else:
            new_application_status = ApplicationStatus.inProgress.value

    logging.info(f"Updating application status to : {new_application_status}")

    if dry_run:
        # just to mark what would be done
        statistics["migrated_applicants"] += 1
        statistics["applicants_to_remove"].append({"pk": applicationId, "sk": sk})

        return

    # --------------- SAVING NEW APPLICANT DATA ---------------
    new_item = dict(applicant_row)
    new_item["pk"] = new_applicant_pk
    applicant_table.put_item(Item=new_item)

    logging.info(
        "[MIGRATION] Applicant table pk updated from "
        f"{applicationId} to {new_applicant_pk}"
    )

    # --------------- ADDING OLD APPLICANT RECORD TO THE LIST FOR REMOVAL ---------------
    # just keep all the applicationsIds in a list for now,
    # and delete them later as a batch-action
    statistics["migrated_applicants"] += 1
    # TODO: Is it only APPLITATION#ROOT?
    statistics["applicants_to_remove"].append(
        {"pk": applicationId, "sk": sk}
    )

    # --------------- SAVING UPDATED APPLICATION DETAILS ---------------
    try:
        application_table.update_item(
            Key={"pk": applicationId, "sk": "APPLICATION#ROOT"},
            UpdateExpression=(
                "SET applicantId = :new_applicant_pk, "
                "applicationStatus = :new_application_status"
            ),
            ExpressionAttributeValues={
                ":new_applicant_pk": new_applicant_pk,
                ":new_application_status": new_application_status,
            },
            ConditionExpression=(
                "attribute_exists(pk) AND attribute_not_exists(applicantId)"
            )
        )

    except ClientError as e:
        if e.response["Error"]["Code"] == "ConditionalCheckFailedException":
            logging.erro(f"Updating application with pk={applicationId} failed: {e}")
        else:
            raise

    logging.info(f"Application Table - applicantId updated to {new_applicant_pk}")


def remove_original_applicants(applicant_table, id_list):
    """Remove original applicant records after migration (in batches of 25)."""
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


def add_application_statusgroup(
        # application_row should always be the APPLICATION#ROOT row
        application_row,
        application_table,
        dry_run,
        statistics,
    ):
    application_pk = application_row["pk"]
    sk = application_row["sk"]
    # Simple validation
    if sk != "APPLICATION#ROOT":
        statistics["skipped_rows_not_root"] += 1
        logging.error(f"SKIP Unexpected sk value for application {application_pk}: {sk}")
        return
    application_status = application_row.get("applicationStatus")
    new_status_group = ApplicationStatusGroup.incomplete.value


    if (
        application_status == ApplicationStatus.certificateAvailable.value
        or application_status == ApplicationStatus.certificateNotIssued.value
        or application_status == ApplicationStatus.cancelled.value
    ):
        new_status_group = ApplicationStatusGroup.complete.value

    if dry_run:
        # just to mark what would be done
        statistics["migrated_applications"] += 1

        return

    try:
        application_table.update_item(
            Key={"pk": application_pk, "sk": "APPLICATION#ROOT"},
            UpdateExpression=(
                "SET applicationStatusGroup = :new_status_group"
            ),
            ExpressionAttributeValues={
                ":new_status_group": new_status_group,
            },
            ConditionExpression=(
                # "attribute_exists(pk) AND attribute_not_exists(applicantId)"
                "attribute_exists(pk)"
            )
        )

    except ClientError as e:
        if e.response["Error"]["Code"] == "ConditionalCheckFailedException":
            logging.error(f"Updating application with pk={application_pk} failed: {e}")
        else:
            raise
    logging.info(
        f"[MIGRATION] - Application {application_pk} - "
        f"applicationStatusGroup updated to {new_status_group}"
    )


def scan_applicant_table(
        applicant_table_name,
        application_table_name,
        aws_region,
        dry_run,
        statistics,
        dynamodb=None,
    ):
    if dynamodb is None:
        dynamodb = boto3.resource("dynamodb", region_name=aws_region)

    applicant_table = dynamodb.Table(applicant_table_name)
    application_table = dynamodb.Table(application_table_name)

    logging.info(f"[MIGRATION] Applicant table - {applicant_table}")
    logging.info(f"[MIGRATION] Application table - {application_table}")

    response = applicant_table.scan()
    applicants = response.get("Items", [])
    statistics["all_applicants"] += len(applicants)

    for applicant_row in applicants:
        migrate_applicant(
            applicant_row,
            applicant_table,
            application_table,
            dry_run,
            statistics,
        )

    while "LastEvaluatedKey" in response:
        response = applicant_table.scan(
            ExclusiveStartKey=response["LastEvaluatedKey"]
        )
        applicants = response.get("Items", [])
        statistics["all_applicants"] += len(applicants)

        for applicant_row in applicants:
            migrate_applicant(
                applicant_row,
                applicant_table,
                application_table,
                dry_run,
                statistics,
            )

    if not dry_run:
        remove_original_applicants(applicant_table, statistics["applicants_to_remove"])


def scan_application_table(
        application_table_name,
        aws_region,
        dry_run,
        statistics,
        dynamodb=None,
    ):
    if dynamodb is None:
        dynamodb = boto3.resource("dynamodb", region_name=aws_region)

    application_table = dynamodb.Table(application_table_name)

    logging.info(f"[MIGRATION] Application table - {application_table}")

    # We only want to scan the APPLICATION#ROOT rows,
    # as they are the ones containing applicationStatus
    # and the ones we want to update with applicationStatusGroup
    response = application_table.scan(
        FilterExpression="sk = :sk",
        ExpressionAttributeValues={":sk": "APPLICATION#ROOT"},
    )
    applications = response.get("Items", [])
    statistics["all_applications"] += len(applications)
    first_batch = True

    while first_batch or "LastEvaluatedKey" in response:
        first_batch = False
        response = application_table.scan(
            ExclusiveStartKey=response["LastEvaluatedKey"]
        )
        applications = response.get("Items", [])
        statistics["all_applications"] += len(applications)

        for application_row in applications:
            add_application_statusgroup(
                application_row,
                application_table,
                dry_run,
                statistics,
            )


def applicant_migration(
        applicant_table_name,
        application_table_name,
        aws_region,
        dry_run,
        dynamodb=None
    ):
    statistics = {
        "all_applicants": 0,
        "skipped_missing": 0,
        "skipped_migrated": 0,
        "migrated_applicants": 0,
        "applicants_to_remove": [],
    }
    start_time = time.time()

    scan_applicant_table(
        applicant_table_name,
        application_table_name,
        aws_region,
        dry_run,
        statistics,
        dynamodb,
    )

    logging.info()
    logging.info(f"Read applicant rows: {statistics['all_applicants']}")
    logging.info(f"Skipped applicants without passportId: {statistics['skipped_missing']}")
    logging.info(f"Skipped already migrated applicants: {statistics['skipped_migrated']}")
    logging.info(f"Migrated applicant records: {statistics['migrated_applicants']}")
    logging.info(f"Applicants to remove/removed: {len(statistics['applicants_to_remove'])}")
    duration = round(time.time() - start_time)
    logging.info(f"Duration: {duration // 60} min {duration % 60} sec")


def application_migration(
        applicant_table_name,
        application_table_name,
        aws_region,
        dry_run,
        dynamodb=None
    ):
    statistics = {
        "all_applications": 0,
        "skipped_rows_not_root": 0,
        "skipped_migrated": 0,
        "migrated_applications": 0,
    }
    start_time = time.time()

    scan_application_table(
        applicant_table_name,
        application_table_name,
        aws_region,
        dry_run,
        statistics,
        dynamodb,
    )

    logging.info()
    logging.info(f"Read applicant rows: {statistics['all_applicants']}")
    logging.info(f"Skipped applicants without passportId: {statistics['skipped_missing']}")
    logging.info(f"Skipped already migrated applicants: {statistics['skipped_migrated']}")
    logging.info(f"Migrated applicant records: {statistics['migrated_applicants']}")
    logging.info(f"Applicants to remove/removed: {len(statistics['applicants_to_remove'])}")
    duration = round(time.time() - start_time)
    logging.info(f"Duration: {duration // 60} min {duration % 60} sec")


if __name__ == "__main__":
    import os
    import sys
    import time
    from awsglue.utils import getResolvedOptions

    # Setting up logging
    logging.basicConfig(level=logging.INFO, format="%(levelname)s - %(message)s")

    logging.info(f"GJ called with args: {sys.argv}")

    args = getResolvedOptions(
        sys.argv,
        ["APPLICANT_TABLE", "APPLICATION_TABLE", "MIGRATIONS", "REGION", "DRY_RUN"]
    )
    logging.info(f"Received arguments: {args}")

    try:
        for pair in args["customer_executor_env_vars"].split(','):
            k, v = pair.split('=', 1)
            os.environ[k] = v
    except Exception as e:
        logging.info(f"Error parsing environment variables from arguments: {e}")
        raise

    APPLICANT_TABLE_NAME = args.get("APPLICANT_TABLE")
    APPLICATION_TABLE_NAME = args.get("APPLICATION_TABLE")
    MIGRATIONS = args.get("MIGRATIONS")
    AWS_REGION = args.get("AWS_REGION")
    DRY_RUN = args["DRY_RUN"]
    # List of correct migration names used in the code, to validate the input MIGRATIONS parameter
    VALID_MIGRATIONS = ["applicant_migration", "application_statusgroup"]

    # Print out the missing parameters
    if not APPLICATION_TABLE_NAME or not MIGRATIONS or DRY_RUN is None:
        logging.error("Missing required parameters, all provided parameters:")
        logging.info(f"APPLICANT_TABLE_NAME: {APPLICANT_TABLE_NAME}")
        logging.info(f"APPLICATION_TABLE_NAME: {APPLICATION_TABLE_NAME}")
        logging.info(f"MIGRATIONS: {MIGRATIONS}")
        logging.info(f"AWS_REGION: {AWS_REGION}")
        logging.info(f"DRY_RUN: {DRY_RUN}")

        sys.exit(1)
    else:
        if APPLICANT_TABLE_NAME:
            APPLICANT_TABLE_NAME = APPLICANT_TABLE_NAME.strip()

        APPLICATION_TABLE_NAME = APPLICATION_TABLE_NAME.strip()
        # Converting MIGRATIONS to a list of migration names,
        # in case there are multiple migrations to run
        if "," in MIGRATIONS:
            MIGRATIONS = [m.strip() for m in MIGRATIONS.split(",")]
        else:
            MIGRATIONS = [MIGRATIONS.strip()]
        DRY_RUN = DRY_RUN.lower() == "true"

    # Validate that the provided migration names are correct
    for migration in MIGRATIONS:
        if migration not in VALID_MIGRATIONS:
            logging.info(f"Invalid migration name '{migration}' provided in MIGRATIONS parameter.")
            logging.info(f"Valid migration names are: {VALID_MIGRATIONS}")
            sys.exit(1)

    logging.info(f"Starting Glue DynamoDB migration (DRY_RUN={DRY_RUN})")

    for migration in MIGRATIONS:
        if migration == "applicant_migration":
            logging.info("Running applicant migration...")
            applicant_migration(
                APPLICANT_TABLE_NAME,
                APPLICATION_TABLE_NAME,
                AWS_REGION,
                DRY_RUN
            )
        elif migration == "application_statusgroup":
            logging.info("Running application status group migration...")
            application_migration(
                APPLICANT_TABLE_NAME,
                APPLICATION_TABLE_NAME,
                AWS_REGION,
                DRY_RUN
            )
        logging.info(f"Migration {migration} completed.")
