import { GlobalContextStorageProvider } from "pino-lambda";

import { createHttpResponse } from "../../shared/http";
import { logger } from "../../shared/logger";
import { Application } from "../../shared/models/application";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { MedicalScreening } from "../models/medical-screening";
import { TravelInformation } from "../models/travel-information";

export const getApplicationHandler = async (event: PetsAPIGatewayProxyEvent) => {
  try {
    const applicationId = decodeURIComponent(event.pathParameters?.["applicationId"] || "").trim();

    GlobalContextStorageProvider.updateContext({
      applicationId,
    });

    logger.info({ applicationId }, "Retrieve Application handler triggered");

    const application = await Application.getByApplicationId(applicationId);
    if (!application) return createHttpResponse(404, { message: "Application does not exist" });

    if (application.clinicId != event.requestContext.authorizer.clinicId) {
      logger.error("ClinicId mismatch");
      return createHttpResponse(403, { message: "Clinic Id mismatch" });
    }

    const travelInformation = await TravelInformation.getByApplicationId(applicationId);
    const medicalScreening = await MedicalScreening.getByApplicationId(applicationId);

    return createHttpResponse(200, {
      applicationId,
      travelInformation: travelInformation?.toJson(),
      medicalScreening: medicalScreening?.toJson(),
    });
  } catch (error) {
    logger.error(error, "Error retrieving application details");
    return createHttpResponse(500, { message: "Something went wrong" });
  }
};
