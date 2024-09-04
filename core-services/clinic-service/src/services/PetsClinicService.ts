import { HTTPError } from "@models/HTTPError";
import { IPetsClinic } from "@models/IPetsClinic";
import { ERRORS } from "@utils/Enum";
import PetsClinicDAO from "@models/dao/PetsClinicDAO";

export class PetsClinicService {
  public readonly petsClinicDAO: PetsClinicDAO;

  constructor(petsClinicDAO: PetsClinicDAO) {
    this.petsClinicDAO = petsClinicDAO;
  }

  /**
   * Fetch a pets clinic from DynamoDB based on its clinic id
   */
  public async getPetsClinic(petsClinicId: string) {
    const petsClinic = await this.petsClinicDAO.getItem(
      petsClinicId
    );

    if (!petsClinic) {
      throw new HTTPError(404, ERRORS.RESOURCE_NOT_FOUND);
    }

    return petsClinic;
  }

  /**
   * Fetch a list of all pets clinics from DynamoDB
   */
  public getAllPetsClinic() {
    console.log(this.petsClinicDAO);
    return this.petsClinicDAO
      .getAll()
      .then((data: any) => {
        if (data.Count === 0) {
          throw new HTTPError(404, ERRORS.RESOURCE_NOT_FOUND);
        }
        return data.Items;
      })
      .catch((error: any) => {
        if (!(error instanceof HTTPError)) {
          console.log(error);
          error.statusCode = 500;
          error.body = ERRORS.INTERNAL_SERVER_ERROR;
        }
        throw new HTTPError(error.statusCode, error.body);
      });
  }

  /**
   * Update or insert the provided Pets Clinic details to the DB.
   * @param petsClinicItem (PetsClinic)
   */
     public async putPetsClinic(petsClinicItem: IPetsClinic) {
      const data: any = await this.petsClinicDAO.putItem(petsClinicItem);
      if (data?.UnprocessedItems) {
        console.error(`Item not added: ${JSON.stringify(data.UnprocessedItems)}`);
        throw new Error(ERRORS.FAILED_TO_ADD_ITEM);
      }
    }
}
