import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { CountryCode } from "../../shared/country";
import { boostrapLambdaRoutes } from "../../shared/http";
import { PetsRoute } from "../../shared/types";
import { getApplicantHandler } from "../handlers/getApplicant";
import { postApplicantHandler } from "../handlers/postApplicant";
import { ApplicantSchema } from "../types/zod-schema";

extendZodWithOpenApi(z);

export const routes: PetsRoute[] = [
  {
    method: "POST",
    path: "/applicant/register",
    handler: postApplicantHandler,
    requestBodySchema: ApplicantSchema.openapi({ description: "Details about an Applicant" }),
    responseSchema: ApplicantSchema.openapi({ description: "Saved Applicant Details" }),
  },
  {
    method: "GET",
    path: "/applicant",
    handler: getApplicantHandler,
    headers: {
      passportnumber: z.string({ description: "Passport Number of Applicant" }),
      countryofissue: z.nativeEnum(CountryCode).openapi({
        description: "Passport Issue Country",
      }),
    },
    responseSchema: ApplicantSchema.openapi("Applicant", {
      description: "Details about an Applicant",
    }),
  },
];

export const handler = boostrapLambdaRoutes(routes);
