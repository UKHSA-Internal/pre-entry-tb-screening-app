import { HttpErrors, HttpResponses } from "../../shared/httpResponses";
import { logger } from "../../shared/logger";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { DashboardApplication } from "../models/dashboard-applications";

export const getDashboardApplicationsHandler = async (event: PetsAPIGatewayProxyEvent) => {
  try {
    const { clinicId } = event.requestContext.authorizer;
    const SUPPORT_CLINIC_ID = process.env.SUPPORT_CLINIC_ID;
    if (clinicId === SUPPORT_CLINIC_ID) {
      logger.info("Logged in as a support clinicId");
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
