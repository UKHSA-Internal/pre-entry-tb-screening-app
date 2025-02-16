import crypto from "crypto";

import { createHttpResponse } from "../../shared/http";
import { logger } from "../../shared/logger";
import { Application } from "../../shared/models/application";

export const createApplicationHandler = async () => {
  logger.info("Create application handler triggered");

  const clinicId = "Apollo Clinic";
  const createdBy = "hardcoded@user.com";
  const newApplication = await Application.createNewApplication({
    clinicId,
    createdBy,
    applicationId: crypto.randomUUID(),
  });

  return createHttpResponse(200, { ...newApplication.toJson() });
};
