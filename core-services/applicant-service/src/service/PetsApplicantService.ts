import { IPetsApplicant } from "@/models/IPetsApplicant";
import { ERRORS } from "@utils/Enum";
import { HTTPError } from "@/models/HTTPError";
import PetsApplicantDAO from "@/models/dao/PetsApplicantDAO";

export class PetsApplicantService {
  public readonly PetsApplicantDAO: PetsApplicantDAO;

  constructor(PetsApplicantDAO: PetsApplicantDAO) {
    this.PetsApplicantDAO = PetsApplicantDAO;
  }

  /**
   * Update or insert the provided Pets Applicant details to the DB.
   * @param petsApplicantItem (PetsApplicant)
   */
     public async putPetsApplicant(petsApplicantItem: IPetsApplicant) {
      const data: any = await this.PetsApplicantDAO
        .putItem(petsApplicantItem)
        .catch((error: any) => {
          if (!(error instanceof HTTPError)) {
            console.log(error);
            error.statusCode = 500;
            error.body = ERRORS.INTERNAL_SERVER_ERROR;
          }
          throw new HTTPError(error.statusCode, error.body);
        });
      if (data?.UnprocessedItems) {
        console.error(`Item not added: ${JSON.stringify(data.UnprocessedItems)}`);
        throw new Error(ERRORS.FAILED_TO_ADD_ITEM);
      }
      return "Data successfully posted"
    }
}
