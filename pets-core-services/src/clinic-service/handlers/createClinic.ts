import { z } from "zod";

import { HttpErrors, HttpResponses } from "../../shared/httpResponses";
import { logger } from "../../shared/logger";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { Clinic } from "../models/clinics";
import { ClinicSchema } from "../types/zod-schema";

export type ClinicRequestSchema = z.infer<typeof ClinicSchema>;
export type CreateClinicEvent = PetsAPIGatewayProxyEvent & {
  parsedBody?: ClinicRequestSchema;
};
export const createClinicHandler = async (event: CreateClinicEvent) => {
  logger.info("Create clinic handler triggered");

  const { createdBy } = event.requestContext.authorizer;
  const { parsedBody } = event;

  if (!parsedBody) {
    logger.error("Event missing parsed body");

    return HttpErrors.badRequest("Request event missing body");
  }

  const newClinic = await Clinic.createNewClinic({
    ...parsedBody,
    createdBy,
  });
  return HttpResponses.ok({ ...newClinic.toJson() });
};
