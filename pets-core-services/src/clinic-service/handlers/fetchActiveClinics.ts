import { APIGatewayProxyEvent } from "aws-lambda";

import { createHttpResponse } from "../../shared/http";
import { logger } from "../../shared/logger";
import { Clinic } from "../models/clinics";

export const fetchActiveClinicsHandler = async (event: APIGatewayProxyEvent) => {
  logger.info(`API End point: ${event.path}`);

  try {
    logger.info("Active clinics details handler triggered");
    const clinics: Clinic[] = await Clinic.getActiveClinics();

    if (!clinics) return createHttpResponse(404, { message: "No active clinics exist" });

    return createHttpResponse(
      200,
      clinics.map((clinic: Clinic) => clinic.toJson()),
    );
  } catch (error) {
    logger.error(error, "Fetching Active Clinics Failed");

    return createHttpResponse(500, { message: "Something went wrong" });
  }
};
