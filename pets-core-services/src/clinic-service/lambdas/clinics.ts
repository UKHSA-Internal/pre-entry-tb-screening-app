import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import middy from "@middy/core";
import httpRouterHandler from "@middy/http-router";
import { APIGatewayEvent } from "aws-lambda";
import { z } from "zod";

import { getEnvironmentVariable } from "../../shared/config";
import { PetsRoute } from "../../shared/types";
import { SwaggerConfig } from "../../swagger-generator/types";
import { createClinicHandler } from "../handlers/createClinic";
import { fetchClinicsHandler } from "../handlers/fetchClinics";
import { getClinicHandler } from "../handlers/getClinic";
import { ClinicSchema } from "../types/zod-schema";

extendZodWithOpenApi(z);
// TODO: Add middlewares for validating request and response

const routes: PetsRoute[] = [
  {
    method: "POST",
    path: "/v1/clinic/{clinicId}",
    handler: createClinicHandler,
    requestBodySchema: ClinicSchema.openapi({ description: "Clinic details to be saved in DB" }),
    responseSchema: ClinicSchema.openapi({ description: "Saved Clinic Details" }),
  },
  {
    method: "GET",
    path: "/v1/clinic/{clinicId}",
    handler: getClinicHandler,
    responseSchema: ClinicSchema.openapi({ description: "Clinic Details" }),
  },

  {
    method: "GET",
    path: "/v1/clinic",
    handler: fetchClinicsHandler,
    responseSchema: z
      .array(ClinicSchema)
      .openapi("AllClinic", { description: "List of all registered clinics" }),
    queryParams: {
      country: z
        .string({ description: "When specified, returns only clinics in Country" })
        .optional(),
    },
  },
];

export const swaggerConfig: SwaggerConfig = {
  lambdaArn: getEnvironmentVariable("CLINIC_SERVICE_LAMBDA"),
  routes,
  tags: ["Clinic Service Endpoints"],
};

export const handler = middy<APIGatewayEvent>().handler(httpRouterHandler(routes));
