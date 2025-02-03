import middy from "@middy/core";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod";

import { createHttpResponse } from "../http-response";
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
          const { body } = event;
          const parsedResult = requestSchema.safeParse(JSON.parse(body || "{}"));

          if (parsedResult.error)
            return createHttpResponse(400, {
              message: "Request Body failed validation",
              validationError: parsedResult.error.flatten().fieldErrors,
            });

          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          Object.assign(request.event, { parsedBody: parsedResult.data }); // TODO: Fix the typings for this, Propagate the parsed to the handler, also let sonar cloud flag TODOs
        }

        if (queryStringParametersSchema) {
          const { queryStringParameters } = event;
          const parsedResult = z
            .object(queryStringParametersSchema)
            .safeParse(queryStringParameters);

          if (parsedResult.error)
            return createHttpResponse(400, {
              message: "Request Parameters failed validation",
              validationError: parsedResult.error.issues,
            });

          Object.assign(request.event, { parsedQueryParams: parsedResult.data }); // TODO: Fix the typings for this, Propagate the parsed to the handler, also let sonar cloud flag TODOs
        }

        if (headersSchema) {
          const { headers } = event;
          const parsedResult = z.object(headersSchema).safeParse(headers);

          if (parsedResult.error)
            return createHttpResponse(400, {
              message: "Headers failed validation",
              validationError: parsedResult.error.issues,
            });
          Object.assign(request.event, { parsedHeaders: parsedResult.data }); // TODO: Fix the typings for this, Propagate the parsed to the handler, also let sonar cloud flag TODOs
        }
      } catch (error) {
        console.error(error);
        return createHttpResponse(500, {
          message: "Something went wrong",
        });
      }
    },
  };
};
