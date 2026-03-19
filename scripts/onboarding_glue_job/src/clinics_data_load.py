import csv
import io
import os

import boto3

BUCKET = os.getenv("ONBOARDING_SCRIPT_S3_BUCKET", "aw-pets-euw-dev-s3-glue-onboarding")
CLINICS_TABLE = os.getenv("ONBOARDING_CLINICS_TABLE", "clinics-details-test")

print(f"Bucket name from env vars: {os.getenv('ONBOARDING_SCRIPT_S3_BUCKET')}, using: {BUCKET}")
print(f"Table name from env vars: {os.getenv('ONBOARDING_CLINICS_TABLE')}, using: {CLINICS_TABLE}")


# This function is designed to be testable by allowing dependency injection
# of the S3 client and DynamoDB resource.
def load_clinics_data(
    s3=None,
    dynamodb=None,
    bucket=BUCKET,
    key="PETS-Clinic-Dataload.csv",
    table_name=CLINICS_TABLE,
    encoding="cp1252"
):
    """
    Loads clinic data from a CSV in S3 and writes to DynamoDB.
    Allows dependency injection for testing.
    """
    print("Creating s3 client and DynamoDB resource...")
    if s3 is None:
        s3 = boto3.client("s3")
    if dynamodb is None:
        dynamodb = boto3.resource("dynamodb")
    table = dynamodb.Table(table_name)

    obj = s3.get_object(Bucket=bucket, Key=key)
    data = None

    print("Decoding file content...")
    try:
        data = obj["Body"].read().decode(encoding)
    except UnicodeDecodeError as err:
        print(f"Could not decode the file with encoding: {encoding}")

    # If decoding with the specified encoding fails, try with utf-8 as a fallback
    if not data and encoding != "utf-8":
        try:
            data = obj["Body"].read().decode("utf-8")
        except UnicodeDecodeError as err:
            print(f"Error decoding file: {err}")
            raise Exception(
                "Failed to decode the file with both (cp1252/utf-8) encodings."
            )

    reader = csv.DictReader(io.StringIO(data))
    print(f"Header: {reader.fieldnames}")

    all_rows = 0
    new_rows = 0

    print("Converting CSV rows to DynamoDB items and inserting into table...")
    for row in reader:
        all_rows += 1
        clinic_ref = row["TB clinic reference number"]
        address = row["Address"]

        # Extract city from address
        city = row.get("City")

        if not city and "," in address:
            city = address.split(",")[1].split("-")[0].strip()

        item = {
            "pk": f"CLINIC#{clinic_ref}",
            "sk": "CLINIC#ROOT",
            "clinicId": clinic_ref,
            "country": row["Country"],
            "name": row["Name"],
            "city": city,
            "address": address,
            "createdBy": (
                row.get("Created By ")
                if row.get("Created By ")
                else row.get("Created By", "BulkDataLoad")
            ),
            "startDate": row.get("Start Date", "2000-01-01"),
        }

        if row.get("End Date"):
            item["endDate"] = row["End Date"]

        try:
            table.put_item(
                Item=item,
                ConditionExpression="attribute_not_exists(pk)"
            )
        except dynamodb.meta.client.exceptions.ConditionalCheckFailedException:
            print(f"Record with this attribute already exists: {item['pk']}")
        else:
            new_rows += 1

    print("Data load complete.")
    print(f"Total rows processed: {all_rows}")
    print(f"New rows inserted: {new_rows}")

# If run as a script, execute with default AWS resources
if __name__ == "__main__":
    load_clinics_data()
