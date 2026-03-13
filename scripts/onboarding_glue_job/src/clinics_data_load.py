import csv
import boto3
import io

s3 = boto3.client("s3")
dynamodb = boto3.resource("dynamodb")

bucket = "clinics-data-load-sanj"
key = "PETS-Clinic-Dataload.csv"
table_name = "clinics-details-sanj"

table = dynamodb.Table(table_name)

# Read CSV from S3
obj = s3.get_object(Bucket=bucket, Key=key)
data = obj["Body"].read().decode("cp1252")

reader = csv.DictReader(io.StringIO(data))

for row in reader:

    clinic_ref = row["TB clinic reference number"]
    address = row["Address"]

    # Extract city from address
    city = None
    if "," in address:
        city = address.split(",")[1].split("-")[0].strip()

    item = {
        "pk": clinic_ref,
        "sk": "CLINIC#ROOT",
        "clinicId": clinic_ref,
        "country": row["Country"],
        "name": row["Name"],
        "city": city,
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
