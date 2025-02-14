import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";
import { GlobalContextStorageProvider } from "pino-lambda";
import { z } from "zod";

import { createHttpResponse } from "../../shared/http";
import { logger } from "../../shared/logger";
import { Application } from "../../shared/models/application";
import { TravelInformation } from "../models/travel-information";
import { TravelInformationRequestSchema } from "../types/zod-schema";

export type TravelInformationRequestSchema = z.infer<typeof TravelInformationRequestSchema>;
export type SaveTravelInformationEvent = APIGatewayProxyEvent & {
  parsedBody?: TravelInformationRequestSchema;
};

export const saveTravelInformationHandler = async (event: SaveTravelInformationEvent) => {
  try {
    const applicationId = decodeURIComponent(event.pathParameters?.["applicationId"] || "").trim();

    logger.info({ applicationId }, "Save Travel Information handler triggered");

    const { parsedBody } = event;

    if (!parsedBody) {
      logger.error("Event missing parsed body");

      return createHttpResponse(500, {
        message: "Internal Server Error: Request not parsed correctly",
      });
    }

    GlobalContextStorageProvider.updateContext({
      applicationId,
    });

    const application = await Application.getByApplicationId(applicationId);
    if (!application) {
      logger.error("Application does not exist");
      return createHttpResponse(400, { message: "Application does not exist" });
    }

    const clinicId = "Apollo Clinic";
    if (application.clinicId != clinicId) {
      logger.error("ClinicId mismatch with existing application");
      return createHttpResponse(403, { message: "Clinic Id mismatch" });
    }

    let travelInformation: TravelInformation;
    try {
      const createdBy = "hardcoded@user.com";
      travelInformation = await TravelInformation.createTravelInformation({
        ...parsedBody,
        createdBy,
        applicationId,
      });
    } catch (error) {
      if (error instanceof ConditionalCheckFailedException)
        return createHttpResponse(400, { message: "Travel Details already saved" });
      throw error;
    }

    return createHttpResponse(200, {
      ...travelInformation.toJson(),
    });
  } catch (err) {
    logger.error(err, "Error saving travel information");
    return createHttpResponse(500, { message: "Something went wrong" });
  }
};
