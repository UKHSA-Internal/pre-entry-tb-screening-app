import json
import logging
import os
from datetime import datetime as dt
from pathlib import Path
from boto3.dynamodb.types import TypeSerializer

logging.basicConfig()
logging.getLogger().setLevel(logging.INFO)

dir_path = Path.cwd()
serializer = TypeSerializer()

DEFAULT_ENV = os.getenv("ENVIRONMENT", "qat")
WORKDIR = os.getenv("WORKDIR", "pets-core-services/src/clinic-service")
CLINIC_SERVICE_DATABASE_NAME = os.getenv(
    "CLINIC_SERVICE_DATABASE_NAME", "clinics-details"
)
DBCLINICSDATA = os.getenv(
    "CLINICSDATA",
    os.path.join(dir_path, WORKDIR, f"clinicsData.dynamoDB.{DEFAULT_ENV}.json")
)
INPUTDATA = os.getenv("JSONCLINICSDATA", "clinicsData.json")
COUNTRYCODES_FILE_PATH = "pets-core-services/src/shared/country.ts"


def get_country_codes():
    reading = False
    codes = []

    with open(COUNTRYCODES_FILE_PATH) as fh:
        for line in fh.readlines():
            if reading or "enum CountryCode" in line:
                if "}" in line:
                    break

                reading = True

                try:
                    codes.append(line.split("=")[0].strip())
                except Exception as err:
                    print(f"Couldn't get CountryCodes because of the error: {err}")
                    continue

        return codes


def validate_clinics_data(clinic_obj):
    """
    This validates the data, and also adds 'pk' and 'sk'
    """
    country_codes = get_country_codes()

    try:
        # All these should have some values
        if (
            not clinic_obj.get("clinicId")
            or not clinic_obj.get("name")
            or not clinic_obj.get("country")
            or not clinic_obj.get("city")
            or not clinic_obj.get("startDate")
            or not clinic_obj.get("createdBy")
        ):
            logging.error('Clinic object missing required attribute')

            return
        # Can startDate for a clinic be from before 2024-01-01?
        elif (
            clinic_obj["startDate"] is not None
            and dt.fromisoformat(clinic_obj["startDate"]) < dt.fromisoformat("2024-01-01")
        ):
            logging.error(f'Failed to convert startDate: {clinic_obj["startDate"]}')

            return
        # If endDate have a value, then it has te be possible to convert it to Date
        elif (
            clinic_obj["endDate"] is not None
            and (
                dt.fromisoformat(clinic_obj["endDate"])
                < dt.fromisoformat(clinic_obj["startDate"])
            )
        ):
            logging.error(f'Failed to validate endDate: {clinic_obj["endDate"]}')

            return
        elif (
            clinic_obj.get("country") is None
            or clinic_obj["country"] not in country_codes
        ):
            logging.error(f"Country code is incorrect: {clinic_obj.get('country')}")

            return
    except Exception as err:
        logging.error(err)

        return

    return {
        "clinicId": clinic_obj["clinicId"],
        "name": clinic_obj["name"],
        "country": clinic_obj["country"],
        "city": clinic_obj["city"],
        "startDate": clinic_obj["startDate"],
        "endDate": clinic_obj["endDate"],
        "createdBy": clinic_obj["createdBy"],
        "pk": f'CLINIC#{clinic_obj["clinicId"]}',
        "sk": "CLINIC#ROOT",
    }


def get_json_data():
    with open(os.path.join(dir_path, WORKDIR, INPUTDATA)) as fh:
        data = json.load(fh)

        return [
            validate_clinics_data(clinic)
            for clinic in data
            if validate_clinics_data(clinic)
        ]


def serialize(objects):
    new_list = []

    for obj in objects:
        put_request_obj = {
            "PutRequest": {
                "Item": {
                    key: serializer.serialize(value)
                    for key, value in obj.items()
                },
            }
        }
        new_list.append(put_request_obj)

    return {CLINIC_SERVICE_DATABASE_NAME: [*new_list]}


if __name__ == "__main__":
    logging.info(f"DEFAULT_ENV is set to: {DEFAULT_ENV}")
    logging.info(f"CLINIC_SERVICE_DATABASE_NAME is set to: {CLINIC_SERVICE_DATABASE_NAME}")
    logging.info(f"INPUTDATA is set to: {INPUTDATA}")
    logging.info(f"DBCLINICSDATA is set to: {DBCLINICSDATA}")
    logging.info(f"WORKDIR is set to: {WORKDIR}")

    clinics_data = get_json_data()
    logging.info(f"Correct clinics objects: {len(clinics_data)}")

    dynamodb_data = serialize(clinics_data)

    with open(DBCLINICSDATA, "wt", encoding='utf-8') as fh:
        json.dump(dynamodb_data, fh, ensure_ascii=False, indent=4)

    logging.info(f"DynamoDB data (clinics) saved into file: {DBCLINICSDATA}")
