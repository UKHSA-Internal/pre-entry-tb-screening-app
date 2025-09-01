import { createHttpResponse } from "../../shared/http";
import { logger } from "../../shared/logger";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { Clinic } from "../models/clinics";

export const getClinicHandler = async (event: PetsAPIGatewayProxyEvent) => {
  logger.info(`API End point: ${event.path}`);

  const clinicId = decodeURIComponent(event.pathParameters?.["clinicId"] ?? "").trim();

  if (clinicId) {
    logger.info(`clinicId: ${clinicId}`);
    try {
      logger.info(`clinicId from queryStringParameters: ${clinicId}`);
      const clinic = await Clinic.getClinicById(clinicId);
      if (!clinic) return createHttpResponse(404, { message: "Clinic Details Not Found" });

      return createHttpResponse(200, JSON.stringify({ clinic }));
    } catch (error) {
      logger.error(`Fetching clinic with ID: ${clinicId} failed`, error);

      return createHttpResponse(500, { message: "Something went wrong" });
    }
  }

  logger.error(`The 'clinicId' is missing or incorrect`);

  return createHttpResponse(400, { message: "The 'clinicId' is missing or incorrect" });
};
