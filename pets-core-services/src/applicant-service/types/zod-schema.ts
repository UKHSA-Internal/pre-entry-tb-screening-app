import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { CountryCode } from "../../shared/country";
import { AllowedSex } from "./enums";

extendZodWithOpenApi(z);

export const ApplicantSchema = z.object({
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
  townOrCity: z.string(),
  provinceOrState: z.string(),
  postcode: z.string(),
  country: z.nativeEnum(CountryCode).openapi({
    description: "Country of Applican't Address",
  }),
});
