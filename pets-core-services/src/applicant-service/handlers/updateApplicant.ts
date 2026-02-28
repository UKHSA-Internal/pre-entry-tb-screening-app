import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { GlobalContextStorageProvider } from "pino-lambda";
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
    GlobalContextStorageProvider.updateContext({
      countryOfIssue: parsedBody.countryOfIssue,
      passportNumber: parsedBody.passportNumber.slice(-4),
    });

    // const applicationId = decodeURIComponent(event.pathParameters?.["applicationId"] ?? "").trim();
    const { createdBy } = event.requestContext.authorizer;

    const applicant = await ApplicantDbOps.findByPassportId(
      parsedBody.countryOfIssue,
      parsedBody.passportNumber,
    );
    if (!applicant) {
      logger.error("Applicant does not exist");
      return createHttpResponse(404, {
        message: `Applicant does not exist`,
      });
    }
    // const application = await Application.getByApplicationId (applicationId);
    // if (!application) {
    //   logger.error("Application does not exist");
    //   return createHttpResponse(400, {
    //     message: `Application with ID: ${applicationId} does not exist`,
    //   });
    // }
    // const SUPPORT_CLINIC_ID = process.env.SUPPORT_CLINIC_ID;
    // if (!clinicId) {
    //   logger.error("Clinic Id missing");
    //   return createHttpResponse(400, { message: "Clinic Id missing" });
    // }

    // if (clinicId !== SUPPORT_CLINIC_ID && application.clinicId !== clinicId) {
    //   logger.error("ClinicId mismatch with existing application");
    //   return createHttpResponse(403, { message: "Clinic Id mismatch" });
    // }

    // if (clinicId === SUPPORT_CLINIC_ID && application.clinicId !== clinicId) {
    //   logger.info("Validated clinic Id is a support clinicId");
    // }
    const applicantData = await ApplicantDbOps.updateApplicant({
      ...parsedBody,
      updatedBy: createdBy,
    });

    return createHttpResponse(200, applicantData.toJson());
  } catch (err: unknown) {
    if (err instanceof ConditionalCheckFailedException) {
      logger.error("Applicant doesn't exist");
      return createHttpResponse(404, {
        message: "Applicant doesn't exist",
        error: "ConditionalCheckFailedException",
      });
    }
    logger.error(err, "Error updating Applicant details");
    return createHttpResponse(500, { message: "Something went wrong" });
  }
};
