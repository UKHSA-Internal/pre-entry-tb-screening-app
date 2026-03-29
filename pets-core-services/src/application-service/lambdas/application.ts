import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import middy from "@middy/core";
import { z } from "zod";

import { boostrapLambdaRoutes } from "../../shared/bootstrap";
import { validateClinicAndApplication } from "../../shared/middlewares/application-clinic-validation";
import { PetsAPIGatewayProxyEvent, PetsRoute } from "../../shared/types";
import { cancelApplicationHandler } from "../handlers/cancel-application";
import { createApplicationHandler } from "../handlers/create-application";
import { generateImageUploadUrlHandler } from "../handlers/generate-image-upload-url";
import { getApplicationHandler } from "../handlers/get-application";
import { getApplicationsHandler } from "../handlers/get-applications";
import { saveChestXRayHandler } from "../handlers/save-chest-ray";
import { saveMedicalScreeningHandler } from "../handlers/save-medical-screening";
import { saveRadiologicalOutcomeHandler } from "../handlers/save-radiological-outcome";
import { saveSputumDecisionHandler } from "../handlers/save-sputum-decision";
import { saveSputumDetailsHandler } from "../handlers/save-sputum-details";
import { saveTbCertificateHandler } from "../handlers/save-tb-certificate";
import { saveTravelInformationHandler as createTravelInformationHandler } from "../handlers/save-travel-information";
import { updateTravelInformationHandler } from "../handlers/update-travel-information";
import { setApplicationIdContext } from "../middlewares/application-logger-context";
import { YesOrNo } from "../types/enums";
import {
  ApplicationSchema,
  CancelApplicationRequestSchema,
  ChestXRayRequestSchema,
  ChestXRayResponseSchema,
  CreateApplicationRequestSchema,
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
  TravelInformationPutRequestSchema,
  TravelInformationPutResponseSchema,
  TravelInformationResponseSchema,
} from "../types/zod-schema";

extendZodWithOpenApi(z);

export const routes: PetsRoute[] = [
  {
    method: "POST",
    path: "/application",
    handler: createApplicationHandler,
    requestBodySchema: CreateApplicationRequestSchema.openapi({
      description: "Application Details",
    }),
    responseSchema: CreateApplicationResponseSchema,
  },
  {
    method: "GET",
    path: "/application/{applicationId}",
    handler: middy<PetsAPIGatewayProxyEvent>()
      .before(setApplicationIdContext)
      .before(validateClinicAndApplication)
      .handler(getApplicationHandler),
    responseSchema: ApplicationSchema.openapi({
      description: "Application Details",
    }),
  },
  {
    method: "PUT",
    path: "/application/{applicationId}/cancel",
    handler: middy<PetsAPIGatewayProxyEvent>()
      .before(setApplicationIdContext)
      .before(validateClinicAndApplication)
      .handler(cancelApplicationHandler),
    requestBodySchema: CancelApplicationRequestSchema.openapi({
      description: "Application status details",
    }),
    responseSchema: ApplicationSchema.openapi({
      description: "Updated application status details",
    }),
  },
  {
    method: "POST",
    path: "/application/{applicationId}/travel-information",
    handler: middy<PetsAPIGatewayProxyEvent>()
      .before(setApplicationIdContext)
      .before(validateClinicAndApplication)
      .handler(createTravelInformationHandler),
    requestBodySchema: TravelInformationPostRequestSchema.openapi({
      description: "Travel Details of an Applicant",
    }),
    responseSchema: TravelInformationResponseSchema.openapi({
      description: "Saved Travel Information Details",
    }),
  },
  {
    method: "PUT",
    path: "/application/{applicationId}/travel-information",
    handler: middy<PetsAPIGatewayProxyEvent>()
      .before(setApplicationIdContext)
      .before(validateClinicAndApplication)
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
      .before(validateClinicAndApplication)
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
      .before(validateClinicAndApplication)
      .handler(saveChestXRayHandler),
    queryParams: {
      requireValidation: z.nativeEnum(YesOrNo, {
        description: "Disable Validation if set as No",
      }),
    },
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
      .before(validateClinicAndApplication)
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
      .before(validateClinicAndApplication)
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
      .before(validateClinicAndApplication)
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
      .before(validateClinicAndApplication)
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
      .before(validateClinicAndApplication)
      .handler(saveSputumDetailsHandler),
    requestBodySchema: SputumRequestSchema.openapi({
      description: "Sputum Collection and Testing Details of Applicant",
    }),
    responseSchema: SputumResponseSchema.openapi({
      description: "Saved Sputum Details of Applicant",
    }),
  },
  {
    method: "GET",
    path: "/applications/",
    handler: middy<PetsAPIGatewayProxyEvent>().handler(getApplicationsHandler),
    responseSchema: ApplicationSchema.openapi({
      description: "All in progress applications  root records for a given clinic",
    }),
  },
];

export const handler = boostrapLambdaRoutes(routes);
