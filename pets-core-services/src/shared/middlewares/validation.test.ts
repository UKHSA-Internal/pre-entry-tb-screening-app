import middy from "@middy/core";
import { APIGatewayProxyResult } from "aws-lambda";
import { describe, expect, it } from "vitest";
import { z } from "zod";

import { context, mockAPIGwEvent } from "../../test/mocks/events";
import { validateRequest } from "./validation";

describe("validateRequest middleware", () => {
  it("should validate request body successfully", async () => {
    const requestSchema = z.object({
      name: z.string(),
      age: z.number(),
    });

    const event = {
      ...mockAPIGwEvent,
      body: JSON.stringify({ name: "John", age: 30 }),
      parsedBody: undefined,
    };

    const handler = middy().use(validateRequest({ requestSchema }));

    await handler(event, context);

    expect(event.parsedBody).toEqual({ name: "John", age: 30 });
  });

  it("should return 400 when request body is invalid", async () => {
    const requestSchema = z.object({
      name: z.string(),
      age: z.number(),
    });

    const event = {
      ...mockAPIGwEvent,
      body: JSON.stringify({ name: "John", age: "invalid" }),
    };

    const handler = middy().use(validateRequest({ requestSchema }));

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response: APIGatewayProxyResult = await handler(event, context);

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Request Body failed validation",
      validationError: {
        age: ["Expected number, received string"],
      },
    });
    // Security: raw ZodError must not be serialised into the response
    expect(JSON.parse(response.body)).not.toHaveProperty("validationErrorVerbose");
  });

  it("should validate query string parameters successfully", async () => {
    const queryStringParametersSchema = { id: z.string() };

    const event = {
      ...mockAPIGwEvent,
      queryStringParameters: { id: "123" },
      parsedQueryParams: undefined,
    };

    const handler = middy().use(validateRequest({ queryStringParametersSchema }));

    await handler(event, context);
    expect(event.parsedQueryParams).toEqual({ id: "123" });
  });

  it("should return 400 when query string parameters are invalid", async () => {
    const queryStringParametersSchema = { id: z.string().date() };

    const event = {
      ...mockAPIGwEvent,
      queryStringParameters: { id: "123" },
    };

    const handler = middy().use(validateRequest({ queryStringParametersSchema }));

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response: APIGatewayProxyResult = await handler(event, context);

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Request Parameters failed validation",
      validationError: {
        id: ["Invalid date"],
      },
    });
  });

  it("should validate headers successfully", async () => {
    const headersSchema = { authorization: z.string() };

    const event = {
      ...mockAPIGwEvent,
      headers: { authorization: "Bearer token" },
      parsedHeaders: undefined,
    };

    const handler = middy().use(validateRequest({ headersSchema }));

    await handler(event, context);

    expect(event.parsedHeaders).toEqual({ authorization: "Bearer token" });
  });

  it("should return 400 when headers are invalid", async () => {
    const headersSchema = { authorization: z.string().min(23) };

    const event = {
      ...mockAPIGwEvent,
      headers: { authorization: "Bearer token" },
    };

    const handler = middy().use(validateRequest({ headersSchema }));

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response: APIGatewayProxyResult = await handler(event, context);

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Headers failed validation",
      validationError: {
        authorization: ["String must contain at least 23 character(s)"],
      },
    });
  });

  it("should return 500 when an unexpected error occurs", async () => {
    const requestSchema = z.object({
      name: z.string(),
      age: z.number(),
    });

    const malformedEvent = {
      ...mockAPIGwEvent,
      body: "{",
    };

    const handler = middy().use(validateRequest({ requestSchema }));

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response: APIGatewayProxyResult = await handler(malformedEvent, context);

    expect(response.statusCode).toBe(500);

    expect(JSON.parse(response.body)).toMatchObject({
      message: "Something went wrong",
    });
  });

  it("should not echo token values or header content in header validation errors", async () => {
    const sensitiveToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.sensitive-payload";
    const headersSchema = { authorization: z.string().min(500) };

    const event = {
      ...mockAPIGwEvent,
      headers: { authorization: `Bearer ${sensitiveToken}` },
    };

    const handler = middy().use(validateRequest({ headersSchema }));

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response: APIGatewayProxyResult = await handler(event, context);

    expect(response.statusCode).toBe(400);
    // The raw token value must not appear in the response body
    expect(response.body).not.toContain(sensitiveToken);
    // No stack trace or internal framework info
    expect(response.body).not.toContain("ZodError");
    expect(response.body).not.toContain("at Object");
    expect(JSON.parse(response.body)).not.toHaveProperty("validationErrorVerbose");
  });

  it("should not include stack traces or framework internals in body validation errors", async () => {
    const requestSchema = z.object({ name: z.string() });

    const event = {
      ...mockAPIGwEvent,
      body: JSON.stringify({ name: 42 }),
    };

    const handler = middy().use(validateRequest({ requestSchema }));

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response: APIGatewayProxyResult = await handler(event, context);

    expect(response.statusCode).toBe(400);
    expect(response.body).not.toContain("ZodError");
    expect(response.body).not.toContain("node_modules");
    expect(JSON.parse(response.body)).not.toHaveProperty("validationErrorVerbose");
    // field-level errors remain to help clients fix their requests
    expect(JSON.parse(response.body)).toHaveProperty("validationError");
  });
});
