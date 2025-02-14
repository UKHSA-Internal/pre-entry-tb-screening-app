import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import {
  HistoryOfConditionsUnder11,
  MenstrualPeriods,
  PregnancyStatus,
  ProgressStatus,
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
  ukAddressLine1: z.string().openapi({
    description: "First line of Travel Address",
  }),
  ukAddressLine2: z.string().optional().openapi({
    description: "Second line of Travel Address",
  }),
  ukAddressPostcode: z.string().openapi({
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
  status: z.nativeEnum(ProgressStatus).openapi({
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
  physicalExaminationConducted: z.string().openapi({
    description: "Notes from Physical Examination",
  }),
});

export const MedicalScreeningResponseSchema = MedicalScreeningRequestSchema.extend({
  dateCreated: z.string().date().openapi({
    description: "Creation Date in UTC timezone",
  }),
  status: z.nativeEnum(ProgressStatus).openapi({
    description: "Status of Task",
  }),
});

export const ApplicationSchema = z.object({
  applicationId: z.string().openapi({
    description: "application id",
  }),
  travelInformation: TravelInformationResponseSchema,
  MedicalScreening: MedicalScreeningResponseSchema,
});
