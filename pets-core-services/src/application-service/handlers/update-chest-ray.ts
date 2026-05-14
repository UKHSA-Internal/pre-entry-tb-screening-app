import { z } from "zod";

import { HttpErrors, HttpResponses } from "../../shared/httpResponses";
import { logger } from "../../shared/logger";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { ChestXrayDbOps, ChestXrayUpdate } from "../models/chest-xray";
import { ChestXRayUpdateRequestSchema } from "../types/zod-schema";

export type ChestXrayRequestSchema = z.infer<typeof ChestXRayUpdateRequestSchema>;
export type UpdateChestXrayEvent = PetsAPIGatewayProxyEvent & {
  parsedBody?: ChestXrayRequestSchema;
};

export const updateChestXRayHandler = async (event: UpdateChestXrayEvent) => {
  try {
    const applicationId = decodeURIComponent(event.pathParameters?.["applicationId"] ?? "").trim();

    logger.info({ applicationId }, "Update Chest Xray handler triggered");

    const { parsedBody } = event;
    const { createdBy, superuser } = event.requestContext.authorizer;
    logger.info(createdBy);
    logger.info(superuser);
    if (!parsedBody) {
      logger.error("Event missing parsed body");

      return HttpErrors.badRequest("Request event missing body");
    }
    let validatedBody;
    const validated = ChestXRayUpdateRequestSchema.safeParse(parsedBody);

    if (superuser === "true") {
      if (!validated.success) {
        logger.error({ error: validated.error.flatten() }, "Validation failed");
        return HttpErrors.validationError("Update Chest Xray Request validation failed");
      }
      validatedBody = validated.data;
    } else {
      logger.error("Chest Xray Request Update is not allowed");
      return HttpErrors.unauthorized("Unauthorized");
    }

    const chestXrayDetails: ChestXrayUpdate = await ChestXrayDbOps.updateChestXray({
      ...validatedBody,
      updatedBy: createdBy,
      applicationId,
    });

    return HttpResponses.ok({
      ...chestXrayDetails.toJson(),
    });
  } catch (err) {
    logger.error(err, "Error updating Chest Xray Details");
    return HttpErrors.serverError("Something went wrong");
  }
};
