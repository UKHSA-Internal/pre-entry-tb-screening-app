import { z } from "zod";

import { HttpErrors, HttpResponses } from "../../shared/httpResponses";
import { logger } from "../../shared/logger";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { DashboardApplication } from "../models/dashboard-applications";
import { DashboardApplicationsRequestSchema } from "../types/zod-schema";

export type DashboardApplicationsRequestSchema = z.infer<typeof DashboardApplicationsRequestSchema>;
export type DashboardApplications = PetsAPIGatewayProxyEvent & {
  parsedBody?: DashboardApplicationsRequestSchema;
};
export const getDashboardApplicationsHandler = async (event: DashboardApplications) => {
  try {
    const clinicIdFromToken = event.requestContext.authorizer.clinicId;

    const clinicIdFromRequest = event.parsedBody?.clinicId;
    let clinicId;

    const SUPPORT_CLINIC_ID = process.env.SUPPORT_CLINIC_ID;
    //Accept clinic Id  from request only from support clinics, for others take from token
    if (clinicIdFromToken === SUPPORT_CLINIC_ID) {
      logger.info("Logged in as a support clinicId");
      clinicId = clinicIdFromRequest;
    } else {
      clinicId = clinicIdFromToken;
    }
    logger.info({ clinicId }, "Retrieve Applications handler triggered");

    const limit = Number(event.queryStringParameters?.limit || 100);
    if (!clinicId) {
      logger.error("Clinic Id missing");
      return HttpErrors.badRequest("Clinic Id missing");
    }

    const applicationsListResult = await DashboardApplication.getByClinicId(clinicId, limit);

    return HttpResponses.ok(JSON.stringify(applicationsListResult.map((app) => app.toJson())));
  } catch (error) {
    logger.error(error, "Error retrieving list of applications");
    return HttpErrors.serverError("Something went wrong");
  }
};
