import { PetsClinicService } from "@services/PetsClinicService";
import PetsClinicDAO from "@models/dao/PetsClinicDAO";
import { HTTPResponse } from "@models/HTTPResponse";
import { HTTPError } from "@models/HTTPError";
import { Validator } from "@utils/Validator";
import { Handler } from "aws-lambda";
import { ERRORS, HTTP_RESPONSE } from "@utils/Enum";

export const getPetsClinic: Handler = async (event) => {
  const petsClinicDAO = new PetsClinicDAO();
  const service = new PetsClinicService(petsClinicDAO);

  const check: Validator = new Validator();

  if (event.pathParameters) {
    if (!check.parametersAreValid(event.pathParameters)) {
      return new HTTPResponse(400, HTTP_RESPONSE.MISSING_PARAMETERS);
    }
  } else {
    return new HTTPResponse(400, HTTP_RESPONSE.MISSING_PARAMETERS);
  }

  const petsClinicId = event.pathParameters
    ? event.pathParameters.petsClinicId
    : undefined;

  try {
    const petsClinic = await service.getPetsClinic(petsClinicId);
    return new HTTPResponse(200, petsClinic);
  } catch (error: any) {
    console.error(error);
    if (!(error instanceof HTTPError)) {
      error.statusCode = 500;
      error.body = ERRORS.INTERNAL_SERVER_ERROR;
    }
    return new HTTPError(error.statusCode, error.body);
  }
};
