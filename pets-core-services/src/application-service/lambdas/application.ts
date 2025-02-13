import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { boostrapLambdaRoutes } from "../../shared/http";
import { PetsRoute } from "../../shared/types";
import { createApplicationHandler } from "../handlers/create-application";
import { getApplicationHandler } from "../handlers/get-application";
import { saveMedicalScreening } from "../handlers/save-medical-screening";
import { saveTravelInformationHandler } from "../handlers/save-travel-information";
import {
  ApplicationSchema,
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
