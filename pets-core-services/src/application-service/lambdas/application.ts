import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { boostrapLambdaRoutes } from "../../shared/http";
import { PetsRoute } from "../../shared/types";
import { retrieveApplicationHandler } from "../handlers/retrieve-application";
import { saveMedicalScreening } from "../handlers/save-medical-screening";
import { saveTravelInformationHandler } from "../handlers/save-travel-information";
import {
  ApplicationSchema,
  MedicalScreeningRequestSchema,
  MedicalScreeningResponseSchema,
  TravelInformationRequestSchema,
  TravelInformationResponseSchema,
} from "../types/zod-schema";

extendZodWithOpenApi(z);

export const routes: PetsRoute[] = [
  {
    method: "POST",
    path: "/application-details/travel-information",
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
    path: "/application-details/{applicationId}/medical-screening",
    handler: saveMedicalScreening,
    requestBodySchema: MedicalScreeningRequestSchema.openapi({
      description: "Medical Screening Details of an Applicant",
    }),
    responseSchema: MedicalScreeningResponseSchema.openapi({
      description: "Saved Medical Screening Details",
    }),
  },
  {
    method: "GET",
    path: "/application-details/{applicationId}",
    handler: retrieveApplicationHandler,
    responseSchema: ApplicationSchema.openapi({
      description: "Application Details",
    }),
  },
];

export const handler = boostrapLambdaRoutes(routes);
