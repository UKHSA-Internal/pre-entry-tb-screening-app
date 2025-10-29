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

    const { createdBy } = event.requestContext.authorizer;
    const travelInformation: TravelInformationUpdate =
      await TravelInformationDbOps.updateTravelInformation({
        ...parsedBody,
        updatedBy: createdBy,
        applicationId,
      });

    return createHttpResponse(200, {
      ...travelInformation.toJson(),
    });
  } catch (err) {
    logger.error(err, "Error updating travel information");
    return createHttpResponse(500, { message: "Something went wrong" });
  }
};
