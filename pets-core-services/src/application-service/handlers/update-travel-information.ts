import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { z } from "zod";

import { createHttpResponse } from "../../shared/http";
import { logger } from "../../shared/logger";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { TravelInformationDbOps, TravelInformationUpdate } from "../models/travel-information";
import { TravelInformationPutRequestSchema } from "../types/zod-schema";

export type TravelInformationRequestSchema = z.infer<typeof TravelInformationPutRequestSchema>;

export type UpdateTravelInformationEvent = PetsAPIGatewayProxyEvent & {
  parsedBody?: TravelInformationRequestSchema;
};

export const updateTravelInformationHandler = async (event: UpdateTravelInformationEvent) => {
  try {
    const applicationId = decodeURIComponent(event.pathParameters?.["applicationId"] ?? "").trim();

    logger.info({ applicationId }, "Update Travel Information handler triggered");

    const { parsedBody } = event;

    if (!parsedBody) {
      logger.error("Event missing parsed body");

      return createHttpResponse(500, {
        message: "Internal Server Error: Travel Information Request not parsed correctly",
      });
    }

    let travelInformation: TravelInformationUpdate;
    try {
      const { createdBy } = event.requestContext.authorizer;
      travelInformation = await TravelInformationDbOps.updateTravelInformation({
        ...parsedBody,
        updatedBy: createdBy,
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
