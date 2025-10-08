import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { boostrapLambdaRoutes } from "../../shared/bootstrap";
import { CountryCode } from "../../shared/country";
import { PetsRoute } from "../../shared/types";
import { putApplicantHandler } from "../handlers/putApplicant";
import { searchApplicantHandler } from "../handlers/searchApplicant";
import { ApplicantSchema } from "../types/zod-schema";

extendZodWithOpenApi(z);

export const routes: PetsRoute[] = [
  {
    method: "PUT",
    path: "/applicant/register/{applicationId}",
    handler: putApplicantHandler,
    requestBodySchema: ApplicantSchema.openapi({ description: "Details about an Applicant" }),
    responseSchema: ApplicantSchema.extend({
      applicationId: z.string().openapi({
        description: "Unique Application ID for applicant",
      }),
    }).openapi({ description: "Saved Applicant Details" }),
  },
  {
    method: "GET",
    path: "/applicant/search",
    handler: searchApplicantHandler,
    headers: {
      passportnumber: z.string({ description: "Passport Number of Applicant" }),
      countryofissue: z.nativeEnum(CountryCode).openapi({
        description: "Passport Issue Country",
      }),
    },
    responseSchema: z.array(
      ApplicantSchema.openapi("Applicant", {
        description: "Details about an Applicant",
      }),
    ),
  },
];

export const handler = boostrapLambdaRoutes(routes);
