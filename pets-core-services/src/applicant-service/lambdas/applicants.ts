import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import middy from "@middy/core";
import httpRouterHandler from "@middy/http-router";
import { APIGatewayEvent } from "aws-lambda";
import { z } from "zod";

import { getEnvironmentVariable } from "../../shared/config";
import { PetsRoute } from "../../shared/types";
import { SwaggerConfig } from "../../swagger-generator/types";
import { getApplicantHandler } from "../handlers/getApplicant";
import { postApplicantHandler } from "../handlers/postApplicant";
import { ApplicantSchema } from "../types/zod-schema";

extendZodWithOpenApi(z);

const routes: PetsRoute[] = [
  {
    method: "POST",
    path: "/v1/applicant/register",
    handler: postApplicantHandler,
    requestBodySchema: ApplicantSchema.openapi({ description: "Details about an Applicant" }),
    responseSchema: ApplicantSchema.openapi({ description: "Saved Applicant Details" }),
  },
  {
    method: "GET",
    path: "/v1/applicant",
    handler: getApplicantHandler,
    headers: {
      passportNumber: z.string({ description: "Passport Number of Applicant" }),
      countryOfIssue: z.string({ description: "Country of Issue" }),
    },
    responseSchema: ApplicantSchema.openapi("Applicant", {
      description: "Details about an Applicant",
    }),
  },
];

export const swaggerConfig: SwaggerConfig = {
  lambdaArn: getEnvironmentVariable("APPLICANT_SERVICE_LAMBDA"),
  routes,
  tags: ["Applicant Service Endpoints"],
};

export const handler = middy<APIGatewayEvent>().handler(httpRouterHandler(routes));
