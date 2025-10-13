import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { CountryCode } from "../../shared/country";
import { AllowedSex } from "./enums";

extendZodWithOpenApi(z);

export const ApplicantRequestSchema = z.object({
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
  applicantHomeAddress2: z.string().optional().openapi({
    description: "Second line of Applicant's Address",
  }),
  applicantHomeAddress3: z.string().optional().openapi({
    description: "Third line of Applicant's Address",
  }),
  townOrCity: z.string(),
  provinceOrState: z.string(),
  postcode: z.string(),
  country: z.nativeEnum(CountryCode).openapi({
    description: "Country of Applican't Address",
  }),
});

export const ApplicantResponseSchema = ApplicantRequestSchema.extend({
  applicationId: z.string().openapi({
    description: "Unique Application ID for applicant",
  }),
});

export const ApplicantUpdateRequestSchema = z.object({
  fullName: z.string().optional().openapi({
    description: "Full name of Applicant",
  }),
  // It's requireq ATM
  passportNumber: z.string().optional().openapi({
    description: "PassportNumber of Applicant",
  }),
  countryOfNationality: z.nativeEnum(CountryCode).optional().openapi({
    description: "Applicant's nationality",
  }),
  // It's requireq ATM
  countryOfIssue: z.nativeEnum(CountryCode).optional().openapi({
    description: "Passport Issue Country",
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

export const ApplicantUpdateResponseSchema = ApplicantUpdateRequestSchema.extend({
  applicationId: z.string().openapi({
    description: "Unique Application ID for applicant",
  }),
  dateUpdated: z.string().date().optional().openapi({
    description: "Date of Birth in ISO Format",
  }),
  updatedBy: z.string().optional().openapi({
    description: "First line of Applicant's Address",
  }),
});
