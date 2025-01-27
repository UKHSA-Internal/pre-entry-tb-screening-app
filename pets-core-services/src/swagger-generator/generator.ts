import {
  extendZodWithOpenApi,
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";
import { Method } from "@middy/http-router";
import { writeFileSync } from "fs";
import { z } from "zod";

import { errorResponses } from "./error-response";
import { SwaggerConfig } from "./types";
extendZodWithOpenApi(z);

const methodMap: Record<Exclude<Method, "ANY">, Exclude<Lowercase<Method>, "any">> = {
  GET: "get",
  POST: "post",
  PUT: "put",
  PATCH: "patch",
  DELETE: "delete",
  OPTIONS: "options",
  HEAD: "head",
};

const registerSwaggerConfig = (registry: OpenAPIRegistry, config: SwaggerConfig) => {
  const { routes } = config;
  for (const route of routes) {
    const { path, description, summary, requestBodySchema, responseSchema, method } = route;

    registry.registerPath({
      method: methodMap[method],
      path,
      description,
      summary,
      request: requestBodySchema && {
        body: {
          content: {
            "application/json": {
              schema: requestBodySchema,
            },
          },
        },
      },
      responses: {
        "200": {
          description: "200 response",
          content: {
            "application/json": {
              schema: responseSchema,
            },
          },
        },
        ...errorResponses,
      },
      "x-amazon-apigateway-integration": {
        type: "aws_proxy",
        passthroughBehavior: "when_no_match",
        httpMethod: "POST",
        uri: config.lambdaArn,
      },
    });
  }
  return registry;
};

export const writeApiDocumentation = (configs: SwaggerConfig[]) => {
  let registry = new OpenAPIRegistry();

  for (const config of configs) {
    registry = registerSwaggerConfig(registry, config);
  }

  const generator = new OpenApiGeneratorV3(registry.definitions);

  const docs = generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "PETS Core Services API",
    },
    servers: [{ url: "https://golden.xyz/api" }], // TODO: Change to real api,
  });

  writeFileSync(`${__dirname}/openapi-docs.json`, JSON.stringify(docs));

  return registry;
};
