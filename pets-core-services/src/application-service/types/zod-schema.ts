import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { TaskStatus } from "../../shared/types/enum";
import {
  ChestXRayNotTakenReason,
  ChestXRayResult,
  HistoryOfConditionsUnder11,
  MenstrualPeriods,
  PregnancyStatus,
  TbSymptomsOptions,
  VisaOptions,
  YesOrNo,
} from "./enums";

extendZodWithOpenApi(z);

export const CreateApplicationResponseSchema = z.object({
  applicationId: z.string().openapi({
    description: "ID of newly created application",
  }),
  dateCreated: z.string().date().openapi({
    description: "Creation Date in UTC timezone",
  }),
});

export const TravelInformationRequestSchema = z.object({
  visaCategory: z.nativeEnum(VisaOptions).openapi({
    description: "Visa Option",
  }),
  ukAddressLine1: z.string().optional().openapi({
    description: "First line of Travel Address",
  }),
  ukAddressLine2: z.string().optional().openapi({
    description: "Second line of Travel Address",
  }),
  ukAddressTownOrCity: z.string().optional().openapi({
    description: "Town or City of Travel Address",
  }),
  ukAddressPostcode: z.string().optional().openapi({
    description: "Postcode of Travel Address",
  }),
  ukMobileNumber: z.string().openapi({
    description: "UK Mobile Number",
  }),
  ukEmailAddress: z.string().openapi({
    description: "UK Email Address",
  }),
});

export const TravelInformationResponseSchema = TravelInformationRequestSchema.extend({
  applicationId: z.string().openapi({
    description: "ID of application",
  }),
  dateCreated: z.string().date().openapi({
    description: "Creation Date in UTC timezone",
  }),
  status: z.nativeEnum(TaskStatus).openapi({
    description: "Status of Task",
  }),
});

export const MedicalScreeningRequestSchema = z.object({
  age: z.number().min(1).openapi({
    description: "Applicant's age",
  }),
  symptomsOfTb: z.nativeEnum(YesOrNo).openapi({
    description: "TB Symptoms?",
  }),
  symptoms: z.array(z.nativeEnum(TbSymptomsOptions)).openapi({
    description: "Selected TB Symptoms",
  }),
  symptomsOther: z.string().optional().openapi({
    description: "Other Symptoms Details",
  }),
  historyOfConditionsUnder11: z.array(z.nativeEnum(HistoryOfConditionsUnder11)).openapi({
    description: "Under 11 History",
  }),
  historyOfConditionsUnder11Details: z.string().optional().openapi({
    description: "Under 11 History Details",
  }),
  historyOfPreviousTb: z.nativeEnum(YesOrNo).openapi({
    description: "Previous Tuberculosis?",
  }),
  previousTbDetails: z.string().optional().openapi({
    description: "Previos Tuberculosis Details",
  }),
  contactWithPersonWithTb: z.nativeEnum(YesOrNo).openapi({
    description: "Contact with person with Tuberculosis?",
  }),
  contactWithTbDetails: z.string().optional().openapi({
    description: "Details of contact with person with Tuberculosis",
  }),
  pregnant: z.nativeEnum(PregnancyStatus).openapi({
    description: "Pregnancy Status",
  }),
  haveMenstralPeriod: z.nativeEnum(MenstrualPeriods).openapi({
    description: "Menstrual Periods?",
  }),
  physicalExaminationNotes: z.string().openapi({
    description: "Notes from Physical Examination",
  }),
});

export const MedicalScreeningResponseSchema = MedicalScreeningRequestSchema.extend({
  applicationId: z.string().openapi({
    description: "ID of application",
  }),
  dateCreated: z.string().date().openapi({
    description: "Creation Date in UTC timezone",
  }),
  status: z.nativeEnum(TaskStatus).openapi({
    description: "Status of Task",
  }),
});

export const TbCertificateIssuedRequestSchema = z.object({
  isIssued: z.literal(YesOrNo.Yes),
  comments: z.string().optional().openapi({
    description: "Physican's comments",
  }),
  issueDate: z.string().date().openapi({
    description: "Date of certificate issue in ISO format",
  }),
  certificateNumber: z.string().openapi({
    description: "Clearance certificate number",
  }),
});

export const TbCertificateNotIssuedRequestSchema = z.object({
  isIssued: z.literal(YesOrNo.No),
  comments: z.string().optional().openapi({
    description: "Physican's comments",
  }),
});

export const TbCertificateRequestSchema = z.union([
  TbCertificateIssuedRequestSchema,
  TbCertificateNotIssuedRequestSchema,
]);

export const TbCertificateIssuedResponseSchema = TbCertificateIssuedRequestSchema.extend({
  dateCreated: z.string().date().openapi({
    description: "Creation Date in UTC timezone",
  }),
  status: z.nativeEnum(TaskStatus).openapi({
    description: "Status of Task",
  }),
});

