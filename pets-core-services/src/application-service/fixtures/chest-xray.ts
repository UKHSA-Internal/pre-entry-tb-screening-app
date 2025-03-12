import { seededApplications } from "../../shared/fixtures/application";
import { NewChestXRayNotTaken, NewChestXRayTaken } from "../models/chest-xray";
import { ChestXRayNotTakenReason, ChestXRayResult, YesOrNo } from "../types/enums";

export const seededChestXray: Array<NewChestXRayTaken | NewChestXRayNotTaken> = [
  {
    applicationId: seededApplications[1].applicationId,
    chestXrayTaken: YesOrNo.Yes,
    posteroAnteriorXray: "saved/bucket/path/for/posterior/anterior",
    apicalLordoticXray: "saved/bucket/path/for/apical/lordotic",
    lateralDecubitusXray: "saved/bucket/path/for/lateral-decubitus",
    createdBy: "shane.park@iom.com",
    xrayResult: ChestXRayResult.Normal,
    xrayMinorFindings: [],
    xrayAssociatedMinorFindings: [],
    xrayActiveTbFindings: [],
  },
  {
    applicationId: seededApplications[2].applicationId,
    chestXrayTaken: YesOrNo.No,
    reasonXrayWasNotTaken: ChestXRayNotTakenReason.Other,
    xrayWasNotTakenFurtherDetails: "Further Notes",
    createdBy: "shawn.jones@clinic.com",
  },
];
