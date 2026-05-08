import { z } from "zod";

import { HttpErrors, HttpResponses } from "../../shared/httpResponses";
import { logger } from "../../shared/logger";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { TbCertificateDbOps, TbCertificateDetailsUpdate } from "../models/tb-certificate";
import { TbCertificateUpdateRequestSchema } from "../types/zod-schema";

export type TbCertificateUpdateRequestSchema = z.infer<typeof TbCertificateUpdateRequestSchema>;

export type UpdateTbCertificateEvent = PetsAPIGatewayProxyEvent & {
  parsedBody?: TbCertificateUpdateRequestSchema;
};

export const updateTbCertificateHandler = async (event: UpdateTbCertificateEvent) => {
  try {
    const applicationId = decodeURIComponent(event.pathParameters?.["applicationId"] ?? "").trim();
    const { createdBy, superuser } = event.requestContext.authorizer;

    logger.info({ applicationId }, "Update Travel Information handler triggered");

    const { parsedBody } = event;

    if (!parsedBody) {
      logger.error("Event missing parsed body");

      return HttpErrors.badRequest("Request event missing body");
    }

    let validatedBody;
    const validated = TbCertificateUpdateRequestSchema.safeParse(parsedBody);

    if (superuser === "true") {
      if (!validated.success) {
        logger.error(
          { error: validated.error.flatten() },
          "Update TB Certificate Details Request validation failed",
        );
        return HttpErrors.validationError("Validation Failed");
      }
      validatedBody = validated.data;
    } else {
      logger.error("TB Certificate Details Update Request is not allowed");
      return HttpErrors.unauthorized("Unauthorized");
    }
    const tbCertificate: TbCertificateDetailsUpdate = await TbCertificateDbOps.updateTbCertificate({
      ...validatedBody,
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
