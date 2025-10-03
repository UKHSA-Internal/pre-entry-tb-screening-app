import { readFileSync } from "fs";
import { resolve } from "path";

import { CountryCode } from "../../shared/country";
import { logger } from "../../shared/logger";
import { NewClinic } from "../models/clinics";

export const validateClinic = (obj: Record<string, string | null>): NewClinic | void => {
  // Checking if all required attributes are present
  const { clinicId, name, country, city, startDate, endDate, createdBy } = obj;
  const requiredFields = { clinicId, name, country, city, startDate, createdBy };

  // All these should have some values
  for (const [key, value] of Object.entries(requiredFields)) {
    if (!value) {
      logger.error(`Clinic object missing required attribute: ${key}`);
      return;
    }
  }

  const parsedStartDate = new Date(startDate!);

  if (isNaN(parsedStartDate.getDate()) || parsedStartDate < new Date("2024-01-01")) {
    logger.error(`Invalid or too early startDate: ${startDate}`);
    return;
  }

  if (endDate && (isNaN(new Date(endDate).getDate()) || new Date(endDate) < parsedStartDate)) {
    logger.error(`Failed to validate endDate: ${endDate}`);

    return;
  }

  const countries = Object(CountryCode) as CountryCode;

  // Checking if country is one of CountryCode keys
  if (Object.keys(countries).indexOf(country as string) < 0) {
    logger.error(`Can't convert to CountyCode: ${country}`);

    return;
  }
  return {
    clinicId: clinicId,
    name: name,
    country: country as CountryCode,
    city: city,
    startDate: startDate ?? new Date(),
    endDate: endDate ?? null,
    createdBy: createdBy,
  } as NewClinic;
};

export const validateClinicsDataString = (data: string | undefined | void): NewClinic[] => {
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
      const newClinic = validateClinic(clinic as Record<string, string>);

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

export const readClinicsFile = (filePathString: string): string | void => {
  try {
    const data = readFileSync(resolve(process.cwd(), filePathString), "utf-8").toString();
    logger.info(`File data (from file): ${data.length}`);

    return data;
  } catch (error) {
    logger.error({ error }, "File reading error");

    return;
  }
};
