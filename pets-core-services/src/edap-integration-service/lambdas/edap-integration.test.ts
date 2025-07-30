import { Context } from "aws-lambda";
import { afterAll, describe, expect, it, vi } from "vitest";

import { logger } from "../../shared/logger";
// import { SQService } from "../models/sqs-service";
// import { StreamService } from "../models/stream-service";
import { lambdaHandler } from "./edap-integration";

describe("Lambda", () => {
  const ctx = "" as unknown as Context;

  afterAll(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("should handle error if SQService throws error", async () => {
    const errorloggerMock = vi.spyOn(logger, "error").mockImplementation(() => null);
    vi.mock("../models/sqs-service.ts", () => ({
      constructor: vi.fn(() => {
        throw new Error("error!!!!");
      }),
    }));

    await expect(lambdaHandler({}, ctx, () => {})).rejects.toEqual(
      new Error("Failed to initialize SQS service"),
    );

    errorloggerMock.mockRestore();
  });
});
