import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const ApplicantSchema = z.object({
  fullName: z.string().openapi({
    description: "Full name of Applicant",
  }),
  passportNumber: z.string().openapi({
    description: "PassportNumber of Applicant",
  }),
  countryOfNationality: z.string().openapi({
    description: "Applicant's nationality",
  }),
  countryOfIssue: z.string().openapi({
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
  sex: z.string(),
  applicantHomeAddress1: z.string().openapi({
    description: "First line of Applicant's UK Address",
  }),
  applicantHomeAddress2: z.string().optional().openapi({
    description: "Second line of Applicant's UK Address",
  }),
  townOrCity: z.string(),
  country: z.string().optional(),
  postcode: z.string(),
});

// TODO: Eagle eyed viewer would notice applicant phone number and email is missing
