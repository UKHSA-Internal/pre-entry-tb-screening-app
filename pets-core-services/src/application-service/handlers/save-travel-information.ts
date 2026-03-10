import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { z } from "zod";

import { HttpErrors, HttpResponses } from "../../shared/httpResponses";
import { logger } from "../../shared/logger";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { TravelInformation, TravelInformationDbOps } from "../models/travel-information";
import { TravelInformationPostRequestSchema } from "../types/zod-schema";

export type TravelInformationRequestSchema = z.infer<typeof TravelInformationPostRequestSchema>;

export type SaveTravelInformationEvent = PetsAPIGatewayProxyEvent & {
  parsedBody?: TravelInformationRequestSchema;
};

export const saveTravelInformationHandler = async (event: SaveTravelInformationEvent) => {
  try {
    const applicationId = decodeURIComponent(event.pathParameters?.["applicationId"] ?? "").trim();

    logger.info({ applicationId }, "Save Travel Information handler triggered");

    const { parsedBody } = event;

    if (!parsedBody) {
      logger.error("Event missing parsed body");

      return HttpErrors.badRequest("Request event missing body");
    }

    let travelInformation: TravelInformation;
    try {
      const { createdBy } = event.requestContext.authorizer;
      travelInformation = await TravelInformationDbOps.createTravelInformation({
        ...parsedBody,
        createdBy,
        applicationId,
      });
    } catch (error) {
      if (error instanceof ConditionalCheckFailedException)
        return HttpErrors.conflictError("Travel Details already saved");
      throw error;
    }

    return HttpResponses.ok({
      ...travelInformation.toJson(),
    });
  } catch (err) {
    logger.error(err, "Error saving travel information");
    return HttpErrors.serverError("Something went wrong");
  }
};
