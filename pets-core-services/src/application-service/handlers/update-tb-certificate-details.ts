import { z } from "zod";

import { HttpErrors, HttpResponses } from "../../shared/httpResponses";
import { logger } from "../../shared/logger";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { TbCertificateDbOps, TbCertificateDetailsUpdate } from "../models/tb-certificate";
import { TbCertificateUpdateRequestSchema } from "../types/zod-schema";

export type TbCertificateRequestSchema = z.infer<typeof TbCertificateUpdateRequestSchema>;

export type UpdateTbCertificateEvent = PetsAPIGatewayProxyEvent & {
  parsedBody?: TbCertificateRequestSchema;
};

export const updateTbCertificateHandler = async (event: UpdateTbCertificateEvent) => {
  try {
    const applicationId = decodeURIComponent(event.pathParameters?.["applicationId"] ?? "").trim();

    logger.info({ applicationId }, "Update Travel Information handler triggered");

    const { parsedBody } = event;

    if (!parsedBody) {
      logger.error("Event missing parsed body");

      return HttpErrors.badRequest("Request event missing body");
    }

    const { createdBy } = event.requestContext.authorizer;
    const tbCertificate: TbCertificateDetailsUpdate = await TbCertificateDbOps.updateTbCertificate({
      ...parsedBody,
      updatedBy: createdBy,
      applicationId,
    });

    return HttpResponses.ok({
      ...tbCertificate.toJson(),
    });
  } catch (err) {
    logger.error(err, "Error updating travel information");
    return HttpErrors.serverError("Something went wrong");
  }
};
