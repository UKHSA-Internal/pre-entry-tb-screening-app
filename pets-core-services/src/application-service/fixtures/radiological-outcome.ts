import { seededApplications } from "../../shared/fixtures/application";
import { IRadiologicalOutcome } from "../models/radiological-outcome";

export const seededRadiologicalOutcome: Omit<IRadiologicalOutcome, "dateCreated" | "status">[] = [
  {
    applicationId: seededApplications[1].applicationId,
    xrayResult: "Chest X-ray normal",
    xrayResultDetail: "Result details",
    xrayMinorFindings: ["Minor Findings"],
    xrayAssociatedMinorFindings: ["Associated Minor Findings"],
    xrayActiveTbFindings: ["Active TB Findings"],
  },
  {
    applicationId: seededApplications[2].applicationId,
    xrayResult: "Chest X-ray ",
    xrayResultDetail: "Result explanation",
    xrayMinorFindings: ["Finding No1"],
    xrayAssociatedMinorFindings: [""],
    xrayActiveTbFindings: ["All good"],
  },
];
