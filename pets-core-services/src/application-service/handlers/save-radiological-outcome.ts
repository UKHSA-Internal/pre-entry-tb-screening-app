import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { z } from "zod";

import { HttpErrors, HttpResponses } from "../../shared/httpResponses";
import { logger } from "../../shared/logger";
import { Application } from "../../shared/models/application";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { ApplicationStatus, ApplicationStatusGroup } from "../../shared/types/enum";
import { RadiologicalOutcome } from "../models/radiological-outcome";
import { RadiologicalOutcomeRequestSchema } from "../types/zod-schema";

export type RadiologicalOutcomeRequestSchema = z.infer<typeof RadiologicalOutcomeRequestSchema>;

export type SaveRadiologicalOutcomeEvent = PetsAPIGatewayProxyEvent & {
  parsedBody?: RadiologicalOutcomeRequestSchema;
};

export const saveRadiologicalOutcomeHandler = async (event: SaveRadiologicalOutcomeEvent) => {
  try {
    const applicationId = decodeURIComponent(event.pathParameters?.["applicationId"] ?? "").trim();

    logger.info({ applicationId }, "Save Radiological Outcome handler triggered");

    const { parsedBody } = event;
    const { createdBy } = event.requestContext.authorizer;

    if (!parsedBody) {
      logger.error("Event missing parsed body");

      return HttpErrors.badRequest("Request event missing body");
    }

    let radiologicalOutcome: RadiologicalOutcome;
    try {
      radiologicalOutcome = await RadiologicalOutcome.createRadiologicalOutcome({
        ...parsedBody,
        createdBy,
        applicationId,
      });
    } catch (error) {
      if (error instanceof ConditionalCheckFailedException)
        return HttpErrors.conflictError("Radiological Outcome already saved");
      throw error;
    }
    // Update details in APPLICATION#ROOT record as well

    await Application.updateApplication({
      applicationId: applicationId,
      updatedBy: createdBy,
      applicationStatus: ApplicationStatus.sputumDecisionInProgress,
      applicationStatusGroup: ApplicationStatusGroup.incomplete,
    });

    return HttpResponses.ok({
      ...radiologicalOutcome.toJson(),
    });
  } catch (err) {
    logger.error(err, "Error saving Radiological Outcome");
    return HttpErrors.serverError("Something went wrong");
  }
};
