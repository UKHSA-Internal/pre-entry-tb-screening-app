import csv
import datetime as dt
import io
import os

import boto3

BUCKET = os.getenv("ONBOARDING_SCRIPT_S3_BUCKET", "aw-pets-euw-qat-s3-glue-onboarding")
CLINICS_TABLE = os.getenv("ONBOARDING_CLINICS_TABLE", "clinics-details")

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
    print(f"Retrieved object from S3, content length: {obj['ContentLength']} bytes")
    data = None

    try:
        data = obj["Body"].read().decode(encoding)
    except UnicodeDecodeError as err:
        print(f"Could not decode the file with encoding: {encoding}")

    # If decoding with the specified encoding fails, try with default one as a fallback
    if not data:
        print("Trying to decode with default encoding...")
        try:
            obj = s3.get_object(Bucket=bucket, Key=key)
            data = obj["Body"].read().decode()
        except UnicodeDecodeError as err:
            print(f"Error decoding file: {err}")
            raise Exception(
                "Failed to decode the file with both (cp1252/default) encodings."
            )
    # Print the first 100 characters of the file for verification
    print(f"data: {data[:100]}...")

    reader = csv.DictReader(io.StringIO(data))
    print(f"Header: {reader.fieldnames}")

    all_rows = 0
    new_rows = 0

    print("Converting CSV rows to DynamoDB items and inserting into table...")
    for row in reader:
        all_rows += 1
        clinic_ref = row["TB clinic reference number"]
        address = row["Address"]
        today_date_str = dt.datetime.now().strftime("%Y-%m-%d")
        start_date = row.get("Start Date") if row.get("Start Date") else today_date_str

        # It won't work for all date formats, but if the date is in dd/mm/yyyy format,
        # then this will convert it to yyyy-mm-dd
        if "/" in start_date:
            start_date_obj = dt.datetime.strptime(start_date, "%d/%m/%Y")
            start_date = start_date_obj.strftime("%Y-%m-%d")

        # Extract city from address
        city = row.get("City")

        # City column should be present in the CSV,
        # but if it's missing or empty, try to extract from address
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
            "startDate": start_date,
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
