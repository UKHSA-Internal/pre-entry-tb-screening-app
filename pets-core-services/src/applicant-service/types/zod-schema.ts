import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { CountryCode } from "../../shared/country";
import { TaskStatus } from "../../shared/types/enum";
import { AllowedSex } from "./enums";

extendZodWithOpenApi(z);

export const ApplicantBaseSchema = z.object({
  fullName: z.string().optional().openapi({
    description: "Full name of Applicant",
  }),
  countryOfNationality: z.nativeEnum(CountryCode).optional().openapi({
    description: "Applicant's nationality",
  }),
  issueDate: z.string().date().optional().openapi({
    description: "Passport Issue Date in ISO Format",
  }),
  expiryDate: z.string().date().optional().openapi({
    description: "Passport Expiry Date in ISO Format",
  }),
  dateOfBirth: z.string().date().optional().openapi({
    description: "Date of Birth in ISO Format",
  }),
  sex: z.nativeEnum(AllowedSex).optional().openapi({
    description: "Applicant's Sex Information",
  }),
  applicantHomeAddress1: z.string().optional().openapi({
    description: "First line of Applicant's Address",
  }),
  applicantHomeAddress2: z.string().optional().openapi({
    description: "Second line of Applicant's Address",
  }),
  applicantHomeAddress3: z.string().optional().openapi({
    description: "Third line of Applicant's Address",
  }),
  townOrCity: z.string().optional(),
  provinceOrState: z.string().optional(),
  postcode: z.string().optional(),
  country: z.nativeEnum(CountryCode).optional().openapi({
    description: "Country of Applican't Address",
  }),
});

export const ApplicantRegisterRequestSchema = ApplicantBaseSchema.extend({
  fullName: z.string().openapi({
    description: "Full name of Applicant",
  }),
  passportNumber: z.string().openapi({
    description: "PassportNumber of Applicant",
  }),
  countryOfNationality: z.nativeEnum(CountryCode).openapi({
    description: "Applicant's nationality",
  }),
  countryOfIssue: z.nativeEnum(CountryCode).openapi({
    description: "Passport Issue Country",
  }),
  issueDate: z.string().date().openapi({
    description: "Passport Issue Date in ISO Format",
  }),
  expiryDate: z.string().date().openapi({
    description: "Passport Expiry Date in ISO Format",
  }),
  dateOfBirth: z.string().date().openapi({
    description: "Date of Birth in ISO Format",
  }),
  sex: z.nativeEnum(AllowedSex).openapi({
    description: "Applicant's Sex Information",
  }),
  applicantHomeAddress1: z.string().openapi({
    description: "First line of Applicant's Address",
  }),
  townOrCity: z.string(),
  provinceOrState: z.string(),
  postcode: z.string(),
  country: z.nativeEnum(CountryCode).openapi({
    description: "Country of Applicant's Address",
  }),
});

export const ApplicantResponseSchema = ApplicantRegisterRequestSchema.extend({
  applicationId: z.string().openapi({
    description: "Unique Application ID for applicant",
  }),
  dateCreated: z.string().date().openapi({
    description: "Creation Date in UTC timezone",
  }),
  status: z.nativeEnum(TaskStatus).openapi({
    description: "Status of Task",
  }),
});

export const ApplicantUpdateRequestSchema = ApplicantBaseSchema;

export const ApplicantUpdateResponseSchema = ApplicantUpdateRequestSchema.extend({
  applicationId: z.string().openapi({
    description: "Unique Application ID for applicant",
  }),
  dateUpdated: z.string().date().optional().openapi({
    description: "Date of Birth in ISO Format",
  }),
});
