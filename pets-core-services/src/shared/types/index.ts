import { Method } from "@middy/http-router";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod";

export type RouteParam = Record<
  string,
  z.ZodOptional<z.ZodString | z.ZodNumber> | z.ZodString | z.ZodNumber
>;

export type PetsRoute = {
  path: string;
  handler: (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult> | APIGatewayProxyResult;
  method: Extract<Method, "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS" | "HEAD">;
  requestBodySchema?: z.ZodTypeAny;
  queryParams?: RouteParam;
  headers?: RouteParam; // Note: Ensure keys of headers are all lowercase
  responseSchema: z.ZodTypeAny;
  description?: string;
  summary?: string;
};
