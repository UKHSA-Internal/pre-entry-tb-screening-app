import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { z } from "zod";

import { createHttpResponse } from "../../shared/http";
import { logger } from "../../shared/logger";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { ChestXRayDbOps, ChestXRayNotTaken, ChestXRayTaken } from "../models/chest-xray";
import { ChestXRayRequestSchema } from "../types/zod-schema";

export type ChestXRayRequestSchema = z.infer<typeof ChestXRayRequestSchema>;
export type SaveChestXrayEvent = PetsAPIGatewayProxyEvent & {
  parsedBody?: ChestXRayRequestSchema;
};

export const saveChestXRayHandler = async (event: SaveChestXrayEvent) => {
  try {
    const applicationId = decodeURIComponent(event.pathParameters?.["applicationId"] || "").trim();

    logger.info({ applicationId }, "Save Chest X-ray Information handler triggered");

    const { parsedBody } = event;

    if (!parsedBody) {
      logger.error("Event missing parsed body");

      return createHttpResponse(500, {
        message: "Internal Server Error: Chest X-Ray Request not parsed correctly",
      });
    }

    let chestXray: ChestXRayTaken | ChestXRayNotTaken;
    try {
      const { createdBy } = event.requestContext.authorizer;
      chestXray = await ChestXRayDbOps.createChestXray({
        ...parsedBody,
        createdBy,
        applicationId,
      });
    } catch (error) {
      if (error instanceof ConditionalCheckFailedException)
        return createHttpResponse(400, { message: "Chest X-ray already saved" });
      throw error;
    }

    return createHttpResponse(200, {
      ...chestXray.toJson(),
    });
  } catch (error) {
    logger.error(error, "Error saving Chest X-ray");
    return createHttpResponse(500, { message: "Something went wrong" });
  }
};
