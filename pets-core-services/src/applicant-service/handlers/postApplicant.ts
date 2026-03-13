import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { GlobalContextStorageProvider } from "pino-lambda";
import { z } from "zod";

import { HttpErrors, HttpResponses } from "../../shared/httpResponses";
import { logger } from "../../shared/logger";
import { Applicant, ApplicantDbOps } from "../../shared/models/applicant";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { ApplicantRegisterRequestSchema } from "../types/zod-schema";

export type ApplicantRequestSchema = z.infer<typeof ApplicantRegisterRequestSchema>;

export type PostApplicantEvent = PetsAPIGatewayProxyEvent & {
  parsedBody?: ApplicantRequestSchema;
};

export const postApplicantHandler = async (event: PostApplicantEvent) => {
  try {
    logger.info("Post applicant details handler triggered");

    const { parsedBody } = event;

    if (!parsedBody) {
      logger.error("Event missing parsed body");

      return HttpErrors.badRequest("Request event missing body");
    }

    GlobalContextStorageProvider.updateContext({
      countryOfIssue: parsedBody.countryOfIssue,
      passportNumber: parsedBody.passportNumber.slice(-4),
    });
    const { createdBy } = event.requestContext.authorizer;

    const existingApplicant = await ApplicantDbOps.findByPassportId(
      parsedBody.countryOfIssue,
      parsedBody.passportNumber,
    );

    if (existingApplicant) {
      logger.info("An applicant with similar information already exists");
      return HttpResponses.ok({
        ...existingApplicant.toJson(),
      });
    }

    let applicant: Applicant;
    try {
      applicant = await ApplicantDbOps.createNewApplicant({
        ...parsedBody,
        createdBy,
      });
    } catch (error) {
      if (error instanceof ConditionalCheckFailedException)
        return HttpErrors.conflictError("Applicant Details already saved");
      throw error;
    }

    return HttpResponses.created({
      ...applicant.toJson(),
    });
  } catch (err: unknown) {
    logger.error(err, "Error saving Applicant details");
    return HttpErrors.serverError("Something went wrong");
  }
};
