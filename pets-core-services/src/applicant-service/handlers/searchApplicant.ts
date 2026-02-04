import { GlobalContextStorageProvider } from "pino-lambda";

import { CountryCode } from "../../shared/country";
import { createHttpResponse } from "../../shared/http";
import { logger } from "../../shared/logger";
import { ApplicantDbOps } from "../../shared/models/applicant";
import { Application } from "../../shared/models/application";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";

export type Header = {
  passportnumber: string;
  countryofissue: CountryCode;
};
export type SearchApplicantEvent = PetsAPIGatewayProxyEvent & {
  parsedHeaders?: Header;
};

export const searchApplicantHandler = async (event: SearchApplicantEvent) => {
  try {
    logger.info("Search applicant details handler triggered");

    const { parsedHeaders } = event;

    if (!parsedHeaders) {
      logger.error("Request missing parsed headers");
      return createHttpResponse(500, {
        message: "Internal Server Error: Request not parsed correctly",
      });
    }
    const countryOfIssue = parsedHeaders.countryofissue;
    const passportNumber = parsedHeaders.passportnumber;

    GlobalContextStorageProvider.updateContext({
      countryOfIssue: countryOfIssue,
      passportNumber: passportNumber.slice(-4),
    });

    const applicant = await ApplicantDbOps.findByPassportId(countryOfIssue, passportNumber);
    if (!applicant) return createHttpResponse(204, []);

    const applications = await Application.getByApplicantId(passportNumber, countryOfIssue);
    if (!applications.length) {
      logger.error("Edge-Case: Applicant has been created without an application");
      return createHttpResponse(400, {
        message: `Matched Applicant has been created without an application`,
      });
    }
    let application: Application | null;

    const sorted = applications?.sort(
      (a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime(),
    );

    application = sorted?.[0] ?? null;

    if (applications.length < 1 && applicant.applicationId) {
      application = await Application.getByApplicationId(applicant.applicationId);
      if (!application) {
        logger.error("Edge-Case: Applicant has been created without an application");
        return createHttpResponse(400, {
          message: `Matched Applicant has been created without an application`,
        });
      }
    }

    const { clinicId } = event.requestContext.authorizer;

    if (!clinicId) {
      logger.error("Clinic Id missing");
      return createHttpResponse(400, { message: "Clinic Id missing" });
    }

    if (application.clinicId !== clinicId) {
      logger.error("Clinic Id mismatch");
      return createHttpResponse(403, { message: "Clinic Id mismatch" });
    }

    return createHttpResponse(200, [
      {
        ...applicant.toJson(),
      },
    ]);
  } catch (error) {
    logger.error(error, "Searching Applicant Details Failed");
    return createHttpResponse(500, { message: "Something went wrong" });
  }
};
