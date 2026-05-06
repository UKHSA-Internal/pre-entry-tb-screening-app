import { MiddyfiedHandler } from "@middy/core";
import { Method } from "@middy/http-router";
import { APIGatewayProxyEventBase, APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod";

export type RouteParam = Record<
  string,
  z.ZodOptional<z.ZodString | z.ZodNumber> | z.ZodString | z.ZodNumber | z.ZodNativeEnum<any>
>;
type RoleBasedSchema = {
  base: z.ZodTypeAny;
  super: z.ZodTypeAny;
};

export type RequestSchema = z.ZodTypeAny | RoleBasedSchema;
export type PetsRoute = {
  path: string;
  handler:
    | MiddyfiedHandler<PetsAPIGatewayProxyEvent>
    | ((event: PetsAPIGatewayProxyEvent) => Promise<APIGatewayProxyResult> | APIGatewayProxyResult);
  method: Extract<Method, "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS" | "HEAD">;
  requestBodySchema?: RequestSchema;
  queryParams?: RouteParam;
  headers?: RouteParam; // Note: Ensure keys of headers are all lowercase
  responseSchema: z.ZodTypeAny;
  description?: string;
  summary?: string;
};

export type PetsAPIGatewayProxyEvent = APIGatewayProxyEventBase<{
  superuser: string;
  clinicId: string;
  createdBy: string;
}>;
