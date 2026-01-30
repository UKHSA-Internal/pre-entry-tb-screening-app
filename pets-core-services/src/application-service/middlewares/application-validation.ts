import { APIGatewayProxyResult } from "aws-lambda";

import { createHttpResponse } from "../../shared/http";
import { logger } from "../../shared/logger";
import { Application } from "../../shared/models/application";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";

export const validateApplication = async (request: {
  event: PetsAPIGatewayProxyEvent;
}): Promise<APIGatewayProxyResult | void> => {
  try {
    const event = request.event;
    const applicationId = decodeURIComponent(event.pathParameters?.["applicationId"] ?? "").trim();

    const application = await Application.getByApplicationId(applicationId);
    if (!application) {
      logger.error("Application does not exist");
      return createHttpResponse(400, {
        message: `Application with ID: ${applicationId} does not exist`,
      });
    }

    const SUPPORT_CLINIC_ID = process.env.SUPPORT_CLINIC_ID;
    const { clinicId } = event.requestContext.authorizer;
    if (clinicId !== SUPPORT_CLINIC_ID && application.clinicId != clinicId) {
      logger.error("ClinicId mismatch with existing application");
      return createHttpResponse(403, { message: "Clinic Id mismatch" });
    }
  } catch (error) {
    logger.error(error, "Validation Application Failed");
    return createHttpResponse(500, {
      message: "Something went wrong",
    });
  }
};
