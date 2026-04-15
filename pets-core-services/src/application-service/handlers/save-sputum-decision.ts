import { z } from "zod";

import { HttpErrors, HttpResponses } from "../../shared/httpResponses";
import { logger } from "../../shared/logger";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { SputumDecision } from "../models/sputum-decision";
import { SputumDecisionRequestSchema } from "../types/zod-schema";

export type SputumDecisionRequestSchema = z.infer<typeof SputumDecisionRequestSchema>;

export type SaveSputumDecisionEvent = PetsAPIGatewayProxyEvent & {
  parsedBody?: SputumDecisionRequestSchema;
};

export const saveSputumDecisionHandler = async (event: SaveSputumDecisionEvent) => {
  try {
    const applicationId = decodeURIComponent(event.pathParameters?.["applicationId"] ?? "").trim();

    logger.info({ applicationId }, "Save Sputum Decision handler triggered");

    const { parsedBody } = event;
    const { createdBy } = event.requestContext.authorizer;

    if (!parsedBody) {
      logger.error("Event missing parsed body");
      return HttpErrors.badRequest("Request event missing body");
    }

    //  Validate Sputum  Details Request
    const parsed = SputumDecisionRequestSchema.safeParse(parsedBody);
    if (!parsed.success) {
      logger.error({ error: parsed.error.flatten() }, "Validation failed");
      return HttpErrors.validationError("Sputum Decision Request validation failed");
    }

    let sputumDecision: SputumDecision;
    try {
      sputumDecision = await SputumDecision.createSputumDecision({
        ...parsed.data,
        createdBy,
        applicationId,
      });
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if ((error as any).name === "ConditionalCheckFailedException")
        return HttpErrors.conflictError("Sputum Decision already saved");
      throw error;
    }

    return HttpResponses.ok({
      ...sputumDecision.toJson(),
    });
  } catch (err) {
    logger.error(err, "Error saving Sputum Decision");
    return HttpErrors.serverError("Something went wrong");
  }
};
