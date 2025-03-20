import {
  extendZodWithOpenApi,
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";
import { Method } from "@middy/http-router";
import { writeFileSync } from "fs";
import { z } from "zod";

import { assertEnvExists } from "../shared/config";
import { errorResponses } from "./error-response";
import { SwaggerConfig } from "./types";

extendZodWithOpenApi(z);

const awsAccountId = assertEnvExists(process.env.AWS_ACCOUNT_ID);

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

const registerSwaggerConfig = (
  registry: OpenAPIRegistry,
  config: SwaggerConfig,
  authorizer: { name: string },
) => {
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
        "2XX": {
          description: "2XX response",
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
      security: [
        {
          [authorizer.name]: [],
        },
      ],
      tags,
    });
  }
  return registry;
};

export const writeApiDocumentation = (configs: SwaggerConfig[]): any => {
  let registry = new OpenAPIRegistry();

  const authorizerIdentity = "Authorization";
  const authorizer = registry.registerComponent("securitySchemes", "authorizer", {
    type: "apiKey",
    name: authorizerIdentity,
    in: "header",
    "x-amazon-apigateway-authtype": "custom",
    "x-amazon-apigateway-authorizer": {
      type: "request",
      identitySource: `method.request.header.${authorizerIdentity}`,
      authorizerUri: `arn:aws:apigateway:eu-west-2:lambda:path/2015-03-31/functions/arn:aws:lambda:eu-west-2:${awsAccountId}:function:${assertEnvExists(process.env.AUTHORISER_LAMBDA_NAME)}/invocations`,
      authorizerCredentials: `arn:aws:iam::${awsAccountId}:role/api_gateway_auth_invocation`,
      authorizerResultTtlInSeconds: 0,
      requestTemplates: {
        "application/json":
          '{ "authorization": "$input.params(\'Authorization\')", "staticValue": "HelloWorld", "stage": "$context.stage", "requestTime": "$context.requestTime", "requestId": "$context.requestId" }',
      },
    },
  });

  for (const config of configs) {
    registry = registerSwaggerConfig(registry, config, authorizer);
  }

  const generator = new OpenApiGeneratorV3(registry.definitions);
  const docs = generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: `aw-pets-euw-${assertEnvExists(process.env.ENVIRONMENT)}-apigateway-coreservices`,
    },
    servers: [],
  });

  // eslint-disable-next-line no-console
  console.log(JSON.stringify(docs, null, 2));

  const specName = process.env.SPEC_FILE ?? "openapi-docs.json";
  writeFileSync(`./${specName}`, JSON.stringify(docs));

  return docs;
};
