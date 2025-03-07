import crypto from "crypto";

import { createHttpResponse } from "../../shared/http";
import { logger } from "../../shared/logger";
import { Application } from "../../shared/models/application";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";

export const createApplicationHandler = async (event: PetsAPIGatewayProxyEvent) => {
  logger.info("Create application handler triggered");

  const { clinicId, createdBy } = event.requestContext.authorizer;
  const newApplication = await Application.createNewApplication({
    clinicId,
    createdBy,
    applicationId: crypto.randomUUID(),
  });

  return createHttpResponse(200, { ...newApplication.toJson() });
};
