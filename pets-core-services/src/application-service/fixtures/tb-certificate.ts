import { seededApplications } from "../../shared/fixtures/application";
import { NewTbCertificateDetails } from "../models/tb-certificate";
import { YesOrNo } from "../types/enums";

export const seededTbCertificate: NewTbCertificateDetails[] = [
  {
    applicationId: seededApplications[1].applicationId,
    certificateIssued: YesOrNo.Yes,
    certificateComments: "No signs of TB",
    certificateIssueDate: "2025-01-01",
    certificateNumber: "987000",
    createdBy: "shane.park@iom.com",
  },
  {
    applicationId: seededApplications[2].applicationId,
    certificateIssued: YesOrNo.No,
    certificateComments: "TB is present",
    certificateIssueDate: "2025-06-06",
    certificateNumber: "122344",
    createdBy: "shawn.jones@clinic.com",
  },
];
