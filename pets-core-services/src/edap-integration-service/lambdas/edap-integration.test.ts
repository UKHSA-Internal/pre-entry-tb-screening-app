import { Context } from "aws-lambda";
import { afterAll, describe, expect, it, vi } from "vitest";

import { logger } from "../../shared/logger";
import { lambdaHandler } from "./edap-integration";

describe("Lambda", () => {
  const ctx = "" as unknown as Context;

  afterAll(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("should handle error if no event", async () => {
    const errorloggerMock = vi.spyOn(logger, "error").mockImplementation(() => null);
    vi.mock("../service/sqs-service.ts", () => ({
      constructor: vi.fn(() => {
        throw new Error("error!!!!");
      }),
    }));

    await expect(lambdaHandler({}, ctx, () => {})).rejects.toEqual(
      new Error("event.Records is not iterable"),
    );

    errorloggerMock.mockRestore();
  });
});
