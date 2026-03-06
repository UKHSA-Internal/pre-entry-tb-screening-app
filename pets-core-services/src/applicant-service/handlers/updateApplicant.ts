import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { GlobalContextStorageProvider } from "pino-lambda";
import { z } from "zod";

import { HttpErrors, HttpResponses } from "../../shared/httpResponses";
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

      return HttpErrors.badRequest("Request event missing body");
    }
    GlobalContextStorageProvider.updateContext({
      countryOfIssue: parsedBody.countryOfIssue,
      passportNumber: parsedBody.passportNumber.slice(-4),
    });

    const { createdBy } = event.requestContext.authorizer;

    const applicant = await ApplicantDbOps.findByPassportId(
      parsedBody.countryOfIssue,
      parsedBody.passportNumber,
    );
    if (!applicant) {
      logger.error("Applicant does not exist");
      return HttpErrors.notFound("Applicant does not exist");
    }

    const applicantData = await ApplicantDbOps.updateApplicant({
      ...parsedBody,
      updatedBy: createdBy,
    });

    return HttpResponses.ok(applicantData.toJson());
  } catch (err: unknown) {
    if (err instanceof ConditionalCheckFailedException) {
      logger.error("Applicant doesn't exist");
      return HttpErrors.notFound("Applicant does not exist");
    }
    logger.error(err, "Error updating Applicant details");
    return HttpErrors.serverError("Something went wrong");
  }
};
