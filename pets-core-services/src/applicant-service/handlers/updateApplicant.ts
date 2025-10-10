import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { z } from "zod";

import { createHttpResponse } from "../../shared/http";
import { logger } from "../../shared/logger";
import { ApplicantDbOps } from "../../shared/models/applicant";
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

    let applicantData;
    try {
      applicantData = await ApplicantDbOps.updateApplicant({
        ...parsedBody,
        applicationId: applicationId,
        updatedBy: createdBy,
      });
    } catch (error) {
      if (error instanceof ConditionalCheckFailedException)
        return createHttpResponse(400, { message: "Applicant Details already saved" });
      throw error;
    }

    return createHttpResponse(200, applicantData);
  } catch (err: unknown) {
    logger.error(err, "Error saving Applicant details");
    return createHttpResponse(500, { message: "Something went wrong" });
  }
};
