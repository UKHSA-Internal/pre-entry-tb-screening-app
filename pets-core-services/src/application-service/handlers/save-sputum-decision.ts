import { z } from "zod";

import { createHttpResponse } from "../../shared/http";
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
      return createHttpResponse(500, {
        message: "Internal Server Error: Sputum Decision Request not parsed correctly",
      });
    }

    //  Validate Sputum  Details Request
    const parsed = SputumDecisionRequestSchema.safeParse(parsedBody);
    if (!parsed.success) {
      logger.error({ error: parsed.error.flatten() }, "Validation failed");
      return createHttpResponse(400, {
        message: "Sputum Decision Request validation failed",
      });
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
        return createHttpResponse(400, { message: "Sputum Decision already saved" });
      throw error;
    }

    return createHttpResponse(200, {
      ...sputumDecision.toJson(),
    });
  } catch (err) {
    logger.error(err, "Error saving Sputum Decision");
    return createHttpResponse(500, { message: "Something went wrong" });
  }
};
