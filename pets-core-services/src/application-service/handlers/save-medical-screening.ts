import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { z } from "zod";

import { HttpErrors, HttpResponses } from "../../shared/httpResponses";
import { logger } from "../../shared/logger";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import {
  MedicalScreeningChestXray,
  MedicalScreeningDbOps,
  MedicalScreeningNoChestXray,
} from "../models/medical-screening";
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

      return HttpErrors.badRequest("Request event missing body");
    }

    const { createdBy } = event.requestContext.authorizer;
    let medicalScreening: MedicalScreeningChestXray | MedicalScreeningNoChestXray;
    try {
      medicalScreening = await MedicalScreeningDbOps.createMedicalScreening({
        ...parsedBody,
        createdBy,
        applicationId,
      });
    } catch (error) {
      if (error instanceof ConditionalCheckFailedException)
        return HttpErrors.conflictError("Medical Screening already saved");
      throw error;
    }

    return HttpResponses.ok({
      ...medicalScreening.toJson(),
    });
  } catch (err) {
    logger.error(err, "Error saving Medical Screening");
    return HttpErrors.serverError("Something went wrong");
  }
};
