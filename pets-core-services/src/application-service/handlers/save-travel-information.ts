import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { z } from "zod";

import { HttpErrors, HttpResponses } from "../../shared/httpResponses";
import { logger } from "../../shared/logger";
import { Application } from "../../shared/models/application";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { ApplicationStatus, ApplicationStatusGroup } from "../../shared/types/enum";
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
    const { createdBy } = event.requestContext.authorizer;

    try {
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
    // Update details in APPLICATION#ROOT record as well

    await Application.updateApplication({
      applicationId: applicationId,
      updatedBy: createdBy,
      applicationStatus: ApplicationStatus.medicalScreeningInProgress,
      applicationStatusGroup: ApplicationStatusGroup.incomplete,
    });

    return HttpResponses.ok({
      ...travelInformation.toJson(),
    });
  } catch (err) {
    logger.error(err, "Error saving travel information");
    return HttpErrors.serverError("Something went wrong");
  }
};
