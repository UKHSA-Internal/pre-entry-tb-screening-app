import { describe, expect, it } from "vitest";

import { createHttpResponse } from "./http-response";

describe("create http response", () => {
  it.each([{ sample: "response" }, "sample response"])(
    "should create http response for object body",
    (body) => {
      const response = createHttpResponse(200, body);
      expect(response).toMatchObject({
        statusCode: 200,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        body: expect.stringContaining("sample"),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
  );

  it("should return http response with a specific content type", () => {
    const response = createHttpResponse(200, "sample-response", "application/csv");
    expect(response).toMatchObject({
      statusCode: 200,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      body: expect.any(String),
      headers: {
        "Content-Type": "application/csv",
      },
    });
  });

  it("should return http response with custom headers", () => {
    const response = createHttpResponse(200, "sample-response", undefined, {
      custom: "headers",
    });
    expect(response).toMatchObject({
      statusCode: 200,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      body: expect.any(String),
      headers: {
        "Content-Type": "application/json",
        custom: "headers",
      },
    });
  });
});
