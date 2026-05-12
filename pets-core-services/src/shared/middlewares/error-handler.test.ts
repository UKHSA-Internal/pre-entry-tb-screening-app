import middy from "@middy/core";
import { APIGatewayProxyResult } from "aws-lambda";
import { describe, expect, it } from "vitest";

import { context, mockAPIGwEvent } from "../../test/mocks/events";
import { errorHandler } from "./error-handler";

describe("errorHandler middleware", () => {
  it("should return 500 with a generic message when a handler throws", async () => {
    const throwingHandler = middy()
      .use(errorHandler())
      .handler(async () => {
        throw new Error("Internal database connection failed at /var/task/db.js:42");
      });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response: APIGatewayProxyResult = await throwingHandler(mockAPIGwEvent, context);

    expect(response.statusCode).toBe(500);
    const body = JSON.parse(response.body) as Record<string, unknown>;
    expect(body.message).toBe("An unexpected error occurred");
  });

  it("should not expose the original error message in the response", async () => {
    const sensitiveMessage = "Secret token: eyJhbGciOiJSUzI1NiJ9.sensitive";
    const throwingHandler = middy()
      .use(errorHandler())
      .handler(async () => {
        throw new Error(sensitiveMessage);
      });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response: APIGatewayProxyResult = await throwingHandler(mockAPIGwEvent, context);

    const responseBody = response.body;
    expect(responseBody).not.toContain(sensitiveMessage);
    expect(responseBody).not.toContain("eyJhbGciOiJSUzI1NiJ9");
  });

  it("should not expose stack traces in the response", async () => {
    const throwingHandler = middy()
      .use(errorHandler())
      .handler(async () => {
        const err = new Error("Something broke");
        // Ensure a stack trace exists on the error
        Error.captureStackTrace(err);
        throw err;
      });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response: APIGatewayProxyResult = await throwingHandler(mockAPIGwEvent, context);

    expect(response.body).not.toContain("at ");
    expect(response.body).not.toContain(".ts:");
    expect(response.body).not.toContain(".js:");
  });

  it("should not expose internal module paths in the response", async () => {
    const throwingHandler = middy()
      .use(errorHandler())
      .handler(async () => {
        throw new Error("ENOENT: no such file or directory, open '/var/task/config/secrets.json'");
      });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response: APIGatewayProxyResult = await throwingHandler(mockAPIGwEvent, context);

    const body = JSON.parse(response.body) as Record<string, unknown>;
    expect(body.message).toBe("An unexpected error occurred");
    expect(response.body).not.toContain("/var/task");
    expect(response.body).not.toContain("secrets.json");
  });

  it("should pass through the response if no error is thrown", async () => {
    const successHandler = middy()
      .use(errorHandler())
      .handler(async () => ({
        statusCode: 200,
        body: JSON.stringify({ ok: true }),
        headers: {},
      }));

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response: APIGatewayProxyResult = await successHandler(mockAPIGwEvent, context);

    expect(response.statusCode).toBe(200);
  });
});
