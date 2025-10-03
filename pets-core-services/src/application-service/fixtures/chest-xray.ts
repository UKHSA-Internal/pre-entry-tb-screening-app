import { seededApplications } from "../../shared/fixtures/application";
import { NewChestXRay } from "../models/chest-xray";

export const seededChestXray: Array<NewChestXRay> = [
  {
    applicationId: seededApplications[1].applicationId,
    dateXrayTaken: "2025-09-04",
    posteroAnteriorXrayFileName: "posterior-anterior.dicom",
    posteroAnteriorXray:
      "dicom/Apollo Clinic/BRB/ABC1234JANE/generated-app-id-2/postero-anterior.dcm",
    apicalLordoticXrayFileName: "apical-lordotic.dicom",

    apicalLordoticXray:
      "dicom/Apollo Clinic/BRB/ABC1234JANE/generated-app-id-2/apical-lordotic.dcm",
    lateralDecubitusXrayFileName: "lateral-decubitus.dicom",

    lateralDecubitusXray:
      "dicom/Apollo Clinic/BRB/ABC1234JANE/generated-app-id-2/lateral-decubitus.dcm",
    createdBy: "shane.park@iom.com",
  },
];