export const TbCertificateNotIssuedResponseSchema = TbCertificateNotIssuedRequestSchema.extend({
  dateCreated: z.string().date().openapi({
    description: "Creation Date in UTC timezone",
  }),
  status: z.nativeEnum(TaskStatus).openapi({
    description: "Status of Task",
  }),
});

export const TbCertificateResponseSchema = z.union([
  TbCertificateIssuedResponseSchema,
  TbCertificateNotIssuedResponseSchema,
]);

export const ChestXRayNotTakenRequestSchema = z.object({
  chestXrayTaken: z.literal(YesOrNo.No),
  reasonXrayWasNotTaken: z.nativeEnum(ChestXRayNotTakenReason).openapi({
    description: "Reason X-ray was not taken",
  }),
  xrayWasNotTakenFurtherDetails: z.string().optional().openapi({
    description: "Further details on why X-ray was not taken",
  }),
});

export const ChestXRayTakenRequestSchema = z.object({
  chestXrayTaken: z.literal(YesOrNo.Yes),
  posteroAnteriorXrayFileName: z.string().openapi({
    description: "File name for the Postero Anterior X-Ray",
  }),
  posteroAnteriorXray: z.string().openapi({
    description: "S3 Bucket Object key for the Postero Anterior X-Ray",
  }),
  apicalLordoticXrayFileName: z.string().optional().openapi({
    description: "File name for the Apical Lordotic X-Ray",
  }),
  apicalLordoticXray: z.string().optional().openapi({
    description: "S3 Bucket Object key for the Apical Lordotic X-Ray",
  }),
  lateralDecubitusXrayFileName: z.string().optional().openapi({
    description: "File name for the Lateral Decubitus X-Ray",
  }),
  lateralDecubitusXray: z.string().optional().openapi({
    description: "S3 Bucket Object key for the Lateral Decubitus X-Ray",
  }),
  xrayResult: z.nativeEnum(ChestXRayResult).openapi({
    description: "Chest X-Ray Result",
  }),
  xrayResultDetail: z.string().optional().openapi({
    description: "Result Details",
  }),
  xrayMinorFindings: z.array(z.string()).openapi({
    description: "Minor findings",
  }),
  xrayAssociatedMinorFindings: z.array(z.string()).openapi({
    description: "Minor findings (occasionally associated with TB infection)",
  }),
  xrayActiveTbFindings: z.array(z.string()).openapi({
    description: "Findings sometimes seen in active TB (or other conditions)",
  }),
});

export const ChestXRayRequestSchema = z.union([
  ChestXRayTakenRequestSchema,
  ChestXRayNotTakenRequestSchema,
]);

const ChestXRayNotTakenResponseSchema = ChestXRayNotTakenRequestSchema.extend({
  dateCreated: z.string().date().openapi({
    description: "Creation Date in UTC timezone",
  }),
  status: z.nativeEnum(TaskStatus).openapi({
    description: "Status of Task",
  }),
});

const ChestXRayTakenResponseSchema = ChestXRayTakenRequestSchema.extend({
  dateCreated: z.string().date().openapi({
    description: "Creation Date in UTC timezone",
  }),
  status: z.nativeEnum(TaskStatus).openapi({
    description: "Status of Task",
  }),
});

export const ChestXRayResponseSchema = z.union([
  ChestXRayTakenResponseSchema,
  ChestXRayNotTakenResponseSchema,
]);

export const ApplicationSchema = z.object({
  applicationId: z.string().openapi({
    description: "application id",
  }),
  applicantPhotoUrl: z.string().openapi({
    description: "Presigned Url for applicant Photo",
  }),
  travelInformation: TravelInformationResponseSchema,
  medicalScreening: MedicalScreeningResponseSchema,
  chestXray: ChestXRayResponseSchema,
  tbCertificate: TbCertificateResponseSchema,
});

export const ImageUploadUrlRequestSchema = z.object({
  fileName: z.string().openapi({
    description: "Name of file on S3",
  }),
  checksum: z.string().openapi({
    description: "Checksum of file",
  }),
  imageType: z.string().openapi({
    description: "Type of image being uploaded : Dicom/Photo",
  }),
});

export const ImageUploadUrlResponseSchema = z.object({
  uploadUrl: z.string().openapi({
    description: "The upload url",
  }),
  bucketPath: z.string().openapi({
    description: "Bucket Path for Uploaded File",
  }),
  fields: z.record(z.string(), z.string()).openapi({
    description: "Required fields in file upload request",
  }),
});

export const ApplicantPhotoRequestSchema = z.object({
  applicantPhotoKey: z.string().openapi({
    description: "S3 Bucket Object key for Applicant photo",
  }),
});

export const ApplicantPhotoResponseSchema = ApplicantPhotoRequestSchema.extend({
  dateCreated: z.string().date().openapi({
    description: "Creation Date in UTC timezone",
  }),
  status: z.nativeEnum(TaskStatus).openapi({
    description: "Status of Task",
  }),
});
