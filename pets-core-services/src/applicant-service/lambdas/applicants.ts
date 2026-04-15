import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import middy from "@middy/core";
import { z } from "zod";

import { boostrapLambdaRoutes } from "../../shared/bootstrap";
import { CountryCode } from "../../shared/country";
import { validateClinicAndApplication } from "../../shared/middlewares/application-clinic-validation";
import { PetsAPIGatewayProxyEvent, PetsRoute } from "../../shared/types";
import { postApplicantHandler } from "../handlers/postApplicant";
import { searchApplicantHandler } from "../handlers/searchApplicant";
import { updateApplicantHandler } from "../handlers/updateApplicant";
import {
  ApplicantRegisterRequestSchema,
  ApplicantResponseSchema,
  ApplicantSearchResponseSchema,
  ApplicantUpdateRequestSchema,
  ApplicantUpdateResponseSchema,
} from "../types/zod-schema";

extendZodWithOpenApi(z);

export const routes: PetsRoute[] = [
  {
    method: "POST",
    path: "/applicant/register/{applicationId}",
    handler: middy<PetsAPIGatewayProxyEvent>()
      .before(validateClinicAndApplication)
      .handler(postApplicantHandler),
    requestBodySchema: ApplicantRegisterRequestSchema.openapi({
      description: "Details about an Applicant",
    }),
    responseSchema: ApplicantResponseSchema.openapi({ description: "Saved Applicant Details" }),
  },
  {
    method: "PUT",
    path: "/applicant/update/{applicationId}",
    handler: middy<PetsAPIGatewayProxyEvent>()
      .before(validateClinicAndApplication)
      .handler(updateApplicantHandler),
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
    responseSchema: ApplicantSearchResponseSchema.openapi("Applicant", {
      description: "Details about an Applicant",
    }),
  },
];

export const handler = boostrapLambdaRoutes(routes);
