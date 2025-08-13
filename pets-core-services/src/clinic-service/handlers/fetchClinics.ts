import { APIGatewayProxyEvent } from "aws-lambda";

import { createHttpResponse } from "../../shared/http";
import { logger } from "../../shared/logger";
import { Clinic } from "../models/clinics";

export const fetchClinicsHandler = async (event: APIGatewayProxyEvent) => {
  logger.info(`API End point: ${event.path}`);

  try {
    logger.info("All Clinics details handler triggered");
    const country = event?.queryStringParameters?.country;

    const clinics: Clinic[] = await Clinic.getAllClinics(country);

    if (!clinics || clinics?.length < 1)
      return createHttpResponse(404, { message: "No clinics exist" });

    return createHttpResponse(
      200,
      clinics.map((clinic: Clinic) => clinic.toJson()),
    );
  } catch (error) {
    logger.error(error, "Fetching Clinics Failed");

    return createHttpResponse(500, { message: "Something went wrong" });
  }
};
