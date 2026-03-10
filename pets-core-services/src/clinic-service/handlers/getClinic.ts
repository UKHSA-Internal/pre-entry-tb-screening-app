import { HttpErrors, HttpResponses } from "../../shared/httpResponses";
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
      if (!clinic) {
        logger.error(`Clinic with ID: ${clinicId} not found`);
        return HttpErrors.notFound("Clinic Details Not Found");
      }

      return HttpResponses.ok(JSON.stringify({ clinic }));
    } catch (error) {
      logger.error({ error }, `Fetching clinic with ID: ${clinicId} failed`);

      return HttpErrors.serverError("Something went wrong");
    }
  }

  logger.error(`The 'clinicId' is missing or incorrect`);

  return HttpErrors.badRequest("The 'clinicId' is missing or incorrect");
};
