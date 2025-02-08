import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import middy from "@middy/core";
import httpRouterHandler from "@middy/http-router";
import { APIGatewayProxyEvent } from "aws-lambda";
import { z } from "zod";

import { createHttpResponse } from "../../shared/http-response";
import { logger } from "../../shared/logger";
import { setRequestLoggingContext } from "../../shared/middlewares/logger";
import { validateRequest } from "../../shared/middlewares/validation";
import { PetsRoute } from "../../shared/types";
import { createClinicHandler } from "../handlers/createClinic";
import { fetchClinicsHandler } from "../handlers/fetchClinics";
import { getClinicHandler } from "../handlers/getClinic";
import { ClinicSchema } from "../types/zod-schema";
extendZodWithOpenApi(z);

export const routes: PetsRoute[] = [
  {
    method: "POST",
    path: "/clinics/{clinicId}",
    handler: createClinicHandler,
    requestBodySchema: ClinicSchema.openapi({ description: "Clinic details to be saved in DB" }),
    responseSchema: ClinicSchema.openapi({ description: "Saved Clinic Details" }),
  },
  {
    method: "GET",
    path: "/clinics/{clinicId}",
    handler: getClinicHandler,
    responseSchema: ClinicSchema.openapi({ description: "Clinic Details" }),
  },
  {
    method: "GET",
    path: "/clinics",
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

const notFoundResponse = ({ method, path }: { method: string; path: string }) => {
  logger.error({ method, path }, "Missing Handler");
  return createHttpResponse(404, "Not Found");
};

const middyRoutes = routes.map((route) => ({
  ...route,
  handler: middy()
    .use(
      validateRequest({
        requestSchema: route.requestBodySchema,
        queryStringParametersSchema: route.queryParams,
        headersSchema: route.headers,
      }),
    )
    .handler(route.handler),
}));

export const handler = middy<APIGatewayProxyEvent>()
  .before(setRequestLoggingContext)
  .handler(httpRouterHandler({ routes: middyRoutes, notFoundResponse }));
