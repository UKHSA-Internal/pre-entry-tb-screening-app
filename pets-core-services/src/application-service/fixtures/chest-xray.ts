import { seededApplications } from "../../shared/fixtures/application";
import { NewChestXRayNotTaken, NewChestXRayTaken } from "../models/chest-xray";
import { ChestXRayNotTakenReason, YesOrNo } from "../types/enums";

export const seededChestXray: Array<NewChestXRayTaken | NewChestXRayNotTaken> = [
  {
    applicationId: seededApplications[1].applicationId,
    chestXrayTaken: YesOrNo.Yes,
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
  {
    applicationId: seededApplications[2].applicationId,
    chestXrayTaken: YesOrNo.No,
    reasonXrayWasNotTaken: ChestXRayNotTakenReason.Other,
    xrayWasNotTakenFurtherDetails: "Further Notes",
    createdBy: "shawn.jones@clinic.com",
  },
];
