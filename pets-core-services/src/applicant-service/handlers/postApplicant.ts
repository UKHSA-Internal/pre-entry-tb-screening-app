import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";
import { GlobalContextStorageProvider } from "pino-lambda";
import { z } from "zod";

import { createHttpResponse } from "../../shared/http";
import { logger } from "../../shared/logger";
import { Applicant } from "../models/applicant";
import { ApplicantSchema } from "../types/zod-schema";

export type ApplicantRequestSchema = z.infer<typeof ApplicantSchema>;

export type PostApplicantEvent = APIGatewayProxyEvent & {
  parsedBody?: ApplicantRequestSchema;
};

export const postApplicantHandler = async (event: PostApplicantEvent) => {
  try {
    logger.info("Post applicant details handler triggered");

    const { parsedBody } = event;

    if (!parsedBody) {
      logger.error("Event missing parsed body");

      return createHttpResponse(500, {
        message: "Internal Server Error: Request not parsed correctly",
      });
    }

    GlobalContextStorageProvider.updateContext({
      countryOfIssue: parsedBody.countryOfIssue,
      passportNumber: parsedBody.passportNumber.slice(-4),
    });

    let applicant: Applicant;

    try {
      applicant = await Applicant.createNewApplicant({ ...parsedBody, clinicId: "Apollo Clinic" });
    } catch (error) {
      if (error instanceof ConditionalCheckFailedException)
        return createHttpResponse(400, { message: "Applicant Details already saved" });
      throw error;
    }

    return createHttpResponse(200, {
      ...applicant.toJson(),
    });
  } catch (err: unknown) {
    logger.error(err, "Error saving Applicant details");
    return createHttpResponse(500, { message: "Something went wrong" });
  }
};
