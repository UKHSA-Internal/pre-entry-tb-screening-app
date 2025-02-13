import { APIGatewayProxyEvent } from "aws-lambda";
import { GlobalContextStorageProvider } from "pino-lambda";
import { z } from "zod";

import { createHttpResponse } from "../../shared/http";
import { logger } from "../../shared/logger";
import { Application } from "../models/application";
import { CreateApplicationRequestSchema } from "../types/zod-schema";

export type CreateApplicationRequestSchema = z.infer<typeof CreateApplicationRequestSchema>;

export type CreateApplicationEvent = APIGatewayProxyEvent & {
  parsedBody?: CreateApplicationRequestSchema;
};

export const createApplicationHandler = async (event: CreateApplicationEvent) => {
  logger.info("Create application handler triggered");

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

  const existingApplications = await Application.findByPassportDetails(
    parsedBody.countryOfIssue,
    parsedBody.passportNumber,
  );

  if (existingApplications.length) {
    logger.error("An applicant can only have one application for MVP");

    return createHttpResponse(400, {
      message: "An applicant can only have one application for MVP",
      existingApplications: existingApplications.map((application) => application.applicationId),
    });
  }

  const clinicId = "Apollo Clinic";
  const createdBy = "hardcoded@user.com";
  const newApplication = await Application.createNewApplication({
    ...parsedBody,
    clinicId,
    createdBy,
  });

  return createHttpResponse(200, { ...newApplication.toJson() });
};
