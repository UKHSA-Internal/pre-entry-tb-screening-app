import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { z } from "zod";

import { HttpErrors, HttpResponses } from "../../shared/httpResponses";
import { logger } from "../../shared/logger";
import { Application } from "../../shared/models/application";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { ApplicationStatus, ApplicationStatusGroup } from "../../shared/types/enum";
import {
  MedicalScreeningChestXray,
  MedicalScreeningDbOps,
  MedicalScreeningNoChestXray,
} from "../models/medical-screening";
import { YesOrNo } from "../types/enums";
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
    // Update details in APPLICATION#ROOT record as well
    const applicationStatus =
      medicalScreening.isXrayRequired === YesOrNo.Yes
        ? ApplicationStatus.chestXrayInProgress
        : ApplicationStatus.sputumDecisionInProgress;
    await Application.updateApplication({
      applicationId: applicationId,
      updatedBy: createdBy,
      applicationStatus: applicationStatus,
      applicationStatusGroup: ApplicationStatusGroup.incomplete,
    });
    return HttpResponses.ok({
      ...medicalScreening.toJson(),
    });
  } catch (err) {
    logger.error(err, "Error saving Medical Screening");
    return HttpErrors.serverError("Something went wrong");
  }
};
