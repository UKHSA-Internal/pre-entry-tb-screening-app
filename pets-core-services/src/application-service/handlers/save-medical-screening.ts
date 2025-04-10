import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { z } from "zod";

import { createHttpResponse } from "../../shared/http";
import { logger } from "../../shared/logger";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { MedicalScreening } from "../models/medical-screening";
import { MedicalScreeningRequestSchema } from "../types/zod-schema";

export type MedicalScreeningRequestSchema = z.infer<typeof MedicalScreeningRequestSchema>;

export type SaveMedicalScreeningEvent = PetsAPIGatewayProxyEvent & {
  parsedBody?: MedicalScreeningRequestSchema;
};

export const saveMedicalScreeningHandler = async (event: SaveMedicalScreeningEvent) => {
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

    const { createdBy } = event.requestContext.authorizer;
    let medicalScreening: MedicalScreening;
    try {
      medicalScreening = await MedicalScreening.createMedicalScreening({
        ...parsedBody,
        createdBy,
        applicationId,
      });
    } catch (error) {
      if (error instanceof ConditionalCheckFailedException)
        return createHttpResponse(400, { message: "Medical Screening already saved" });
      throw error;
    }

    return createHttpResponse(200, {
      ...medicalScreening.toJson(),
    });
  } catch (err) {
    logger.error(err, "Error saving Medical Screening");
    return createHttpResponse(500, { message: "Something went wrong" });
  }
};
