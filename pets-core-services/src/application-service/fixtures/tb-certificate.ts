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
    isIssued: YesOrNo.Yes,
    comments: "No signs of TB",
    issueDate: "2025-01-01",
    certificateNumber: "987000",
    createdBy: "shane.park@iom.com",
  },
  {
    applicationId: seededApplications[2].applicationId,
    isIssued: YesOrNo.No,
    comments: "TB is present",
    createdBy: "shawn.jones@clinic.com",
  },
];
