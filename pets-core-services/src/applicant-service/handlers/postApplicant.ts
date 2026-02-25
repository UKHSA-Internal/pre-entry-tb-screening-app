import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { GlobalContextStorageProvider } from "pino-lambda";
import { z } from "zod";

import { createHttpResponse } from "../../shared/http";
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

      return createHttpResponse(500, {
        message: "Internal Server Error: Request not parsed correctly",
      });
    }

    GlobalContextStorageProvider.updateContext({
      countryOfIssue: parsedBody.countryOfIssue,
      passportNumber: parsedBody.passportNumber.slice(-4),
    });
    const { createdBy } = event.requestContext.authorizer;

    // const application = await Application.getByApplicationId(applicationId);
    // if (!application) {
    //   logger.error("Application does not exist");
    //   return createHttpResponse(400, {
    //     message: `Application with ID: ${applicationId} does not exist`,
    //   });
    // }

    // const { clinicId, createdBy } = event.requestContext.authorizer;
    // const SUPPORT_CLINIC_ID = process.env.SUPPORT_CLINIC_ID;

    // if (!clinicId) {
    //   logger.error("Clinic Id missing");
    //   return createHttpResponse(400, { message: "Clinic Id missing" });
    // }

    // if (clinicId !== SUPPORT_CLINIC_ID && application.clinicId !== clinicId) {
    //   logger.error("Clinic Id mismatch");
    //   return createHttpResponse(403, { message: "Clinic Id mismatch" });
    // }

    // if (clinicId === SUPPORT_CLINIC_ID && application.clinicId !== clinicId) {
    //   logger.info("Validated clinic Id is a support clinicId");
    // }

    const existingApplicant = await ApplicantDbOps.findByPassportId(
      parsedBody.countryOfIssue,
      parsedBody.passportNumber,
    );

    if (existingApplicant) {
      logger.info("An applicant with similar information already exists");
      return createHttpResponse(200, {
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
        return createHttpResponse(400, { message: "Applicant Details already saved" });
      throw error;
    }

    return createHttpResponse(201, {
      ...applicant.toJson(),
    });
  } catch (err: unknown) {
    logger.error(err, "Error saving Applicant details");
    return createHttpResponse(500, { message: "Something went wrong" });
  }
};
