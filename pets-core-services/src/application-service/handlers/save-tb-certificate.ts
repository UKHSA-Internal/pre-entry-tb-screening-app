import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";
import { GlobalContextStorageProvider } from "pino-lambda";
import { z } from "zod";

import { createHttpResponse } from "../../shared/http";
import { logger } from "../../shared/logger";
import { Application } from "../../shared/models/application";
import { TbCertificate } from "../models/tb-certificate";
import { TbCertificateRequestSchema } from "../types/zod-schema";

export type TbCertificateRequestSchema = z.infer<typeof TbCertificateRequestSchema>;
export type SaveTbCertificateEvent = APIGatewayProxyEvent & {
  parsedBody?: TbCertificateRequestSchema;
};

export const saveTbCertificateHandler = async (event: SaveTbCertificateEvent) => {
  try {
    const applicationId = decodeURIComponent(event.pathParameters?.["applicationId"] || "").trim();

    logger.info({ applicationId }, "Save TB Certificate handler triggered");

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

    const clinicId = "Apollo Clinic";
    if (application.clinicId != clinicId) {
      logger.error("ClinicId mismatch with existing application");
      return createHttpResponse(403, { message: "Clinic Id mismatch" });
    }

    let tbCertificate: TbCertificate;
    try {
      const createdBy = "hardcoded@user.com";
      tbCertificate = await TbCertificate.createTbCertificate({
        ...parsedBody,
        createdBy,
        applicationId,
      });
    } catch (error) {
      if (error instanceof ConditionalCheckFailedException)
        return createHttpResponse(400, { message: "TB Certificate already saved" });
      throw error;
    }

    return createHttpResponse(200, {
      ...tbCertificate.toJson(),
    });
  } catch (err) {
    logger.error(err, "Error saving TB Certificate information");
    return createHttpResponse(500, { message: "Something went wrong" });
  }
};
