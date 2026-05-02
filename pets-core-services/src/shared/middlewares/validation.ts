import middy from "@middy/core";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod";

import { HttpErrors } from "../httpResponses";
import { logger } from "../logger";
import { RouteParam } from "../types";

type RoleBasedSchema = {
  base: z.ZodTypeAny;
  super: z.ZodTypeAny;
};

export type RequestSchema = z.ZodTypeAny | RoleBasedSchema;

export type ValidateRequestType = {
  requestSchema?: RequestSchema;
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
    before: (request): APIGatewayProxyResult | void => {
      const { event } = request;

      try {
        if (requestSchema) {
          logger.info("Validating Request Body");
          const superuser = event.requestContext?.authorizer?.superuser === "true";

          let schema: z.ZodTypeAny;

          if (
            typeof requestSchema === "object" &&
            requestSchema !== null &&
            "base" in requestSchema &&
            "super" in requestSchema
          ) {
            const roleSchema = requestSchema as unknown as {
              base: z.ZodTypeAny;
              super: z.ZodTypeAny;
            };

            schema = superuser ? roleSchema.super : roleSchema.base;
          } else {
            schema = requestSchema;
          }

          const rawBody = JSON.parse(event.body ?? "{}");

          const parsedResult = schema.safeParse(rawBody);

          if (parsedResult.error) {
            logger.error("Failed Validation");
            return HttpErrors.badRequest({
              message: "Request Body failed validation",
              validationError: parsedResult.error.flatten().fieldErrors,
              validationErrorVerbose: parsedResult.error,
            });
          }

          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          Object.assign(request.event, { parsedBody: parsedResult.data, superuser });
        }

        if (
          queryStringParametersSchema &&
          event.queryStringParameters &&
          Object.keys(event.queryStringParameters).length > 0
        ) {
          const { queryStringParameters } = event;
          const parsedResult = z
            .object(queryStringParametersSchema)
            .safeParse(queryStringParameters);

          if (parsedResult.error) {
            logger.error("Request Parameters failed validation");
            return HttpErrors.badRequest({
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
            return HttpErrors.badRequest({
              message: "Headers failed validation",
              validationError: parsedResult.error.flatten().fieldErrors,
            });
          }
          Object.assign(request.event, { parsedHeaders: parsedResult.data });
        }
      } catch (error) {
        logger.error(error, "Validation Failed due to server error");
        return HttpErrors.serverError("Something went wrong");
      }
    },
  };
};
