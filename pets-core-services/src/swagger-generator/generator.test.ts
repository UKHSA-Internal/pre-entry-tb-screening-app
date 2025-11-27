import { OpenApiGeneratorV3, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { writeFileSync } from "fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { extractPathParams, writeApiDocumentation } from "./generator";
import { SwaggerConfig } from "./types";

// mock fs
vi.mock("fs", () => ({
  writeFileSync: vi.fn(),
}));

// mock env
beforeEach(() => {
  process.env.AWS_ACCOUNT_ID = "123456789012";
  process.env.AWS_REGION = "eu-west-2";
  process.env.AUTHORISER_LAMBDA_NAME = "authLambda";
  process.env.ENVIRONMENT = "dev";
  process.env.SPEC_FILE = "test-docs.json";

  vi.clearAllMocks();
  process.env.SPEC_FILE = "test-openapi.json"; // Mock environment variable
});
afterEach(() => {
  delete process.env.SPEC_FILE;
});

describe("extractPathParams", () => {
  it("returns path params as zod strings", () => {
    const result = extractPathParams("/users/{id}/orders/{orderId}");

    expect(result).toBeDefined();

    expect(result!.id).toBeInstanceOf(z.ZodString);

    expect(result!.orderId).toBeInstanceOf(z.ZodString);
  });

  it("returns undefined when no params", () => {
    expect(extractPathParams("/health")).toBeUndefined();
  });
});

describe("registerSwaggerConfig", () => {
  it("registers the route into the registry", async () => {
    const registry = new OpenAPIRegistry();
    const fakeAuthorizer = { name: "authorizer" };

    const mockConfig: SwaggerConfig = {
      lambdaArn: "arn:aws:lambda:region:123456789012:function:user",
      tags: ["Users"],
      routes: [
        {
          path: "/users/{userId}",
          method: "GET",
          description: "Get user details",
          summary: "Fetch user",
          handler: () => ({ statusCode: 200, body: "" }),
          queryParams: { search: z.string().optional() },
          headers: { Authorization: z.string() },
          responseSchema: z.object({ id: z.string(), name: z.string() }),
        },
      ],
    };

    // import fn dynamically
    const { registerSwaggerConfig } = await import("./generator");

    const updatedRegistry = registerSwaggerConfig(registry, mockConfig, fakeAuthorizer);

    // Use generator to produce full OpenAPI
    const generator = new OpenApiGeneratorV3(updatedRegistry.definitions);
    const docs = generator.generateDocument({
      openapi: "3.0.0",
      info: { version: "1.0.0", title: "test" },
      servers: [],
    });

    // Validate route was correctly added
    expect(docs.paths?.["/users/{userId}"]).toBeDefined();
    expect(docs.paths?.["/users/{userId}"].get?.summary).toBe("Fetch user");
    expect(docs.paths?.["/users/{userId}"].get?.parameters).toBeDefined();
  });
});

describe("writeApiDocumentation", () => {
  it("generates OpenAPI docs and writes to file", () => {
    const config: SwaggerConfig[] = [
      {
        lambdaArn: "arn:aws:lambda:eu-west-2:123:function:test",
        tags: ["tag"],
        routes: [
          {
            path: "/items",
            description: "Items",
            summary: "Get items",
            method: "GET",
            handler: () => ({ statusCode: 200, body: "" }),
            requestBodySchema: undefined,
            queryParams: undefined,
            headers: undefined,
            responseSchema: z.array(z.string()),
          },
        ],
      },
    ];

    const docs = writeApiDocumentation(config);

    expect(docs).toMatchSnapshot();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(docs.openapi).toBe("3.0.0");

    expect(writeFileSync).toHaveBeenCalledWith("./test-openapi.json", expect.any(String));

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(docs.paths["/items"].get).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(docs.info.title).toBe("aw-pets-euw-dev-apigateway-coreservices");
  });
});
