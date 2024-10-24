import { PetsApplicantService } from "@/service/PetsApplicantService";
import PetsApplicantDAO from "@/models/dao/PetsApplicantDAO";
import { HTTPResponse } from "@models/HTTPResponse";
import { HTTPError } from "@models/HTTPError";
import { Validator } from "@utils/Validator";
import { Handler } from "aws-lambda";
import { ERRORS, HTTP_RESPONSE } from "@utils/Enum";

export const getPetsApplicant: Handler = async (event) => {
  const petsApplicantDAO = new PetsApplicantDAO();
  const service = new PetsApplicantService(petsApplicantDAO);

  const check: Validator = new Validator();

  // console.log(event)

  if (!event.queryStringParameters) {
    return new HTTPResponse(400, HTTP_RESPONSE.MISSING_PARAMETERS);
  } else if (!check.parametersAreValid(event.queryStringParameters)) {
    return new HTTPResponse(400, HTTP_RESPONSE.MISSING_PARAMETERS);
  }

  const petsApplicantPassportDetails = event.queryStringParameters
    ? event.queryStringParameters
    : undefined;

  try {
    const petsApplicant = await service.getPetsApplicant(petsApplicantPassportDetails);
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
