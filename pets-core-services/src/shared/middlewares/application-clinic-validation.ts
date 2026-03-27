import { APIGatewayProxyResult } from "aws-lambda";

import { HttpErrors } from "../httpResponses";
import { logger } from "../logger";
import { Application } from "../models/application";
import { PetsAPIGatewayProxyEvent } from "../types";

export const validateClinicAndApplication = async (request: {
  event: PetsAPIGatewayProxyEvent;
}): Promise<APIGatewayProxyResult | void> => {
  try {
    const event = request.event;
    const applicationId = decodeURIComponent(event.pathParameters?.["applicationId"] ?? "").trim();

    const application = await Application.getByApplicationId(applicationId);
    if (!application) {
      logger.error("Application does not exist");
      return HttpErrors.notFound(`Application with ID: ${applicationId} does not exist`);
    }

    const { clinicId } = event.requestContext.authorizer;
    const SUPPORT_CLINIC_ID = process.env.VITE_SUPPORT_CLINIC_ID;

    if (!clinicId) {
      logger.error("Clinic Id missing");
      return HttpErrors.badRequest("Clinic Id missing");
    }

    if (clinicId !== SUPPORT_CLINIC_ID && application.clinicId !== clinicId) {
      logger.error("Clinic Id mismatch");
      return HttpErrors.forbidden("Clinic Id mismatch");
    }

    if (clinicId === SUPPORT_CLINIC_ID && application.clinicId !== clinicId) {
      logger.info("Validated clinic Id is a support clinicId");
    }
  } catch (error) {
    logger.error(error, "Error in validation");
    return HttpErrors.serverError("Something went wrong");
  }
};
