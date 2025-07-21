import { seededApplications } from "../../shared/fixtures/application";
import {
  NewTbCertificateIssuedDetails,
  NewTbCertificateNotIssuedDetails,
} from "../models/tb-certificate";
import { TBCertNotIssuedReason, YesOrNo } from "../types/enums";

export const seededTbCertificate: Array<
  NewTbCertificateIssuedDetails | NewTbCertificateNotIssuedDetails
> = [
  {
    applicationId: seededApplications[1].applicationId,
    isIssued: YesOrNo.Yes,
    comments: "No signs of TB",
    issueDate: "2025-01-01",
    expiryDate: "2025-06-01",
    clinicName: "Lakeside Medical & TB Screening Centre",
    physicianName: "Dr.Annelie Botha",
    certificateNumber: "987000",
    createdBy: "shane.park@iom.com",
    referenceNumber: seededApplications[1].applicationId,
  },
  {
    applicationId: seededApplications[2].applicationId,
    isIssued: YesOrNo.No,
    clinicName: "Lakeside Medical & TB Screening Centre",
    physicianName: "Dr.Annelie Botha",
    notIssuedReason: TBCertNotIssuedReason.CONFIRMED_SUSPECTED_TB,
    comments: "TB is present",
    createdBy: "shawn.jones@clinic.com",
    referenceNumber: seededApplications[1].applicationId,
  },
];
