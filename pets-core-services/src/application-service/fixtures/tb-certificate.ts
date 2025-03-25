import { seededApplications } from "../../shared/fixtures/application";
import {
  NewTbCertificateIssuedDetails,
  NewTbCertificateNotIssuedDetails,
} from "../models/tb-certificate";
import { YesOrNo } from "../types/enums";

export const seededTbCertificate: Array<
  NewTbCertificateIssuedDetails | NewTbCertificateNotIssuedDetails
> = [
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
    createdBy: "shawn.jones@clinic.com",
  },
];
