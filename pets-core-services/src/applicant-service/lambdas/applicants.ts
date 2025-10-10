import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { boostrapLambdaRoutes } from "../../shared/bootstrap";
import { CountryCode } from "../../shared/country";
import { PetsRoute } from "../../shared/types";
import { postApplicantHandler } from "../handlers/postApplicant";
import { searchApplicantHandler } from "../handlers/searchApplicant";
import { updateApplicantHandler } from "../handlers/updateApplicant";
import {
  ApplicantRequestSchema,
  ApplicantResponseSchema,
  ApplicantUpdateRequestSchema,
  ApplicantUpdateResponseSchema,
} from "../types/zod-schema";

extendZodWithOpenApi(z);

export const routes: PetsRoute[] = [
  {
    method: "POST",
    path: "/applicant/register/{applicationId}",
    handler: postApplicantHandler,
    requestBodySchema: ApplicantRequestSchema.openapi({
      description: "Details about an Applicant",
    }),
    responseSchema: ApplicantResponseSchema.openapi({ description: "Saved Applicant Details" }),
  },
  {
    method: "PUT",
    path: "/applicant/update/{applicationId}",
    handler: updateApplicantHandler,
    requestBodySchema: ApplicantUpdateRequestSchema.openapi({
      description: "Details about an Applicant",
    }),
    responseSchema: ApplicantUpdateResponseSchema.openapi({
      description: "Updated Applicant Details",
    }),
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
      ApplicantResponseSchema.openapi("Applicant", {
        description: "Details about an Applicant",
      }),
    ),
  },
];

export const handler = boostrapLambdaRoutes(routes);
