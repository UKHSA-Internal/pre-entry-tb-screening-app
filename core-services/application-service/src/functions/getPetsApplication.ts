import { PetsApplicationService } from "@/service/PetsApplicationService";
import { HTTPResponse } from "@models/HTTPResponse";
import { HTTPError } from "@models/HTTPError";
import { Handler } from "aws-lambda";
import { ERRORS, HTTP_RESPONSE } from "@utils/Enum";

export const getPetsApplication: Handler = async (event) => {
  console.log("--> function getPetsApplication");
  const service = new PetsApplicationService();

  // if (!event.queryStringParameters) {
  //   return new HTTPResponse(400, HTTP_RESPONSE.MISSING_PARAMETERS);
  // }

  const petsApplicationDetails = event.queryStringParameters
    ? event.queryStringParameters
    : undefined;

  try {
    const petsApplicant = await service.getPetsApplication(petsApplicationDetails);
    return new HTTPResponse(200, petsApplicant);
  } catch (error: any) {
    console.error(error);
    if (!(error instanceof HTTPError)) {
      error.statusCode = 500;
      error.body = ERRORS.INTERNAL_SERVER_ERROR;
    }
    return new HTTPError(error.statusCode, error.body);
  }
};