import middy from "@middy/core";
import httpRouterHandler from "@middy/http-router";
import { APIGatewayProxyEvent } from "aws-lambda";

import { notFoundResponse } from "./http";
import { simulateLambdaAuthorizer } from "./local-auth";
import { setRequestLoggingContext } from "./middlewares/logger";
import { validateRequest } from "./middlewares/validation";
import { PetsRoute } from "./types";

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
