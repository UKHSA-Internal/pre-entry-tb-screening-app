import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { GlobalContextStorageProvider } from "pino-lambda";
import { z } from "zod";

import { createHttpResponse } from "../../shared/http";
import { logger } from "../../shared/logger";
import { Application } from "../../shared/models/application";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { MedicalScreening } from "../models/medical-screening";
import { MedicalScreeningRequestSchema } from "../types/zod-schema";

export type MedicalScreeningRequestSchema = z.infer<typeof MedicalScreeningRequestSchema>;

export type SaveMedicalScreeningEvent = PetsAPIGatewayProxyEvent & {
  parsedBody?: MedicalScreeningRequestSchema;
};

export const saveMedicalScreeningHandler = async (event: SaveMedicalScreeningEvent) => {
  try {
    const applicationId = decodeURIComponent(event.pathParameters?.["applicationId"] || "").trim();

    logger.info({ applicationId }, "Save Medical Screening handler triggered");

    const { parsedBody } = event;

    if (!parsedBody) {
      logger.error("Event missing parsed body");

      return createHttpResponse(500, {
        message: "Internal Server Error: Request not parsed correctly",
      });
    }

    GlobalContextStorageProvider.updateContext({
      applicationId,
    });

    const application = await Application.getByApplicationId(applicationId);
    if (!application) {
      logger.error("Application does not exist");
      return createHttpResponse(400, {
        message: `Application with ID: ${applicationId} does not exist`,
      });
    }

    const { clinicId, createdBy } = event.requestContext.authorizer;
    if (application.clinicId != clinicId) {
      logger.error("ClinicId mismatch with existing application");
      return createHttpResponse(403, { message: "Clinic Id mismatch" });
    }

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
