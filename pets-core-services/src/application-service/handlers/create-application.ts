import crypto from "crypto";
import { z } from "zod";

import { HttpErrors, HttpResponses } from "../../shared/httpResponses";
import { logger } from "../../shared/logger";
import { Application } from "../../shared/models/application";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { CreateApplicationRequestSchema } from "../types/zod-schema";

export type ApplicationRequestSchema = z.infer<typeof CreateApplicationRequestSchema>;
export type SaveApplicationEvent = PetsAPIGatewayProxyEvent & {
  parsedBody?: ApplicationRequestSchema;
};

export const createApplicationHandler = async (event: SaveApplicationEvent) => {
  logger.info("Create application handler triggered");

  const { clinicId, createdBy } = event.requestContext.authorizer;
  const { parsedBody } = event;

  if (!parsedBody) {
    logger.error("Event missing parsed body");

    return HttpErrors.badRequest("Request event missing body");
  }

  const newApplication = await Application.createNewApplication({
    ...parsedBody,
    clinicId,
    createdBy,
    applicationId: crypto.randomUUID(),
  });

  return HttpResponses.ok(newApplication.toJson());
};
