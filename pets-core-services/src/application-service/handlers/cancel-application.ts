import { z } from "zod";

import { createHttpResponse } from "../../shared/http";
import { logger } from "../../shared/logger";
import { Application } from "../../shared/models/application";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { ApplicationStatus } from "../../shared/types/enum";
import { CancelApplicationRequestSchema } from "../types/zod-schema";

export type CancelApplicationRequestSchema = z.infer<typeof CancelApplicationRequestSchema>;

export type CancelApplicationEvent = PetsAPIGatewayProxyEvent & {
  parsedBody?: CancelApplicationRequestSchema;
};

export const cancelApplicationHandler = async (event: CancelApplicationEvent) => {
  try {
    const applicationId = decodeURIComponent(event.pathParameters?.["applicationId"] ?? "").trim();
    logger.info({ applicationId }, "Cancel application handler triggered");

    const { parsedBody } = event;

    if (!parsedBody) {
      logger.error("Event missing parsed body");
      return createHttpResponse(400, {
        message: "Internal Server Error: Request event missing body",
      });
    }

    const parsed = CancelApplicationRequestSchema.safeParse(parsedBody);
    if (!parsed.success) {
      logger.error({ error: parsed.error.flatten() }, "Validation failed");
      return createHttpResponse(400, {
        message: "Request body data validation failed",
      });
    }

    const { createdBy } = event.requestContext.authorizer;
    const updatedApplication = await Application.updateApplication({
      applicationId: applicationId,
      status: ApplicationStatus.cancelled,
      cancellationReason: parsedBody.cancellationReason as string,
      updatedBy: createdBy,
    });

    return createHttpResponse(200, { ...updatedApplication.toJson() });
  } catch (error) {
    logger.error(error, "Cancel Application Handler");
    return createHttpResponse(500, { message: "Something went wrong" });
  }
};
