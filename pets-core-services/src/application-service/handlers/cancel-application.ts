import { z } from "zod";

import { HttpErrors, HttpResponses } from "../../shared/httpResponses";
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
      return HttpErrors.badRequest("Request event missing body");
    }

    const parsed = CancelApplicationRequestSchema.safeParse(parsedBody);
    if (!parsed.success) {
      logger.error({ error: parsed.error.flatten() }, "Validation failed");
      return HttpErrors.badRequest("Request body failed validation");
    }

    const { createdBy } = event.requestContext.authorizer;
    const updatedApplication = await Application.updateApplication({
      applicationId: applicationId,
      applicationStatus: ApplicationStatus.cancelled,
      cancellationReason: parsedBody.cancellationReason as string,
      cancellationFurtherInfo: parsedBody.cancellationFurtherInfo as string,
      updatedBy: createdBy,
    });

    return HttpResponses.ok({ ...updatedApplication.toJson() });
  } catch (error) {
    logger.error(error, "Cancel Application Handler");
    return HttpErrors.serverError("Something went wrong");
  }
};
