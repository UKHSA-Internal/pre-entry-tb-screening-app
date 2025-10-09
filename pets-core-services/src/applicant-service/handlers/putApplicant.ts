import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { GlobalContextStorageProvider } from "pino-lambda";
import { z } from "zod";

import { createHttpResponse } from "../../shared/http";
import { logger } from "../../shared/logger";
import { Applicant } from "../../shared/models/applicant";
import { Application } from "../../shared/models/application";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { ApplicantUpdateSchema } from "../types/zod-schema";

export type ApplicantRequestSchema = z.infer<typeof ApplicantUpdateSchema>;

export type PutApplicantEvent = PetsAPIGatewayProxyEvent & {
  parsedBody?: ApplicantRequestSchema;
};

export const putApplicantHandler = async (event: PutApplicantEvent) => {
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

    GlobalContextStorageProvider.updateContext({
      countryOfIssue: parsedBody.countryOfIssue,
      passportNumber: parsedBody.passportNumber.slice(-4),
      applicationId,
    });

    const application = await Application.getByApplicationId(applicationId);
    if (!application) {
      logger.error("Application does not exist");
      return createHttpResponse(400, {
        message: `Application with ID: ${applicationId} does not exist`,
      });
    }

    const { clinicId, createdBy } = event.requestContext.authorizer;
    if (application.clinicId != clinicId) {
      logger.error("ClinicId mismatch with existing application");
      return createHttpResponse(403, { message: "Clinic Id mismatch" });
    }

    const existingApplicants = await Applicant.findByPassportId(
      parsedBody.countryOfIssue,
      parsedBody.passportNumber,
    );

    if (existingApplicants.length) {
      logger.info("The applicant exists, the data will be updated");
    } else {
      logger.info("The applicant does not exist, it has to be created first");
      return createHttpResponse(404, {
        error: "The applicant does not exist, it has to be created first",
      });
    }

    let applicantData;
    try {
      applicantData = await Applicant.updateApplicant({
        ...parsedBody,
        applicationId: applicationId,
        updatedBy: createdBy,
      });
    } catch (error) {
      if (error instanceof ConditionalCheckFailedException)
        return createHttpResponse(400, { message: "Applicant Details already saved" });
      throw error;
    }

    return createHttpResponse(200, {
      // ...applicant.toJson(),
      ...applicantData,
    });
  } catch (err: unknown) {
    logger.error(err, "Error saving Applicant details");
    return createHttpResponse(500, { message: "Something went wrong" });
  }
};
