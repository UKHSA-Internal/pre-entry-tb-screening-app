import { describe, test } from "vitest";

import { getSwaggerSpec } from "./swagger-utils";

describe("swagger spec", () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  test("spec for local env", () => {
    process.env.DEV = "true";
    expect(getSwaggerSpec()).toMatchObject({
      servers: [
        {
          url: "http://localhost:3000/api",
        },
      ],
    });
  });

  test("spec for deployed env", () => {
    process.env.DEV = "";
    expect(getSwaggerSpec()).toMatchObject({
      servers: [
        {
          url: "https://localhost:3000/api",
        },
      ],
    });
  });
});
