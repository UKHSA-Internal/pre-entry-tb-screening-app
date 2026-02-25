import { APIGatewayProxyResult } from "aws-lambda";

import { createHttpResponse } from "../http";
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
      return createHttpResponse(404, {
        message: `Application with ID: ${applicationId} does not exist`,
      });
    }

    const { clinicId } = event.requestContext.authorizer;
    const SUPPORT_CLINIC_ID = process.env.SUPPORT_CLINIC_ID;

    if (!clinicId) {
      logger.error("Clinic Id missing");
      return createHttpResponse(400, { message: "Clinic Id missing" });
    }

    if (clinicId !== SUPPORT_CLINIC_ID && application.clinicId !== clinicId) {
      logger.error("Clinic Id mismatch");
      return createHttpResponse(403, { message: "Clinic Id mismatch" });
    }

    if (clinicId === SUPPORT_CLINIC_ID && application.clinicId !== clinicId) {
      logger.info("Validated clinic Id is a support clinicId");
    }
  } catch (error) {
    logger.error(error, "Error in validation");
    return createHttpResponse(500, {
      message: "Something went wrong",
    });
  }
};
