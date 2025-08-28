import { InvokeCommand } from "@aws-sdk/client-lambda";
import middy from "@middy/core";
import httpRouterHandler from "@middy/http-router";
import {
  APIGatewayAuthorizerResult,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";

import awsClients from "./clients/aws";
import { assertEnvExists, isLocal } from "./config";
import { logger } from "./logger";
import { setRequestLoggingContext } from "./middlewares/logger";
import { validateRequest } from "./middlewares/validation";
import { PetsRoute } from "./types";

export const createHttpResponse = (
  statusCode: number,
  body: string | object,
  contentType = "application/json",
  headers = {},
): APIGatewayProxyResult => {
  const bodyStr = typeof body === "string" ? body : JSON.stringify(body);

  return {
    statusCode,
    body: bodyStr,
    headers: {
      "Content-Type": contentType,
      ...headers,
    },
  };
};

const notFoundResponse = ({ method, path }: { method: string; path: string }) => {
  logger.error({ method, path }, "Missing Handler");
  return createHttpResponse(404, "Not Found");
};

export const simulateLambdaAuthorizer = async (request: {
  event: APIGatewayProxyEvent;
}): Promise<APIGatewayProxyResult | void> => {
  if (isLocal()) {
    const { event } = request;

    try {
      const command = new InvokeCommand({
        FunctionName: assertEnvExists(process.env.AUTHORISER_LAMBDA_NAME),
        Payload: JSON.stringify(event),
      });

      const { lambdaClient } = awsClients;
      const { Payload } = await lambdaClient.send(command);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payload: APIGatewayAuthorizerResult = JSON.parse(
        new TextDecoder("utf-8").decode(Payload),
      );

      if (payload.policyDocument?.Statement[0]?.Effect !== "Allow") {
        return createHttpResponse(401, { message: "Unauthorized" });
      }

      Object.assign(request.event, { requestContext: { authorizer: { ...payload.context } } });
    } catch (err) {
      logger.error("Authorization failed:", err);
      return createHttpResponse(500, { message: "Invalid token" });
    }
  }
};

export const boostrapLambdaRoutes = (routes: PetsRoute[]) => {
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

  return middy<APIGatewayProxyEvent>()
    .before(setRequestLoggingContext)
    .before(simulateLambdaAuthorizer) // Local environment auth, not used on AWS
    .handler(httpRouterHandler({ routes: middyRoutes, notFoundResponse }));
};
