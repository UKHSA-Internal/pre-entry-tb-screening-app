import { z } from "zod";

import { HttpErrors, HttpResponses } from "../../shared/httpResponses";
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
      return HttpErrors.badRequest("Request event missing body");
    }

    //  Validate Sputum  Details Request
    const parsed = SputumRequestSchema.safeParse(parsedBody);
    if (!parsed.success) {
      logger.error({ error: parsed.error.flatten() }, "Validation failed");
      return HttpErrors.validationError("Sputum Details Request validation failed");
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
        return HttpErrors.conflictError("Sputum Details already saved");
      throw error;
    }

    return HttpResponses.ok({ ...sputumDetails.toJson() });
  } catch (err) {
    logger.error(err, "Error saving Sputum Details");
    return HttpErrors.serverError("Something went wrong");
  }
};
