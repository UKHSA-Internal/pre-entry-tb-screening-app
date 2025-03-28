import { APIGatewayProxyEvent } from "aws-lambda";

import { createHttpResponse } from "../../shared/http";
import { logger } from "../../shared/logger";
import { Clinic } from "../models/clinics";

export const checkActiveClinicHandler = async (event: APIGatewayProxyEvent) => {
  const clinicId = decodeURIComponent(event.pathParameters?.["clinicId"] || "").trim();
  logger.info(`clinicId from pathParameters: ${clinicId}`);

  try {
    logger.info("Active clinics details handler triggered");
    const isActive: boolean = await Clinic.isActiveClinic(clinicId);
    // TODO: Is this the expected response message?
    return createHttpResponse(200, JSON.stringify({ isActive: isActive }));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    logger.error("Fetching Active Clinics Failed");

    return createHttpResponse(500, { message: "Something went wrong" });
  }
};
