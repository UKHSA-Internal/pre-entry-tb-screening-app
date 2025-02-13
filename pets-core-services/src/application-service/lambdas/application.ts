import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { CountryCode } from "../../shared/country";
import { boostrapLambdaRoutes } from "../../shared/http";
import { PetsRoute } from "../../shared/types";
import { createApplicationHandler } from "../handlers/create-application";
import { getApplicationHandler } from "../handlers/get-application";
import { saveMedicalScreening } from "../handlers/save-medical-screening";
import { saveTravelInformationHandler } from "../handlers/save-travel-information";
import { searchApplicationByPassportHandler } from "../handlers/search-application";
import {
  ApplicationSchema,
  CreateApplicationRequestSchema,
  CreateApplicationResponseSchema,
  MedicalScreeningRequestSchema,
  MedicalScreeningResponseSchema,
  TravelInformationRequestSchema,
  TravelInformationResponseSchema,
} from "../types/zod-schema";

extendZodWithOpenApi(z);

export const routes: PetsRoute[] = [
  {
    method: "POST",
    path: "/application",
    handler: createApplicationHandler,
    requestBodySchema: CreateApplicationRequestSchema,
    responseSchema: CreateApplicationResponseSchema,
  },
  {
    method: "GET",
    path: "/application/{applicationId}",
    handler: getApplicationHandler,
    responseSchema: ApplicationSchema.openapi({
      description: "Application Details",
    }),
  },
  {
    method: "GET",
    path: "/application/search/passportDetails",
    handler: searchApplicationByPassportHandler,
    headers: {
      passportnumber: z.string({ description: "Passport Number of Applicant" }),
      countryofissue: z.nativeEnum(CountryCode).openapi({
        description: "Passport Issue Country",
      }),
    },
    responseSchema: z.array(
      ApplicationSchema.openapi({
        description: "Application Details",
      }),
    ),
  },
  {
    method: "POST",
    path: "/application/{applicationId}/travel-information",
    handler: saveTravelInformationHandler,
    requestBodySchema: TravelInformationRequestSchema.openapi({
      description: "Travel Details of an Applicant",
    }),
    responseSchema: TravelInformationResponseSchema.openapi({
      description: "Saved Travel Information Details",
    }),
  },
  {
    method: "POST",
    path: "/application/{applicationId}/medical-screening",
    handler: saveMedicalScreening,
    requestBodySchema: MedicalScreeningRequestSchema.openapi({
      description: "Medical Screening Details of an Applicant",
    }),
    responseSchema: MedicalScreeningResponseSchema.openapi({
      description: "Saved Medical Screening Details",
    }),
  },
];

export const handler = boostrapLambdaRoutes(routes);
