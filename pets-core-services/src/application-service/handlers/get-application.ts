import { APIGatewayProxyEvent } from "aws-lambda";
import { GlobalContextStorageProvider } from "pino-lambda";

import { createHttpResponse } from "../../shared/http";
import { logger } from "../../shared/logger";
import { Application } from "../../shared/models/application";
import { TravelInformation } from "../models/travel-information";

export const getApplicationHandler = async (event: APIGatewayProxyEvent) => {
  try {
    const applicationId = decodeURIComponent(event.pathParameters?.["applicationId"] || "").trim();

    GlobalContextStorageProvider.updateContext({
      applicationId,
    });

    logger.info({ applicationId }, "Retrieve Application handler triggered");

    const application = await Application.getByApplicationId(applicationId);
    if (!application) return createHttpResponse(404, { message: "Application does not exist" });
    const travelInformation = await TravelInformation.getByApplicationId(applicationId);

    return createHttpResponse(200, {
      applicationId,
      travelInformation: travelInformation?.toJson(),
    });
  } catch (error) {
    logger.error(error, "Error retrieving application details");
    return createHttpResponse(500, { message: "Something went wrong" });
  }
};
