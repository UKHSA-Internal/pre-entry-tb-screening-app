import middy from "@middy/core";
import httpRouterHandler from "@middy/http-router";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { logger } from "./logger";
import { simulateLambdaAuthorizer } from "./middlewares/local-auth";
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
