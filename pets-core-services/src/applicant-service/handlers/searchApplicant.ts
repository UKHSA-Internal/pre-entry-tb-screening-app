import { GlobalContextStorageProvider } from "pino-lambda";

import { CountryCode } from "../../shared/country";
import { HttpErrors, HttpResponses } from "../../shared/httpResponses";
import { logger } from "../../shared/logger";
import { ApplicantDbOps } from "../../shared/models/applicant";
import { Application } from "../../shared/models/application";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";

export type ApplicantHeader = {
  passportnumber: string;
  countryofissue: CountryCode;
};
export type SearchApplicantEvent = PetsAPIGatewayProxyEvent & {
  parsedHeaders?: ApplicantHeader;
};

export const searchApplicantHandler = async (event: SearchApplicantEvent) => {
  const VITE_SUPPORT_CLINIC_ID = process.env.VITE_SUPPORT_CLINIC_ID;
  try {
    logger.info("Search applicant details handler triggered");

    const { parsedHeaders } = event;

    if (!parsedHeaders) {
      logger.error("Request missing parsed headers");
      return HttpErrors.badRequest("Request event missing body");
    }
    const countryOfIssue = parsedHeaders.countryofissue;
    const passportNumber = parsedHeaders.passportnumber;

    GlobalContextStorageProvider.updateContext({
      countryOfIssue: countryOfIssue,
      passportNumber: passportNumber.slice(-4),
    });

    // Fetch an applicant
    const applicant = await ApplicantDbOps.findByPassportId(countryOfIssue, passportNumber);
    if (!applicant) return HttpErrors.notFound("Applicant does not exist");

    // Fetch the applications created for the applicant

    const applications = await Application.getByApplicantId(passportNumber, countryOfIssue);
    if (!applications.length && applicant) {
      logger.error("Applicant has been created without an application");
      return HttpErrors.validationError("Applicant has been created without an application");
    }
    // Sort the applications by created Date
    const sortedApplications = applications ? [...applications] : [];

    sortedApplications.sort(
      (a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime(),
    );

    //Get the latest application
    const application = sortedApplications?.[0] ?? null;

    const { clinicId } = event.requestContext.authorizer;
    // validate the clinic id
    if (!clinicId) {
      logger.error("Clinic Id missing");
      return HttpErrors.badRequest("Clinic Id missing");
    }

    if (clinicId !== VITE_SUPPORT_CLINIC_ID && application.clinicId !== clinicId) {
      logger.error("Clinic Id mismatch");
      return HttpErrors.forbidden("Clinic Id mismatch");
    }

    if (clinicId === VITE_SUPPORT_CLINIC_ID && application.clinicId !== clinicId) {
      logger.info("Getting an application for the support clinic");
    }
    return HttpResponses.ok({
      ...applicant.toJson(),
      applications: sortedApplications.map((e) => e.toJson()),
    });
  } catch (error) {
    logger.error(error, "Searching Applicant Details Failed");
    return HttpErrors.serverError("Something went wrong");
  }
};
