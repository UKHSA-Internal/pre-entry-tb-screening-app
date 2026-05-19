import { Context } from "aws-lambda";
import { afterAll, describe, expect, it, vi } from "vitest";

import { logger } from "../../shared/logger";
import { handler } from "./edap-integration";

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

    await expect(handler({}, ctx, () => {})).rejects.toEqual(
      new TypeError("event.Records is not iterable"),
    );

    errorloggerMock.mockRestore();
  });

  it("should throw if event is undefined", async () => {
    const errorloggerMock = vi.spyOn(logger, "error").mockImplementation(() => null);

    await expect(handler(undefined, ctx, () => {})).rejects.toThrow("ERROR: event is not defined");
    expect(errorloggerMock).toHaveBeenCalledWith("ERROR: event is not defined.");

    errorloggerMock.mockRestore();
  });

  it("should return empty batchItemFailures for empty Records array", async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await handler({ Records: [] }, ctx, () => {});
    expect(result).toEqual({ batchItemFailures: [] });
  });
});
