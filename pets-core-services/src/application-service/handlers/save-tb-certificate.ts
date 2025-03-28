import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { z } from "zod";

import { createHttpResponse } from "../../shared/http";
import { logger } from "../../shared/logger";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import {
  TbCertificateDbOps,
  TbCertificateIssued,
  TbCertificateNotIssued,
} from "../models/tb-certificate";
import { TbCertificateRequestSchema } from "../types/zod-schema";

export type TbCertificateRequestSchema = z.infer<typeof TbCertificateRequestSchema>;
export type SaveTbCertificateEvent = PetsAPIGatewayProxyEvent & {
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
        message: "Internal Server Error: TB Certificate Request not parsed correctly",
      });
    }

    let tbCertificate: TbCertificateIssued | TbCertificateNotIssued;
    try {
      const { createdBy } = event.requestContext.authorizer;
      tbCertificate = await TbCertificateDbOps.createTbCertificate({
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
