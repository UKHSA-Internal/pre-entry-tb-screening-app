import { seededApplications } from "../../shared/fixtures/application";
// import { TaskStatus } from "../../shared/types/enum";
import { ISputumDecision } from "../models/sputum-decision";
import { YesOrNo } from "../types/enums";

export const seededSputumDecision: Omit<ISputumDecision, "dateCreated" | "status">[] = [
  {
    applicationId: seededApplications[1].applicationId,
    sputumRequired: YesOrNo.Yes,
  },
  {
    applicationId: seededApplications[2].applicationId,
    sputumRequired: YesOrNo.No,
  },
];
