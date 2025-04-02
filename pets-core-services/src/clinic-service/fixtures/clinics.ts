import { readFileSync } from "fs";
import { resolve } from "path";

import { CountryCode } from "../../shared/country";
import { logger } from "../../shared/logger";
import { NewClinic } from "../models/clinics";

// TODO: move it to env var
const filePath = "src/clinic-service/fixtures/clinics.json";

const getClinicObject = (obj: Record<string, string>): NewClinic | void => {
  try {
    // Checking if all required attributes are present
    const { clinicId, name, country, city, startDate, endDate, createdBy } = obj;

    // All these should have some values
    if (!clinicId || !name || !country || !city || !startDate || !createdBy) {
      logger.error(`Clinic object missing requireq attribute (object: ${JSON.stringify(obj)}`);

      return;
      // Can startDate for a clinic be from before 2024-01-01?
    } else if (new Date(startDate) < new Date("2024-01-01")) {
      logger.error(`Failed to convert startDate: ${startDate}`);

      return;
      // If endDate have a value, then it has te be possible to convert it to Date
    } else if (endDate && new Date(endDate) < new Date(startDate)) {
      logger.error(`Failed to validate endDate: ${endDate}`);

      return;
    }
    const countries = Object(CountryCode) as CountryCode;
    // logger.info(`country codes: ${JSON.stringify(countries)}`);

    // Checking if country is one of CountryCode keys
    if (!Object.keys(countries).indexOf(country)) {
      logger.error(`Can't convert to CountyCode: ${country}`);

      return;
    }
    return {
      clinicId: clinicId,
      name: name,
      country: country as CountryCode,
      city: city,
      startDate: startDate,
      endDate: endDate ? endDate : null,
      createdBy: createdBy,
    } as NewClinic;
  } catch (err) {
    logger.error(
      `The errore message: ${JSON.stringify(err)} which happened while validationg/converting this object: ${JSON.stringify(obj)}`,
    );

    return;
  }
};

const validateClinics = (data: string | undefined | void): NewClinic[] => {
  if (!data) {
    logger.info("The json file didn't contain correct objects");

    return [];
  }
  const clinicObjects: NewClinic[] = [];
  let counter = 0;

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const clinicList = JSON.parse(data);

    for (const clinic of clinicList) {
      const newClinic = getClinicObject(clinic as Record<string, string>);

      if (newClinic) {
        logger.info(`Clinic created: ${JSON.stringify(newClinic)}`);
        clinicObjects.push(newClinic);
        counter++;
      }
    }
    logger.info(`Saved ${counter} clinics`);

    return clinicObjects;
  } catch (err) {
    logger.error(err);

    return [];
  }
};

const readClinicsFromFile = (): string | void => {
  try {
    const data = readFileSync(resolve(process.cwd(), filePath), "utf-8").toString();
    logger.info(`File data (from file): ${data.length}`);

    return data;
  } catch (err) {
    logger.error(`File reading error: ${JSON.stringify(err)}`);

    return;
  }
};

export const seededClinics: NewClinic[] = validateClinics(readClinicsFromFile());
