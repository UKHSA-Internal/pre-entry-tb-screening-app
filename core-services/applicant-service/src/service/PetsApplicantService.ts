import { IPetsApplicant } from "@/models/IPetsApplicant";
import { ERRORS } from "@utils/Enum";
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
      const data: any = await this.PetsApplicantDAO.putItem(petsApplicantItem);
      if (data?.UnprocessedItems) {
        console.error(`Item not added: ${JSON.stringify(data.UnprocessedItems)}`);
        throw new Error(ERRORS.FAILED_TO_ADD_ITEM);
      }
    }
}
