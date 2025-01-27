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
  countryOfIssue: z.boolean().openapi({
    description: "Passport Issue Country",
  }),
});
