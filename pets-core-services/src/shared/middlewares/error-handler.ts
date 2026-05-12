import middy from "@middy/core";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { HttpErrors } from "../httpResponses";
import { logger } from "../logger";

/**
 * Centralised middy error handler middleware.
 *
 * Catches any unhandled exception that escapes a route handler and returns a
 * sanitised 500 response so that raw error messages, stack traces, and internal
 * path information are never serialised into the HTTP response body.
 *
 * The full error is still logged internally for debugging.
 */
export const errorHandler = (): middy.MiddlewareObj<
  APIGatewayProxyEvent,
  APIGatewayProxyResult | void
> => ({
  onError: (request): APIGatewayProxyResult => {
    logger.error(request.error, "Unhandled error caught by error handler middleware");
    return HttpErrors.serverError("An unexpected error occurred");
  },
});
