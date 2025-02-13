import { APIGatewayProxyEvent } from "aws-lambda";
import { GlobalContextStorageProvider } from "pino-lambda";

import { CountryCode } from "../../shared/country";
import { createHttpResponse } from "../../shared/http";
import { logger } from "../../shared/logger";
import { Applicant } from "../models/applicant";

export type Header = {
  passportnumber: string;
  countryofissue: CountryCode;
};
export type SearchApplicantEvent = APIGatewayProxyEvent & {
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

    GlobalContextStorageProvider.updateContext({
      countryOfIssue: parsedHeaders.countryofissue,
      passportNumber: parsedHeaders.passportnumber.slice(-4),
    });

    const applicants = await Applicant.findByPassportNumber(
      parsedHeaders.countryofissue,
      parsedHeaders.passportnumber,
    );

    if (!applicants.length) return createHttpResponse(404, { message: "Applicant does not exist" });

    // Note: This check would need to be modified Post-MVP, For MVP, only a single applicant should exist for passport and country combination
    if (applicants.length > 1) {
      logger.error("Duplicate applicants found");
      return createHttpResponse(500, { message: "Unexpected duplicate results found" });
    }

    const applicant = applicants[0];

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
