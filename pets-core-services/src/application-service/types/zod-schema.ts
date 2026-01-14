import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { ApplicationStatus, TaskStatus } from "../../shared/types/enum";
import {
  ChestXRayNotTakenReason,
  HistoryOfConditionsUnder11,
  MenstrualPeriods,
  PregnancyStatus,
  SmearAndCultureResultOptions,
  SputumCollectionMethod,
  TBCertNotIssuedReason,
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

export const CancelApplicationRequestSchema = z.object({
  applicationId: z.string().openapi({
    description: "ID of newly created application",
  }),
  status: z.nativeEnum(ApplicationStatus).openapi({
    description: "Application current status",
  }),
  cancellationReason: z.string().optional().openapi({
    description: "Reason for application cancelling",
  }),
});

export const TravelInformationBaseSchema = z.object({
  visaCategory: z.nativeEnum(VisaOptions).optional().openapi({
    description: "Visa Option",
  }),
  ukAddressLine1: z.string().optional().openapi({
    description: "First line of Travel Address",
  }),
  ukAddressLine2: z.string().optional().openapi({
    description: "Second line of Travel Address",
  }),
  ukAddressLine3: z.string().optional().openapi({
    description: "Third line of Travel Address",
  }),
  ukAddressTownOrCity: z.string().optional().openapi({
    description: "Town or City of Travel Address",
  }),
  ukAddressPostcode: z.string().optional().openapi({
    description: "Postcode of Travel Address",
  }),
  ukMobileNumber: z.string().optional().openapi({
    description: "UK Mobile Number",
  }),
  ukEmailAddress: z.string().optional().openapi({
    description: "UK Email Address",
  }),
});

export const TravelInformationPostRequestSchema = TravelInformationBaseSchema.extend({
  visaCategory: z.nativeEnum(VisaOptions).openapi({
    description: "Visa Option",
  }),
});

export const TravelInformationResponseSchema = TravelInformationPostRequestSchema.extend({
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

export const TravelInformationPutRequestSchema = TravelInformationBaseSchema.extend({
  visaCategory: z.nativeEnum(VisaOptions).optional().openapi({
    description: "Visa Option",
  }),
});
export const TravelInformationPutResponseSchema = TravelInformationPutRequestSchema.extend({
  applicationId: z.string().openapi({
    description: "ID of application",
  }),
  dateUpdated: z.string().date().openapi({
    description: "Updated Date in UTC timezone",
  }),
});

export const MedicalScreeningBaseSchema = z.object({
  dateOfMedicalScreening: z.string().date().openapi({
    description: "Date of medical screening in ISO format",
  }),
  age: z.number().openapi({
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
  isXrayRequired: z.nativeEnum(YesOrNo).openapi({
    description: "Is X-ray required?",
  }),
  reasonXrayNotRequired: z.string().optional().openapi({
    description: "Further details on why X-ray was not required",
  }),
});

export const MedicalScreeningChestXRayRequiredRequestSchema = MedicalScreeningBaseSchema.extend({
  isXrayRequired: z.literal(YesOrNo.Yes).openapi({
    description: "Is X-ray required?",
  }),
});
export const MedicalScreeningChestXRayNotRequiredRequestSchema = MedicalScreeningBaseSchema.extend({
  isXrayRequired: z.literal(YesOrNo.No).openapi({
    description: "Is X-ray required?",
  }),
  reasonXrayNotRequired: z.nativeEnum(ChestXRayNotTakenReason).openapi({
    description: "Reason X-ray was not required",
  }),
  reasonXrayNotRequiredFurtherDetails: z.string().optional().openapi({
    description: "Further details on why X-ray was not required",
  }),
});

export const MedicalScreeningRequestSchema = z.union([
  MedicalScreeningChestXRayRequiredRequestSchema,
  MedicalScreeningChestXRayNotRequiredRequestSchema,
]);

export const MedicalScreeningXrayRequiredResponseSchema =
  MedicalScreeningChestXRayRequiredRequestSchema.extend({
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

export const MedicalScreeningXrayNotRequiredResponseSchema =
  MedicalScreeningChestXRayNotRequiredRequestSchema.extend({
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
export const MedicalScreeningResponseSchema = z.union([
  MedicalScreeningXrayRequiredResponseSchema,
  MedicalScreeningXrayNotRequiredResponseSchema,
]);

export const TbCertificateIssuedRequestSchema = z.object({
  isIssued: z.literal(YesOrNo.Yes),
  clinicName: z.string().openapi({
    description: "Clinic Name",
  }),
  physicianName: z.string().openapi({
    description: "Physician's Name",
  }),
  comments: z.string().optional().openapi({
    description: "Physician's comments",
  }),
  issueDate: z.string().date().openapi({
    description: "Date of certificate issue in ISO format",
  }),
  expiryDate: z.string().date().openapi({
    description: "Date of certificate expiry in ISO format",
  }),
  certificateNumber: z.string().openapi({
    description: "Clearance certificate number",
  }),
  referenceNumber: z.string().openapi({
    description: "Reference number(Application Id)",
  }),
});

export const TbCertificateNotIssuedRequestSchema = z.object({
  isIssued: z.literal(YesOrNo.No),
  clinicName: z.string().openapi({
    description: "Clinic Name",
  }),
  physicianName: z.string().openapi({
    description: "Physician's Name",
  }),
  comments: z.string().optional().openapi({
    description: "Physician's comments",
  }),
  notIssuedReason: z.nativeEnum(TBCertNotIssuedReason).openapi({
    description: "Clearance certificate not issued reason",
  }),
  referenceNumber: z.string().openapi({
    description: "Reference number(Application Id)",
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
  reasonXrayWasNotTaken: z.string().openapi({
    description: "Reason X-ray was not taken",
  }),
  xrayWasNotTakenFurtherDetails: z.string().optional().openapi({
    description: "Further details on why X-ray was not taken",
  }),
});

export const ChestXRayRequestSchema = z.object({
  dateXrayTaken: z.string().or(z.date()).openapi({
    description: "Date when the xray was taken (in ISO format)",
  }),
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
});

export const ChestXRayResponseSchema = ChestXRayRequestSchema.extend({
  dateCreated: z.string().date().openapi({
    description: "Creation Date in UTC timezone",
  }),
  status: z.nativeEnum(TaskStatus).openapi({
    description: "Status of Task",
  }),
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

export const SputumSampleSchema = z.object({
  dateOfSample: z.string().or(z.date()).openapi({
    description: "Date of Sputum Sample Collection",
  }),
  collectionMethod: z.nativeEnum(SputumCollectionMethod).openapi({
    description: "Collection Method of Sputum Sample",
  }),
  smearResult: z.nativeEnum(SmearAndCultureResultOptions).optional().openapi({
    description: "Smear Result",
  }),
  cultureResult: z.nativeEnum(SmearAndCultureResultOptions).optional().openapi({
    description: "Culture Result",
  }),
  dateUpdated: z.string().or(z.date()).openapi({
    description: "Updated Date in UTC timezone",
  }),
});

export const SputumSampleCompletionSchema = z.object({
  dateOfSample: z.string().or(z.date()),
  collectionMethod: z.nativeEnum(SputumCollectionMethod),
  smearResult: z.nativeEnum(SmearAndCultureResultOptions),
  cultureResult: z.nativeEnum(SmearAndCultureResultOptions),
  dateUpdated: z.string().or(z.date()),
});

export const SputumSampleCompletionCheckSchema = z.object({
  samples: z.object({
    sample1: SputumSampleCompletionSchema,
    sample2: SputumSampleCompletionSchema,
    sample3: SputumSampleCompletionSchema,
  }),
});

export const SputumRequestSchema = z.object({
  sputumSamples: z
    .object({
      sample1: SputumSampleSchema.optional().openapi({ description: "Details of Sputum Sample 1" }),
      sample2: SputumSampleSchema.optional().openapi({ description: "Details of Sputum Sample 2" }),
      sample3: SputumSampleSchema.optional().openapi({ description: "Details of Sputum Sample 3" }),
    })
    .openapi({
      description: "Sputum Sample details",
    }),
  version: z.number().optional().openapi({
    description: "Version Number for concurrency Control",
  }), // for concurrency control
});

export const SputumResponseSchema = SputumRequestSchema.extend({
  applicationId: z.string().openapi({
    description: "ID of application",
  }),
  dateCreated: z.string().date().openapi({
    description: "Creation Date in UTC timezone",
  }),
  dateUpdated: z.string().date().openapi({
    description: "Updated Date in UTC timezone",
  }),
  status: z.nativeEnum(TaskStatus).openapi({
    description: "Status of Task",
  }),
});

export const RadiologicalOutcomeRequestSchema = z.object({
  xrayResult: z.string().openapi({ description: "X ray result" }),
  xrayResultDetail: z.string().openapi({ description: "X ray result details" }),
  xrayMinorFindings: z.array(z.string()).openapi({
    description: "Minor findings",
  }),
  xrayAssociatedMinorFindings: z.array(z.string()).openapi({
    description: "Associated Minor Findings",
  }),
  xrayActiveTbFindings: z.array(z.string()).openapi({
    description: "Active TB Findings",
  }),
});

export const RadiologicalOutcomeResponseSchema = RadiologicalOutcomeRequestSchema.extend({
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

export const SputumDecisionRequestSchema = z.object({
  sputumRequired: z.nativeEnum(YesOrNo).openapi({ description: "Sputum required: yes/no" }),
});

export const SputumDecisionResponseSchema = SputumDecisionRequestSchema.extend({
  applicationId: z.string().openapi({ description: "ID of application" }),
  dateCreated: z.string().date().openapi({ description: "Creation Date in UTC timezone" }),
  status: z.nativeEnum(TaskStatus).openapi({ description: "Status of Task" }),
});

export const ApplicationSchema = z.object({
  applicationId: z.string().openapi({
    description: "application id",
  }),
  status: z.nativeEnum(ApplicationStatus).openapi({
    description: "Application current status",
  }),
  cancellationReason: z.string().optional().openapi({
    description: "Reason for application cancelling",
  }),
  expiryDate: z.date().openapi({
    description: "The date when the certificate expires",
  }),
  applicantPhotoUrl: z.string().openapi({
    description: "Presigned Url for applicant Photo",
  }),
  travelInformation: TravelInformationResponseSchema,
  medicalScreening: MedicalScreeningResponseSchema,
  chestXray: ChestXRayResponseSchema,
  radiologicalOutcome: RadiologicalOutcomeResponseSchema,
  sputumDecision: SputumDecisionResponseSchema,
  sputumDetails: SputumResponseSchema,
  tbCertificate: TbCertificateResponseSchema,
});
