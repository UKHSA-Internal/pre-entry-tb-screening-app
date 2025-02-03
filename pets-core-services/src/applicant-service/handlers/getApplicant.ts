import { APIGatewayProxyEvent } from "aws-lambda";

import { createHttpResponse } from "../../shared/http-response";
import { Applicant } from "../models/applicant";

export const getApplicantHandler = async (event: APIGatewayProxyEvent) => {
  // eslint-disable-next-line no-console
  console.log(event, "Invokation got here");

  const { parsedHeaders } = event;

  const applicant = await Applicant.getByPassportNumber(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    parsedHeaders.countryofissue,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    parsedHeaders.passportnumber,
  );

  if (!applicant) return createHttpResponse(404, { message: "Applicant does not exist" });

  return createHttpResponse(200, { ...applicant.data });
};
