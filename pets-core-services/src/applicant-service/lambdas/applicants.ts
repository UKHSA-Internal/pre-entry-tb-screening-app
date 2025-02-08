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
import { getApplicantHandler } from "../handlers/getApplicant";
import { postApplicantHandler } from "../handlers/postApplicant";
import { ApplicantSchema } from "../types/zod-schema";

extendZodWithOpenApi(z);

export const routes: PetsRoute[] = [
  {
    method: "POST",
    path: "/applicant/register",
    handler: postApplicantHandler,
    requestBodySchema: ApplicantSchema.openapi({ description: "Details about an Applicant" }),
    responseSchema: ApplicantSchema.openapi({ description: "Saved Applicant Details" }),
  },
  {
    method: "GET",
    path: "/applicant",
    handler: getApplicantHandler,
    headers: {
      passportnumber: z.string({ description: "Passport Number of Applicant" }),
      countryofissue: z.string({ description: "Country of Issue" }),
    },
    responseSchema: ApplicantSchema.openapi("Applicant", {
      description: "Details about an Applicant",
    }),
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
