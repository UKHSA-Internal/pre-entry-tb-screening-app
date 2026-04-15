import { HttpErrors, HttpResponses } from "../../shared/httpResponses";
import { logger } from "../../shared/logger";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { Clinic } from "../models/clinics";

export const isActiveClinicHandler = async (event: PetsAPIGatewayProxyEvent) => {
  logger.info(`API End point: ${event.path}`);

  const clinicId = event?.queryStringParameters?.clinicId;

  if (clinicId) {
    logger.info(`clinicId: ${clinicId}`);
    try {
      logger.info(`clinicId from queryStringParameters: ${clinicId}`);
      const isActive: boolean = await Clinic.isActiveClinic(clinicId);

      return HttpResponses.ok(JSON.stringify({ isActive: isActive }));
    } catch (error) {
      logger.error({ error }, `Checking clinic with ID: ${clinicId} failed`);

      return HttpErrors.serverError("Something went wrong");
    }
  }

  logger.error(`The 'clinicId' is missing or incorrect`);

  return HttpErrors.badRequest("The 'clinicId' is missing or incorrect");
};
