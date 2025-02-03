import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";

import { createHttpResponse } from "../../shared/http-response";
import { Applicant } from "../models/applicant";

export const postApplicantHandler = async (event: APIGatewayProxyEvent) => {
  try {
    // eslint-disable-next-line no-console
    console.log(event, "Invokation got here");

    const { parsedBody } = event;

    try {
      const applicant = new Applicant(parsedBody);
      await applicant.save();
    } catch (error) {
      // logger.error(error, "Error saving Applicant details");
      if (error instanceof ConditionalCheckFailedException)
        return createHttpResponse(400, { message: "Applicant Details already saved" });
      throw error;
    }
    return createHttpResponse(200, { message: "Applicant Details successfully saved" });
  } catch (err: unknown) {
    console.error(err);
    return createHttpResponse(500, { message: "Something went wrong" });
  }
};
