import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import middy from "@middy/core";
import { z } from "zod";

import { boostrapLambdaRoutes } from "../../shared/bootstrap";
import { PetsAPIGatewayProxyEvent, PetsRoute } from "../../shared/types";
import { createApplicationHandler } from "../handlers/create-application";
import { generateImageUploadUrlHandler } from "../handlers/generate-image-upload-url";
import { getApplicationHandler } from "../handlers/get-application";
import { saveChestXRayHandler } from "../handlers/save-chest-ray";
import { saveMedicalScreeningHandler } from "../handlers/save-medical-screening";
import { saveRadiologicalOutcomeHandler } from "../handlers/save-radiological-outcome";
import { saveSputumDecisionHandler } from "../handlers/save-sputum-decision";
import { saveSputumDetailsHandler } from "../handlers/save-sputum-details";
import { saveTbCertificateHandler } from "../handlers/save-tb-certificate";
import { saveTravelInformationHandler as createTravelInformationHandler } from "../handlers/save-travel-information";
import { updateTravelInformationHandler } from "../handlers/update-travel-information";
import { setApplicationIdContext } from "../middlewares/application-logger-context";
import { validateApplication } from "../middlewares/application-validation";
import {
  ApplicationSchema,
  ChestXRayRequestSchema,
  ChestXRayResponseSchema,
  CreateApplicationResponseSchema,
  ImageUploadUrlRequestSchema,
  ImageUploadUrlResponseSchema,
  MedicalScreeningRequestSchema,
  MedicalScreeningResponseSchema,
  RadiologicalOutcomeRequestSchema,
  RadiologicalOutcomeResponseSchema,
  SputumDecisionRequestSchema,
  SputumDecisionResponseSchema,
  SputumRequestSchema,
  SputumResponseSchema,
  TbCertificateRequestSchema,
  TbCertificateResponseSchema,
  TravelInformationPostRequestSchema,
  TravelInformationPostResponseSchema,
  TravelInformationPutRequestSchema,
  TravelInformationPutResponseSchema,
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
    handler: middy<PetsAPIGatewayProxyEvent>()
      .before(setApplicationIdContext)
      .handler(getApplicationHandler),
    responseSchema: ApplicationSchema.openapi({
      description: "Application Details",
    }),
  },
  {
    method: "POST",
    path: "/application/{applicationId}/travel-information",
    handler: middy<PetsAPIGatewayProxyEvent>()
      .before(setApplicationIdContext)
      .before(validateApplication)
      .handler(createTravelInformationHandler),
    requestBodySchema: TravelInformationPostRequestSchema.openapi({
      description: "Travel Details of an Applicant",
    }),
    responseSchema: TravelInformationPostResponseSchema.openapi({
      description: "Saved Travel Information Details",
    }),
  },
  {
    method: "PUT",
    path: "/application/{applicationId}/travel-information",
    handler: middy<PetsAPIGatewayProxyEvent>()
      .before(setApplicationIdContext)
      .before(validateApplication)
      .handler(updateTravelInformationHandler),
    requestBodySchema: TravelInformationPutRequestSchema.openapi({
      description: "Travel Details of an Applicant",
    }),
    responseSchema: TravelInformationPutResponseSchema.openapi({
      description: "Updated Travel Information Details",
    }),
  },
  {
    method: "POST",
    path: "/application/{applicationId}/medical-screening",
    handler: middy<PetsAPIGatewayProxyEvent>()
      .before(setApplicationIdContext)
      .before(validateApplication)
      .handler(saveMedicalScreeningHandler),
    requestBodySchema: MedicalScreeningRequestSchema.openapi({
      description: "Medical Screening Details of an Applicant",
    }),
    responseSchema: MedicalScreeningResponseSchema.openapi({
      description: "Saved Medical Screening Details",
    }),
  },
  {
    method: "POST",
    path: "/application/{applicationId}/chest-xray",
    handler: middy<PetsAPIGatewayProxyEvent>()
      .before(setApplicationIdContext)
      .before(validateApplication)
      .handler(saveChestXRayHandler),
    requestBodySchema: ChestXRayRequestSchema.openapi({
      description: "Chest Xray of an Applicant",
    }),
    responseSchema: ChestXRayResponseSchema.openapi({
      description: "Saved Chest Xray of an Applicant",
    }),
  },
  {
    method: "POST",
    path: "/application/{applicationId}/tb-certificate",
    handler: middy<PetsAPIGatewayProxyEvent>()
      .before(setApplicationIdContext)
      .before(validateApplication)
      .handler(saveTbCertificateHandler),
    requestBodySchema: TbCertificateRequestSchema.openapi({
      description: "TB Certificate Details of an Applicant",
    }),
    responseSchema: TbCertificateResponseSchema.openapi({
      description: "Saved TB Certificate Details",
    }),
  },
  {
    method: "POST",
    path: "/application/{applicationId}/radiological-outcome",
    handler: middy<PetsAPIGatewayProxyEvent>()
      .before(setApplicationIdContext)
      .before(validateApplication)
      .handler(saveRadiologicalOutcomeHandler),
    requestBodySchema: RadiologicalOutcomeRequestSchema.openapi({
      description: "Radiological Outcome of an Applicant",
    }),
    responseSchema: RadiologicalOutcomeResponseSchema.openapi({
      description: "Saved Radiological Outcome of an Applicant",
    }),
  },
  {
    method: "POST",
    path: "/application/{applicationId}/sputum-decision",
    handler: middy<PetsAPIGatewayProxyEvent>()
      .before(setApplicationIdContext)
      .before(validateApplication)
      .handler(saveSputumDecisionHandler),
    requestBodySchema: SputumDecisionRequestSchema.openapi({
      description: "Sputum Decision Details of an Applicant",
    }),
    responseSchema: SputumDecisionResponseSchema.openapi({
      description: "Sputum Decision Details",
    }),
  },
  {
    method: "PUT",
    path: "/application/{applicationId}/generate-image-upload-url",
    handler: middy<PetsAPIGatewayProxyEvent>()
      .before(setApplicationIdContext)
      .before(validateApplication)
      .handler(generateImageUploadUrlHandler),
    requestBodySchema: ImageUploadUrlRequestSchema.openapi({
      description: "Details of the Image to be uploaded",
    }),
    responseSchema: ImageUploadUrlResponseSchema.openapi({
      description: "The upload url",
    }),
  },
  {
    method: "PUT",
    path: "/application/{applicationId}/sputum-details",
    handler: middy<PetsAPIGatewayProxyEvent>()
      .before(setApplicationIdContext)
      .before(validateApplication)
      .handler(saveSputumDetailsHandler),
    requestBodySchema: SputumRequestSchema.openapi({
      description: "Sputum Collection and Testing Details of Applicant",
    }),
    responseSchema: SputumResponseSchema.openapi({
      description: "Saved Sputum Details of Applicant",
    }),
  },
];

export const handler = boostrapLambdaRoutes(routes);
