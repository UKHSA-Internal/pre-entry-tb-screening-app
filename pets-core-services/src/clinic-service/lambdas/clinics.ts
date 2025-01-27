import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import middy from "@middy/core";
import httpRouterHandler from "@middy/http-router";
import { APIGatewayEvent } from "aws-lambda";
import { z } from "zod";

import { PetsRoute } from "../../shared/types";
import { SwaggerConfig } from "../../swagger-generator/types";
import { fetchClinicsHandler } from "../handlers/fetchClinics";
import { getClinicHandler } from "../handlers/getClinic";

extendZodWithOpenApi(z);

const ClinicSchema = z
  .object({
    clinicId: z.string().openapi({
      description: "ID of the Clinic",
    }),
    clinicName: z.string().openapi({
      description: "Name of the Clinic",
    }),
    iom: z.boolean().openapi({
      description: "Is the Clinic an IOM clinic",
    }),
  })
  .openapi("Clinic", { description: "Details about a Clinic" });

const routes: PetsRoute[] = [
  {
    method: "GET",
    path: "/v1/clinic",
    handler: fetchClinicsHandler,
    responseSchema: z
      .array(ClinicSchema)
      .openapi("AllClinic", { description: "List of all registered clinics" }),
  },
  {
    method: "GET",
    path: "/v1/clinic/{id}",
    handler: getClinicHandler,
    responseSchema: ClinicSchema,
  },
];

export const swaggerConfig: SwaggerConfig = {
  lambdaArn: "",
  routes,
};

export const handler = middy<APIGatewayEvent>().handler(httpRouterHandler(routes));
