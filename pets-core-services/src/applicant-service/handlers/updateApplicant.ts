import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { GlobalContextStorageProvider } from "pino-lambda";
import { z } from "zod";

import { HttpErrors, HttpResponses } from "../../shared/httpResponses";
import { logger } from "../../shared/logger";
import { ApplicantDbOps } from "../../shared/models/applicant";
import { Application } from "../../shared/models/application";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { ApplicationStatusGroup } from "../../shared/types/enum";
import {
  ApplicantUpdateRequestSchema,
  MultiAppUpdateApplicantRequestSchema,
  SuperUserApplicantUpdateRequestSchema,
} from "../types/zod-schema";

export type ApplicantRequestSchema = z.infer<typeof ApplicantUpdateRequestSchema>;
export type SuperUserApplicantUpdateRequestSchema = z.infer<
  typeof SuperUserApplicantUpdateRequestSchema
>;
export type MultiAppUpdateApplicantRequestSchema = z.infer<
  typeof MultiAppUpdateApplicantRequestSchema
>;

export type PutApplicantEvent = PetsAPIGatewayProxyEvent & {
  parsedBody?: ApplicantRequestSchema;
};
export const updateApplicantHandler = async (event: PetsAPIGatewayProxyEvent) => {
  try {
    logger.info("Put applicant details handler triggered");

    const { parsedBody } = event as PutApplicantEvent;

    if (!parsedBody) {
      logger.error("Event missing parsed body");

      return HttpErrors.badRequest("Request event missing body");
    }
    GlobalContextStorageProvider.updateContext({
      countryOfIssue: parsedBody.countryOfIssue,
      passportNumber: parsedBody.passportNumber.slice(-4),
    });

    const { createdBy, superuser } = event.requestContext.authorizer;

    const applicant = await ApplicantDbOps.findByPassportId(
      parsedBody.countryOfIssue,
      parsedBody.passportNumber,
    );
    if (!applicant) {
      logger.error("Applicant does not exist");
      return HttpErrors.notFound("Applicant does not exist");
    }

    // Fetch the applications created for the applicant

    const applications = await Application.getByApplicantId(
      parsedBody.passportNumber,
      parsedBody.countryOfIssue,
    );
    if (!applications.length && applicant) {
      logger.error("Applicant has been created without an application");
      return HttpErrors.validationError("Applicant has been created without an application");
    }

    const [firstApplication] = applications;

    const isFirstInProgressApplication =
      applications.length === 1 &&
      firstApplication?.applicationStatusGroup === ApplicationStatusGroup.incomplete;

    let schema;

    if (superuser === "true") {
      schema = SuperUserApplicantUpdateRequestSchema;
    } else if (isFirstInProgressApplication) {
      schema = ApplicantUpdateRequestSchema;
    } else {
      schema = MultiAppUpdateApplicantRequestSchema;
    }
    //Validate the request
    //If superuser allow all fields to be updated
    //if First In Progress application allow all fields to be updated
    //If multi app, then allow only certain fields to be updated
    const validated = schema.safeParse(parsedBody);

    if (!validated.success) {
      logger.error(
        { error: validated.error.flatten() },
        "Update Applicant Request validation failed",
      );
      return HttpErrors.validationError("Validation Failed");
    }

    const validatedBody = validated.data;
    const applicantData = await ApplicantDbOps.updateApplicant({
      ...validatedBody,
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
