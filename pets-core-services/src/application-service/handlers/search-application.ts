import { APIGatewayProxyEvent } from "aws-lambda";
import { GlobalContextStorageProvider } from "pino-lambda";

import { CountryCode } from "../../shared/country";
import { createHttpResponse } from "../../shared/http";
import { logger } from "../../shared/logger";
import { Application } from "../models/application";
import { TravelInformation } from "../models/travel-information";

export type Header = {
  passportnumber: string;
  countryofissue: CountryCode;
};
export type SearchApplicationEvent = APIGatewayProxyEvent & {
  parsedHeaders?: Header;
};

export const searchApplicationByPassportHandler = async (event: SearchApplicationEvent) => {
  try {
    logger.info("Search applicant by Passport details handler triggered");

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

    const applications = await Application.findByPassportDetails(
      parsedHeaders.countryofissue,
      parsedHeaders.passportnumber,
    );

    if (!applications.length) return createHttpResponse(404, { message: "No Applications found" });

    if (applications.length > 1) {
      logger.error("Search should only return one result for MVP");
      return createHttpResponse(500, { message: "More than one application match found" });
    }

    const applicationId = applications[0].applicationId;

    GlobalContextStorageProvider.updateContext({
      applicationId,
    });

    const travelInformation = await TravelInformation.getByApplicationId(applicationId);

    return createHttpResponse(200, [
      {
        applicationId,
        application: applications[0].toJson(),
        travelInformation: travelInformation?.toJson(),
      },
    ]);
  } catch (error) {
    logger.error(error, "Error retrieving application details");
    return createHttpResponse(500, { message: "Something went wrong" });
  }
};
