import middy from "@middy/core";
import httpRouterHandler from "@middy/http-router";

import { notFoundResponse } from "./http";
import { errorHandler } from "./middlewares/error-handler";
import { simulateLambdaAuthorizer } from "./middlewares/local-auth";
import { setRequestLoggingContext } from "./middlewares/logger";
import { validateRequest } from "./middlewares/validation";
import { PetsAPIGatewayProxyEvent, PetsRoute } from "./types";

export const boostrapLambdaRoutes = (routes: PetsRoute[]) => {
  const middyRoutes = routes.map((route) => ({
    ...route,
    handler: middy<PetsAPIGatewayProxyEvent>()
      .use(
        validateRequest({
          requestSchema: route.requestBodySchema,
          queryStringParametersSchema: route.queryParams,
          headersSchema: route.headers,
        }),
      )
      .handler(route.handler),
  }));

  return middy<PetsAPIGatewayProxyEvent>()
    .before(setRequestLoggingContext)
    .before(simulateLambdaAuthorizer) // Local environment auth, not used on AWS
    .use(errorHandler())
    .handler(httpRouterHandler({ routes: middyRoutes, notFoundResponse }));
};
