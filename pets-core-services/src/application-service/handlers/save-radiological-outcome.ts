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

    logger.info({ applicationId }, "Save Medical Screening handler triggered");

    const { parsedBody } = event;

    if (!parsedBody) {
      logger.error("Event missing parsed body");

      return createHttpResponse(500, {
        message: "Internal Server Error: Medical Screening Request not parsed correctly",
      });
    }

    let radiologicalOutcome: RadiologicalOutcome;
    try {
      radiologicalOutcome = await RadiologicalOutcome.createRadiologicalOutcome({
        ...parsedBody,
        applicationId,
      });
    } catch (error) {
      if (error instanceof ConditionalCheckFailedException)
        return createHttpResponse(400, { message: "Medical Screening already saved" });
      throw error;
    }

    return createHttpResponse(200, {
      ...radiologicalOutcome.toJson(),
    });
  } catch (err) {
    logger.error(err, "Error saving Medical Screening");
    return createHttpResponse(500, { message: "Something went wrong" });
  }
};
