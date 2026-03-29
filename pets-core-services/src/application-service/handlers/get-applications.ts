import { HttpErrors, HttpResponses } from "../../shared/httpResponses";
import { logger } from "../../shared/logger";
import { ApplicationRoot } from "../../shared/models/applications";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";

export const getApplicationsHandler = async (event: PetsAPIGatewayProxyEvent) => {
  try {
    const { clinicId } = event.requestContext.authorizer;
    const SUPPORT_CLINIC_ID = process.env.SUPPORT_CLINIC_ID;
    if (clinicId === SUPPORT_CLINIC_ID) {
      logger.info("Logged in as a support clinicId");
    }
    logger.info({ clinicId }, "Retrieve Applications handler triggered");

    const limit = Number(event.queryStringParameters?.limit || 20);
    const cursor = event.queryStringParameters?.cursor;
    if (!clinicId) {
      logger.error("Clinic Id missing");
      return HttpErrors.badRequest("Clinic Id missing");
    }

    const applicationsListResult = await ApplicationRoot.getByClinicId(clinicId, limit, cursor);

    return HttpResponses.ok(
      JSON.stringify({
        items: applicationsListResult.items.map((i) => i.toJson()),
        cursor: applicationsListResult.cursor,
      }),
    );
  } catch (error) {
    logger.error(error, "Error retrieving list of applications");
    return HttpErrors.serverError("Something went wrong");
  }
};
