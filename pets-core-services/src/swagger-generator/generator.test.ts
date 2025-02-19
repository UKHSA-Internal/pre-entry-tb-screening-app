import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { writeApiDocumentation } from "./generator";
import { SwaggerConfig } from "./types";

// Mock `writeFileSync`
vi.mock("fs", () => ({
  writeFileSync: vi.fn(),
}));

describe("writeApiDocumentation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.SPEC_FILE = "test-openapi.json"; // Mock environment variable
  });

  afterEach(() => {
    delete process.env.SPEC_FILE;
  });

  it("should generate API documentation and write to a file", () => {
    const mockConfig: SwaggerConfig[] = [
      {
        lambdaArn: "arn:aws:lambda:region:123456789012:function:user",
        routes: [
          {
            path: "/users/{userId}",
            method: "GET",
            description: "Get user details",
            summary: "Fetch user",
            handler: () => {
              return { statusCode: 200, body: "" };
            },
            queryParams: { search: z.string().optional() },
            headers: { Authorization: z.string() },
            responseSchema: z.object({ id: z.string(), name: z.string() }),
          },
        ],
        tags: ["Users"],
      },
      {
        lambdaArn: "arn:aws:lambda:region:123456789012:function:post",
        routes: [
          {
            path: "/posts/{postId}",
            method: "POST",
            description: "Create post",
            summary: "New post",
            handler: () => {
              return { statusCode: 200, body: "" };
            },
            requestBodySchema: z.object({ title: z.string(), content: z.string() }),
            queryParams: undefined,
            headers: undefined,
            responseSchema: z.object({ postId: z.string() }),
          },
        ],
        tags: ["Posts"],
      },
    ];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const docs = writeApiDocumentation(mockConfig);

    expect(docs).toMatchSnapshot();
  });
});
