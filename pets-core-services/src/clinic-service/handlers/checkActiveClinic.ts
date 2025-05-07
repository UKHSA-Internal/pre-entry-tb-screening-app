import { APIGatewayProxyEvent } from "aws-lambda";

import { createHttpResponse } from "../../shared/http";
import { logger } from "../../shared/logger";
import { Clinic } from "../models/clinics";

export const checkActiveClinicHandler = async (event: APIGatewayProxyEvent) => {
  const clinicId = decodeURIComponent(event.pathParameters?.["clinicId"] ?? "").trim();
  logger.info(`clinicId from pathParameters: ${clinicId}`);

  try {
    logger.info("Active clinics details handler triggered");
    const isActive: boolean = await Clinic.isActiveClinic(clinicId);
    return createHttpResponse(200, JSON.stringify({ isActive: isActive }));
  } catch (error) {
    logger.error("Checking Active Clinics Failed:", error);

    return createHttpResponse(500, { message: "Something went wrong" });
  }
};
