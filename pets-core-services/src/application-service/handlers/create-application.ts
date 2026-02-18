import crypto from "crypto";
import { z } from "zod";

import { createHttpResponse } from "../../shared/http";
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

    return createHttpResponse(500, {
      message: "Internal Server Error: Create Application request not parsed correctly",
    });
  }

  const newApplication = await Application.createNewApplication({
    ...parsedBody,
    clinicId,
    createdBy,
    applicationId: crypto.randomUUID(),
  });

  return createHttpResponse(200, { ...newApplication.toJson() });
};
