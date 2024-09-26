import { PetsClinicService } from "../services/PetsClinicService";
import PetsClinicDAO from "@models/dao/PetsClinicDAO";
import { HTTPResponse } from "@models/HTTPResponse";
import { HTTPError } from "@models/HTTPError";
import { Handler } from "aws-lambda";
import { IPetsClinic } from "@models/IPetsClinic";

export const getPetsClinics: Handler = async () => {
  const petsClinicDAO = new PetsClinicDAO();
  const service = new PetsClinicService(petsClinicDAO);

  return service
  .getAllPetsClinic()
  .then((data: IPetsClinic[]) => {
    return new HTTPResponse(200, data);
  })
  .catch((error: any) => {
    console.error(error);
    return new HTTPError(error.statusCode, error.body);
  });
};
