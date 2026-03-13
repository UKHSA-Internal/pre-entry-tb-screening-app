import { z } from "zod";

import { HttpErrors, HttpResponses } from "../../shared/httpResponses";
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

      return HttpErrors.badRequest("Request event missing body");
    }

    const { createdBy } = event.requestContext.authorizer;
    const travelInformation: TravelInformationUpdate =
      await TravelInformationDbOps.updateTravelInformation({
        ...parsedBody,
        updatedBy: createdBy,
        applicationId,
      });

    return HttpResponses.ok({
      ...travelInformation.toJson(),
    });
  } catch (err) {
    logger.error(err, "Error updating travel information");
    return HttpErrors.serverError("Something went wrong");
  }
};
