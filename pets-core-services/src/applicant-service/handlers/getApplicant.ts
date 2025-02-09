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
export type GetApplicantEvent = APIGatewayProxyEvent & {
  parsedHeaders?: Header;
};

export const getApplicantHandler = async (event: GetApplicantEvent) => {
  try {
    logger.info("Get applicant details handler triggered");

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

    const applicant = await Applicant.getByPassportNumber(
      parsedHeaders.countryofissue,
      parsedHeaders.passportnumber,
    );

    if (!applicant) return createHttpResponse(404, { message: "Applicant does not exist" });

    return createHttpResponse(200, {
      ...applicant.toJson(),
    });
  } catch (error) {
    logger.error(error, "Getting Applicant Details Failed");
    return createHttpResponse(500, { message: "Something went wrong" });
  }
};
