# It has to be import early for pytest to be able to test
# the functions separately without running the whole script
import logging
import boto3
import sys
from botocore.exceptions import ClientError
from enum import Enum

# Setting up logger
logger = logging.getLogger(__name__)
# Use DEBUG instead of INFO for more details (it could be parameterized)
logger.setLevel(logging.INFO)

handler = logging.StreamHandler(sys.stdout)
handler.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)

# All combined statistics globally available and updated across the functions
# during the migration process,
# (applicants_to_remove is used to remove old migrated applicant records)
statistics = {
    "all_applicants": 0,
    "all_applications": 0,
    "skipped_missing": 0,
    "skipped_migrated": 0,
    # This is added with the check while it's still in development
    "skipped_rows_not_root": 0,
    "skipped_updating_statusgroup": 0,
    "migrated_applicants": 0,
    "migrated_applications": 0,
    "applicants_to_remove": [],
}

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
    if applicationId == new_applicant_pk:
        logger.debug(f"SKIP already migrated: {applicationId}")
        statistics["skipped_migrated"] += 1

        return

    # Already migrated applicants are not included
    statistics["all_applicants"] += 1

    if not new_applicant_pk:
        logger.debug(f"SKIP Missing passportId for: {applicationId}")
        statistics["skipped_missing"] += 1
        # TODO: shouldn't it be deleted as it looks like incomplete/invalid record

        return

    logger.debug(f"MIGRATE {applicationId} -> {new_applicant_pk} (sk={sk})")

    # --------------- APPLICATION RECORD CHANGES SECTION ---------------
    response = application_table.get_item(
        Key={"pk": applicationId, "sk": "APPLICATION#ROOT"}
    )
    applicationRootRow = response.get("Item")

    if not applicationRootRow:
        logger.warning(
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

    logger.debug(f"Updating application status to : {new_application_status}")

    if dry_run:
        # just to mark what would be done
        statistics["migrated_applicants"] += 1
        statistics["applicants_to_remove"].append({"pk": applicationId, "sk": sk})

        return

    # --------------- SAVING NEW APPLICANT DATA ---------------
    new_item = dict(applicant_row)
    new_item["pk"] = new_applicant_pk
    applicant_table.put_item(Item=new_item)

    logger.debug(
        "[MIGRATION] Applicant table pk updated from "
        f"{applicationId} to {new_applicant_pk}"
    )

    # --------------- ADDING OLD APPLICANT RECORD TO THE LIST FOR REMOVAL ---------------
    # just keep all the applicationsIds (pk values) in a list for now,
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
            logger.error(f"Updating application with pk={applicationId} failed: {e}")
        else:
            raise

    logger.debug(f"Application Table - applicantId updated to {new_applicant_pk}")


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
    statistics["all_applications"] += 1
    application_pk = application_row["pk"]
    sk = application_row["sk"]
    # Simple validation, while the script is in development stage,
    # to make sure we are getting the right rows
    if sk != "APPLICATION#ROOT":
        statistics["skipped_rows_not_root"] += 1
        logger.error(f"SKIP Unexpected sk value for application {application_pk}: {sk}")
        return
    application_status = application_row.get("applicationStatus")
    new_status_group = ApplicationStatusGroup.incomplete.value


    if (
        application_status == ApplicationStatus.certificateAvailable.value
        or application_status == ApplicationStatus.certificateNotIssued.value
        or application_status == ApplicationStatus.cancelled.value
    ):
        new_status_group = ApplicationStatusGroup.complete.value

    statistics["migrated_applications"] += 1

    if dry_run:
        # Don't update for real, return
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
            logger.error(f"Updating application with pk={application_pk} failed: {e}")
        else:
            raise
    logger.debug(
        f"Updated application {application_pk} - "
        f"applicationStatusGroup set to {new_status_group}"
    )


def scan_table(table, last_evaluated_key=None, scan_filter={},):
    params = (
        scan_filter
        if not last_evaluated_key
        else {**scan_filter, "ExclusiveStartKey": last_evaluated_key}
    )
    response = table.scan(**params)
    last_evaluated_key = response.get("LastEvaluatedKey")
    items = response.get("Items", [])

    logger.info(
        f"Scanned {len(items)} items from {table.name} with params: {params}, "
        f"last_evaluated_key: {last_evaluated_key}"
    )

    return items, last_evaluated_key


def data_migration(
        applicant_table_name,
        application_table_name,
        aws_region,
        dry_run,
        dynamodb=None,
        migration=None,
    ):
    global statistics

    if dynamodb is None:
        dynamodb = boto3.resource("dynamodb", region_name=aws_region)

    applicant_table = dynamodb.Table(applicant_table_name)
    application_table = dynamodb.Table(application_table_name)

    start_time = time.time()
    table = (
        application_table
        if migration == "application_statusgroup"
        else applicant_table
    )
    last_evaluated_key = None
    first_scan = True
    scan_filter = {}

    # For application_statusgroup migration we only want to scan the APPLICATION#ROOT rows
    if migration == "application_statusgroup":
        scan_filter = {
            "FilterExpression": "sk = :sk",
            "ExpressionAttributeValues": {":sk": "APPLICATION#ROOT"},
        }

    while first_scan or last_evaluated_key:
        logger.info(f"Scanning {table.name}...")

        rows, last_evaluated_key = scan_table(
            table,
            last_evaluated_key=last_evaluated_key,
            scan_filter=scan_filter,
        )
        first_scan = False

        if migration == "applicant_migration":
            for row in rows:
                migrate_applicant(
                    row,
                    applicant_table,
                    application_table,
                    dry_run,
                    statistics,
                )
        elif migration == "application_statusgroup":
            for row in rows:
                add_application_statusgroup(
                    row,
                    application_table,
                    dry_run,
                    statistics,
                )


    # Post-migration cleanup actions, e.g. removing old applicant records after migration
    if migration == "applicant_migration" and not dry_run:
        logger.info("Now removing the original applicant records...")
        remove_original_applicants(
            applicant_table, statistics["applicants_to_remove"]
        )
        logger.info(
            f"Removed {len(statistics['applicants_to_remove'])} original applicant records"
        )

    # If it's not applicant_migration, then remove applicants_to_remove
    # (in case that migration was run before) from statistics as it's not relevant
    if migration != "applicant_migration":
        statistics["applicants_to_remove"] = []

    for key, value in statistics.items():
        # if isinstance(value, list) and len(value) > 50 and key == "applicants_to_remove":
        #     value = f"number of records: {len(value)}"
        logger.info(f"{key}: {value}")

    duration = round(time.time() - start_time)
    logger.info(f"Duration: {duration // 60} min {duration % 60} sec")


# ----------------------------------------------------------------------------------------
# The main function is only executed when running the script directly.
# It sets up the parameters and calls the data_migration function.
if __name__ == "__main__":
    import time
    from awsglue.utils import getResolvedOptions

    logger.info(f"GJ called with args: {sys.argv}")

    args = getResolvedOptions(
        sys.argv,
        ["APPLICANT_TABLE", "APPLICATION_TABLE", "MIGRATIONS", "AWS_REGION", "DRY_RUN"]
    )
    logger.info(f"Received arguments: {args}")

    APPLICANT_TABLE_NAME = args.get("APPLICANT_TABLE")
    APPLICATION_TABLE_NAME = args["APPLICATION_TABLE"]
    MIGRATIONS = args["MIGRATIONS"]
    AWS_REGION = args["AWS_REGION"]
    DRY_RUN = args["DRY_RUN"]
    # List of correct migration names used in the code,
    # to validate the input MIGRATIONS parameter
    VALID_MIGRATIONS = ["applicant_migration", "application_statusgroup"]

    if APPLICANT_TABLE_NAME:
        APPLICANT_TABLE_NAME = APPLICANT_TABLE_NAME.strip()

    APPLICATION_TABLE_NAME = APPLICATION_TABLE_NAME.strip()
    # Converting MIGRATIONS to a list of migration names,
    # in case there are multiple migrations to run
    if "," in MIGRATIONS:
        MIGRATIONS = [m.strip() for m in MIGRATIONS.split(",")]
    else:
        MIGRATIONS = [MIGRATIONS.strip()]
    # Converting DRY_RUN to a boolean value, it should default to True
    dry_run = not bool(DRY_RUN.lower() == "false")

    # Validate that the provided migration names are correct
    for migration in MIGRATIONS:
        if migration not in VALID_MIGRATIONS:
            logger.info(
                f"Invalid migration name '{migration}' provided in MIGRATIONS parameter."
            )
            logger.info(f"Valid migration names are: {VALID_MIGRATIONS}")
            sys.exit(1)

        if migration == "applicant_migration":
            if not APPLICANT_TABLE_NAME:
                logger.error(
                    "APPLICANT_TABLE parameter is required for applicant migration."
                )
                sys.exit(1)

    logger.info(f"Starting Glue DynamoDB migration (DRY_RUN={dry_run})")
    run_migrations = []

    # -------------------------------- Running Migrations --------------------------------
    # Running the specified migrations sequentially
    for migration in MIGRATIONS:
        logger.info(f"Running migration: {migration}")

        data_migration(
            APPLICANT_TABLE_NAME,
            APPLICATION_TABLE_NAME,
            AWS_REGION,
            dry_run,
            dynamodb=None,
            migration=migration,
        )
        run_migrations.append(migration)

        logger.info(f"Migration {migration} completed.")

    logger.info(f"Completed migrations: {run_migrations} (DRY_RUN={dry_run})")
