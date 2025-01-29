import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import middy from "@middy/core";
import httpRouterHandler from "@middy/http-router";
import { APIGatewayEvent } from "aws-lambda";
import { z } from "zod";

import { PetsRoute } from "../../shared/types";
import { createClinicHandler } from "../handlers/createClinic";
import { fetchClinicsHandler } from "../handlers/fetchClinics";
import { getClinicHandler } from "../handlers/getClinic";
import { ClinicSchema } from "../types/zod-schema";

extendZodWithOpenApi(z);
// TODO: Add middlewares for validating request and response

export const routes: PetsRoute[] = [
  {
    method: "POST",
    path: "/clinic/{clinicId}",
    handler: createClinicHandler,
    requestBodySchema: ClinicSchema.openapi({ description: "Clinic details to be saved in DB" }),
    responseSchema: ClinicSchema.openapi({ description: "Saved Clinic Details" }),
  },
  {
    method: "GET",
    path: "/clinic/{clinicId}",
    handler: getClinicHandler,
    responseSchema: ClinicSchema.openapi({ description: "Clinic Details" }),
  },

  {
    method: "GET",
    path: "/clinic",
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

export const handler = middy<APIGatewayEvent>().handler(httpRouterHandler(routes));
