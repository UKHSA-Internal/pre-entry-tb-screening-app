import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { z } from "zod";

import { createHttpResponse } from "../../shared/http";
import { logger } from "../../shared/logger";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
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

      return createHttpResponse(500, {
        message: "Internal Server Error: Radiological Outcome Request not parsed correctly",
      });
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
        return createHttpResponse(400, { message: "Radiological Outcome already saved" });
      throw error;
    }

    return createHttpResponse(200, {
      ...radiologicalOutcome.toJson(),
    });
  } catch (err) {
    logger.error(err, "Error saving Radiological Outcome");
    return createHttpResponse(500, { message: "Something went wrong" });
  }
};
