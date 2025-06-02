import { seededApplications } from "../../shared/fixtures/application";
import { NewChestXRayNotTaken, NewChestXRayTaken } from "../models/chest-xray";
import { ChestXRayNotTakenReason, ChestXRayResult, YesOrNo } from "../types/enums";

export const seededChestXray: Array<NewChestXRayTaken | NewChestXRayNotTaken> = [
  {
    applicationId: seededApplications[1].applicationId,
    chestXrayTaken: YesOrNo.Yes,
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
    xrayResult: ChestXRayResult.Normal,
    xrayMinorFindings: [],
    xrayAssociatedMinorFindings: [],
    xrayActiveTbFindings: [],
    isSputumRequired: YesOrNo.No,
  },
  {
    applicationId: seededApplications[2].applicationId,
    chestXrayTaken: YesOrNo.No,
    reasonXrayWasNotTaken: ChestXRayNotTakenReason.Other,
    xrayWasNotTakenFurtherDetails: "Further Notes",
    createdBy: "shawn.jones@clinic.com",
    isSputumRequired: YesOrNo.Yes,
  },
];
