import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { z } from "zod";

import { HttpErrors, HttpResponses } from "../../shared/httpResponses";
import { logger } from "../../shared/logger";
import { Application } from "../../shared/models/application";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { ApplicationStatus } from "../../shared/types/enum";
import {
  TbCertificateDbOps,
  TbCertificateIssued,
  TbCertificateNotIssued,
} from "../models/tb-certificate";
import { YesOrNo } from "../types/enums";
import { TbCertificateRequestSchema } from "../types/zod-schema";

export type TbCertificateRequestSchema = z.infer<typeof TbCertificateRequestSchema>;
export type SaveTbCertificateEvent = PetsAPIGatewayProxyEvent & {
  parsedBody?: TbCertificateRequestSchema;
};

export const saveTbCertificateHandler = async (event: SaveTbCertificateEvent) => {
  try {
    const applicationId = decodeURIComponent(event.pathParameters?.["applicationId"] ?? "").trim();

    logger.info({ applicationId }, "Save TB Certificate handler triggered");

    const { parsedBody } = event;

    if (!parsedBody) {
      logger.error("Event missing parsed body");

      return HttpErrors.badRequest("Request event missing body");
    }

    const { createdBy } = event.requestContext.authorizer;
    let tbCertificate: TbCertificateIssued | TbCertificateNotIssued;
    try {
      tbCertificate = await TbCertificateDbOps.createTbCertificate({
        ...parsedBody,
        createdBy,
        applicationId,
      });
    } catch (error) {
      if (error instanceof ConditionalCheckFailedException)
        return HttpErrors.conflictError("TB Certificate already saved");
      throw error;
    }

    // Update details in APPLICATION#ROOT record as well
    const applicationStatus =
      tbCertificate.isIssued === YesOrNo.Yes
        ? ApplicationStatus.certificateAvailable
        : ApplicationStatus.certificateNotIssued;

    const expiryDate =
      tbCertificate.isIssued === YesOrNo.Yes ? tbCertificate.expiryDate : undefined;

    await Application.updateApplication({
      applicationId: applicationId,
      updatedBy: createdBy,
      applicationStatus: applicationStatus,
      expiryDate: expiryDate,
    });

    return HttpResponses.ok({
      ...tbCertificate.toJson(),
    });
  } catch (err) {
    logger.error(err, "Error saving TB Certificate information");
    return HttpErrors.serverError("Something went wrong");
  }
};
