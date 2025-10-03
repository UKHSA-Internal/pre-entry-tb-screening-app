import { z } from "zod";

import { createHttpResponse } from "../../shared/http";
import { logger } from "../../shared/logger";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { SputumDetails, SputumDetailsDbOps } from "../models/sputum-details";
import { SputumRequestSchema } from "../types/zod-schema";

export type SputumRequestSchema = z.infer<typeof SputumRequestSchema>;

export type SaveSputumDetailsEvent = PetsAPIGatewayProxyEvent & {
  parsedBody?: SputumRequestSchema;
};

export const saveSputumDetailsHandler = async (event: SaveSputumDetailsEvent) => {
  try {
    const applicationId = decodeURIComponent(event.pathParameters?.["applicationId"] ?? "").trim();

    logger.info({ applicationId }, "Save Sputum Details handler triggered");

    const { parsedBody } = event;

    if (!parsedBody) {
      logger.error("Event missing parsed body");
      return createHttpResponse(500, {
        message: "Internal Server Error: Sputum Details Request missing",
      });
    }

    //  Validate Sputum  Details Request
    const parsed = SputumRequestSchema.safeParse(parsedBody);
    if (!parsed.success) {
      logger.error({ error: parsed.error.flatten() }, "Validation failed");
      return createHttpResponse(400, {
        message: "Sputum Details Request validation failed",
      });
    }

    const { createdBy } = event.requestContext.authorizer;
    let sputumDetails: SputumDetails;
    try {
      sputumDetails = await SputumDetailsDbOps.createOrUpdateSputumDetails(applicationId, {
        ...parsed.data,
        createdBy,
        applicationId,
      });
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if ((error as any).name === "ConditionalCheckFailedException")
        return createHttpResponse(400, { message: "Sputum Details already saved" });
      throw error;
    }

    return createHttpResponse(200, {
      ...sputumDetails.toJson(),
    });
  } catch (err) {
    logger.error(err, "Error saving Sputum Details");
    return createHttpResponse(500, { message: "Something went wrong" });
  }
};
