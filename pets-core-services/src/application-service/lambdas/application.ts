import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import middy from "@middy/core";
import { z } from "zod";

import { boostrapLambdaRoutes } from "../../shared/http";
import { PetsAPIGatewayProxyEvent, PetsRoute } from "../../shared/types";
import { createApplicationHandler } from "../handlers/create-application";
import { generateUploadUrlHandler } from "../handlers/generate-upload-url";
import { getApplicationHandler } from "../handlers/get-application";
import { saveChestXRayHandler } from "../handlers/save-chest-ray";
import { saveMedicalScreeningHandler } from "../handlers/save-medical-screening";
import { saveTbCertificateHandler } from "../handlers/save-tb-certificate";
import { saveTravelInformationHandler } from "../handlers/save-travel-information";
import { setApplicationIdContext } from "../middlewares/application-logger-context";
import { validateApplication } from "../middlewares/application-validation";
import {
  ApplicationSchema,
  ChestXRayRequestSchema,
  ChestXRayResponseSchema,
  CreateApplicationResponseSchema,
  DicomUploadUrlRequestSchema,
  DicomUploadUrlResponseSchema,
  MedicalScreeningRequestSchema,
  MedicalScreeningResponseSchema,
  TbCertificateRequestSchema,
  TbCertificateResponseSchema,
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
      .handler(saveTravelInformationHandler),
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
    path: "/application/{applicationId}/generate-dicom-upload-url",
    handler: middy<PetsAPIGatewayProxyEvent>()
      .before(setApplicationIdContext)
      .before(validateApplication)
      .handler(generateUploadUrlHandler),
    requestBodySchema: DicomUploadUrlRequestSchema.openapi({
      description: "Details of the Dicom to be uploaded",
    }),
    responseSchema: DicomUploadUrlResponseSchema.openapi({
      description: "The upload url",
    }),
  },
];

export const handler = boostrapLambdaRoutes(routes);
