import { PetsApplicantService } from "@/service/PetsApplicantService";
import PetsApplicantDAO from "@/models/dao/PetsApplicantDAO";
import { HTTPResponse } from "@models/HTTPResponse";
import { HTTPError } from "@models/HTTPError";
import { Validator } from "@utils/Validator";
import { Handler } from "aws-lambda";
import { ERRORS, HTTP_RESPONSE } from "@utils/Enum";

export const postPetsApplicant: Handler = async (event) => {
  const petsApplicantDAO = new PetsApplicantDAO();
  const service = new PetsApplicantService(petsApplicantDAO);

  const check: Validator = new Validator();

  if (!event.body) {
    return new HTTPResponse(400, HTTP_RESPONSE.INVALID_BODY);
  } else if (!check.parametersAreValid(event.body)) {
    return new HTTPResponse(400, HTTP_RESPONSE.INVALID_BODY);
  }

  const petsApplicantDetails = event.body
    ? JSON.parse(event.body)
    : undefined;

  try {
    const petsApplicant = await service.putPetsApplicant(petsApplicantDetails);
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
