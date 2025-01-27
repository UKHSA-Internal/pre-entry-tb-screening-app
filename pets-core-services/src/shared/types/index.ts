import { Method, Route } from "@middy/http-router";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod";

type RouteParam = Record<
  string,
  z.ZodOptional<z.ZodString | z.ZodNumber> | z.ZodString | z.ZodNumber
>;

export type PetsRoute = Route<APIGatewayEvent, APIGatewayProxyResult> & {
  method: Extract<Method, "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS" | "HEAD">;
  requestBodySchema?: z.ZodTypeAny;
  queryParams?: RouteParam;
  headers?: RouteParam;
  responseSchema: z.ZodTypeAny;
  description?: string;
  summary?: string;
};
