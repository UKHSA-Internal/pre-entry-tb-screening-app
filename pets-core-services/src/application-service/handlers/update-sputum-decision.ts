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
    const { createdBy, superuser } = event.requestContext.authorizer;

    if (!parsedBody) {
      logger.error("Event missing parsed body");

      return HttpErrors.badRequest("Request event missing body");
    }
    let validatedBody;
    const validated = SputumDecisionRequestSchema.safeParse(parsedBody);

    if (superuser === "true") {
      if (!validated.success) {
        logger.error({ error: validated.error.flatten() }, "Validation failed");
        return HttpErrors.validationError("Update Sputum Decision Request validation failed");
      }
      validatedBody = validated.data;
    } else {
      logger.error("Sputum Decision Request Update is not allowed");
      return HttpErrors.unauthorized("Unauthorized");
    }

    const sputumDecision: SputumDecisionUpdate = await SputumDecisionDbOps.updateSputumDecision({
      ...validatedBody,
      updatedBy: createdBy,
      applicationId,
    });

    return HttpResponses.ok({
      ...sputumDecision.toJson(),
    });
  } catch (err) {
    logger.error(err, "Error updating Sputum Decision");
    return HttpErrors.serverError("Something went wrong");
  }
};
