import { HttpErrors, HttpResponses } from "../../shared/httpResponses";
import { logger } from "../../shared/logger";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { Clinic } from "../models/clinics";

export const fetchClinicsHandler = async (event: PetsAPIGatewayProxyEvent) => {
  logger.info(`API End point: ${event.path}`);

  try {
    logger.info("All Clinics details handler triggered");
    const country = event?.queryStringParameters?.country;

    const clinics: Clinic[] = await Clinic.getAllClinics(country);

    if (!clinics || clinics?.length < 1) return HttpErrors.notFound("No clinics exist");

    return HttpResponses.ok(clinics.map((clinic: Clinic) => clinic.toJson()));
  } catch (error) {
    logger.error(error, "Fetching Clinics Failed");

    return HttpErrors.serverError("Something went wrong");
  }
};
