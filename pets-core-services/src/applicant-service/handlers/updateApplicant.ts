import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { z } from "zod";

import { createHttpResponse } from "../../shared/http";
import { logger } from "../../shared/logger";
import { ApplicantDbOps } from "../../shared/models/applicant";
import { Application } from "../../shared/models/application";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { ApplicantUpdateRequestSchema } from "../types/zod-schema";

export type ApplicantRequestSchema = z.infer<typeof ApplicantUpdateRequestSchema>;

export type PutApplicantEvent = PetsAPIGatewayProxyEvent & {
  parsedBody?: ApplicantRequestSchema;
};

export const updateApplicantHandler = async (event: PutApplicantEvent) => {
  try {
    logger.info("Put applicant details handler triggered");

    const { parsedBody } = event;

    if (!parsedBody) {
      logger.error("Event missing parsed body");

      return createHttpResponse(500, {
        message: "Internal Server Error: Request not parsed correctly",
      });
    }

    const applicationId = decodeURIComponent(event.pathParameters?.["applicationId"] ?? "").trim();
    const { createdBy } = event.requestContext.authorizer;

    const application = await Application.getByApplicationId(applicationId);
    if (!application) {
      logger.error("Application does not exist");
      return createHttpResponse(400, {
        message: `Application with ID: ${applicationId} does not exist`,
      });
    }

    const applicantData = await ApplicantDbOps.updateApplicant({
      ...parsedBody,
      applicationId: applicationId,
      updatedBy: createdBy,
    });

    return createHttpResponse(200, applicantData);
  } catch (err: unknown) {
    if (err instanceof ConditionalCheckFailedException) {
      logger.error("Applicant db record not found");
      return createHttpResponse(404, {
        message: "Applicant doesn't exist",
        error: "ConditionalCheckFailedException",
      });
    }
    logger.error(err, "Error updating Applicant details");
    return createHttpResponse(500, { message: "Something went wrong" });
  }
};
