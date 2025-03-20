import middy from "@middy/core";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod";

import { createHttpResponse } from "../http";
import { logger } from "../logger";
import { RouteParam } from "../types";

export type ValidateRequestType = {
  requestSchema?: z.ZodTypeAny;
  queryStringParametersSchema?: RouteParam;
  headersSchema?: RouteParam;
};
export const validateRequest = ({
  requestSchema,
  queryStringParametersSchema,
  headersSchema,
}: ValidateRequestType): middy.MiddlewareObj<
  APIGatewayProxyEvent,
  APIGatewayProxyResult | void
> => {
  return {
    before: (request) => {
      const { event } = request;

      try {
        if (requestSchema) {
          logger.info("Validating Request Body");
          const { body } = event;
          const parsedResult = requestSchema.safeParse(JSON.parse(body ?? "{}"));

          if (parsedResult.error) {
            logger.error("Failed Validation");
            return createHttpResponse(400, {
              message: "Request Body failed validation",
              validationError: parsedResult.error.flatten().fieldErrors,
              validationErrorVerbose: parsedResult.error,
            });
          }

          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          Object.assign(request.event, { parsedBody: parsedResult.data });
        }

        if (queryStringParametersSchema) {
          const { queryStringParameters } = event;
          const parsedResult = z
            .object(queryStringParametersSchema)
            .safeParse(queryStringParameters);

          if (parsedResult.error) {
            logger.error("Request Parameters failed validation");
            return createHttpResponse(400, {
              message: "Request Parameters failed validation",
              validationError: parsedResult.error.flatten().fieldErrors,
            });
          }

          Object.assign(request.event, { parsedQueryParams: parsedResult.data });
        }

        if (headersSchema) {
          const { headers } = event;
          const parsedResult = z.object(headersSchema).safeParse(headers);

          if (parsedResult.error) {
            logger.error("Headers failed validation");
            return createHttpResponse(400, {
              message: "Headers failed validation",
              validationError: parsedResult.error.flatten().fieldErrors,
            });
          }
          Object.assign(request.event, { parsedHeaders: parsedResult.data });
        }
      } catch (error) {
        logger.error(error, "Validation Failed");
        return createHttpResponse(500, {
          message: "Something went wrong",
        });
      }
    },
  };
};
