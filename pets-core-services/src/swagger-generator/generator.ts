import {
  extendZodWithOpenApi,
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";
import { Method } from "@middy/http-router";
import { writeFileSync } from "fs";
import { z } from "zod";

import { getEnvironmentVariable } from "../shared/config";
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

const extractPathParams = (path: string) => {
  const matches = path.match(/{(.*?)}/g);
  if (!matches) return;

  return matches.reduce((acc, param) => {
    const name = param.replace(/[{}]/g, ""); // Remove curly braces
    Object.assign(acc, { [name]: z.string() });
    return acc;
  }, {});
};

const registerSwaggerConfig = (registry: OpenAPIRegistry, config: SwaggerConfig) => {
  const { routes, tags } = config;
  for (const route of routes) {
    const {
      path,
      description,
      summary,
      requestBodySchema,
      queryParams,
      headers,
      responseSchema,
      method,
    } = route;

    const pathParams = extractPathParams(path);
    registry.registerPath({
      method: methodMap[method],
      path,
      description,
      summary,
      request: {
        params: pathParams && z.object(pathParams),
        query: queryParams && z.object(queryParams),
        headers: headers && z.object(headers),
        body: requestBodySchema && {
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
      },
      "x-amazon-apigateway-integration": {
        type: "aws_proxy",
        passthroughBehavior: "when_no_match",
        httpMethod: "POST",
        uri: config.lambdaArn,
      },
      tags,
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
    servers: [{ url: `${getEnvironmentVariable("APP_DOMAIN")}/api` }],
  });
  console.log(JSON.stringify(docs, null, 2));

  const specName = process.env.SPEC_FILE ?? "openapi-docs.json";
  writeFileSync(`${__dirname}/${specName}`, JSON.stringify(docs));

  return registry;
};
