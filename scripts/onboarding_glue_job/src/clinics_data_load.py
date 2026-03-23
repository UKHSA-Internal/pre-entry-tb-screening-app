import csv
import io
import os

import boto3

BUCKET = os.getenv("ONBOARDING_SCRIPT_S3_BUCKET", "aw-pets-euw-dev-s3-glue-onboarding")
CLINICS_TABLE = os.getenv("ONBOARDING_CLINICS_TABLE", "clinics-details-test")


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
        print(f"Error decoding file with encoding {encoding}: {err}")

    if not data and encoding != "utf-8":
        try:
            data = obj["Body"].read().decode("utf-8")
        except UnicodeDecodeError as err:
            print(f"Error decoding file with utf-8 encoding: {err}")
            raise Exception("Failed to decode the file with both encodings.")

    reader = csv.DictReader(io.StringIO(data))

    print("Converting CSV rows to DynamoDB items and inserting into table...")
    for row in reader:
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
            "createdBy": row["Created By "],
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
            pass

    print("Data load complete.")

# If run as a script, execute with default AWS resources
if __name__ == "__main__":
    load_clinics_data()
