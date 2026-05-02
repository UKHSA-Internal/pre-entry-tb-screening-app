import { z } from "zod";

import { HttpErrors, HttpResponses } from "../../shared/httpResponses";
import { logger } from "../../shared/logger";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { SputumDecisionDbOps, SputumDecisionUpdate } from "../models/sputum-decision";
import { SputumDecisionRequestSchema } from "../types/zod-schema";

export type SputumDecisionRequestSchema = z.infer<typeof SputumDecisionRequestSchema>;

export type UpdateSputumDecisionEvent = PetsAPIGatewayProxyEvent & {
  parsedBody?: SputumDecisionRequestSchema;
};

export const updateSputumDecisionHandler = async (event: UpdateSputumDecisionEvent) => {
  try {
    const applicationId = decodeURIComponent(event.pathParameters?.["applicationId"] ?? "").trim();

    logger.info({ applicationId }, "Update Travel Information handler triggered");

    const { parsedBody } = event;

    if (!parsedBody) {
      logger.error("Event missing parsed body");

      return HttpErrors.badRequest("Request event missing body");
    }

    const { createdBy } = event.requestContext.authorizer;
    const sputumDecision: SputumDecisionUpdate = await SputumDecisionDbOps.updateSputumDecision({
      ...parsedBody,
      updatedBy: createdBy,
      applicationId,
    });

    return HttpResponses.ok({
      ...sputumDecision.toJson(),
    });
  } catch (err) {
    logger.error(err, "Error updating travel information");
    return HttpErrors.serverError("Something went wrong");
  }
};
