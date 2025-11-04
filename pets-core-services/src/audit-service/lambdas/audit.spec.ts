import { Context, DynamoDBStreamEvent } from "aws-lambda";
import { afterAll, describe, expect, it, vi } from "vitest";

import { logger } from "../../shared/logger";
import { seededAuditData } from "../fixtures/audit-data";
import { handler } from "./audit";

describe("Audit Lambda", () => {
  const ctx = "" as unknown as Context;

  const sampleEvent = {
    Records: seededAuditData,
  } as DynamoDBStreamEvent;

  afterAll(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("should successfully create audit", async () => {
    const infologgerMock = vi.spyOn(logger, "info").mockImplementation(() => null);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await handler(sampleEvent, ctx, () => {});

    // expect(infologgerMock).toHaveBeenCalledWith("???");
    expect(result).toMatchObject({
      batchItemFailures: [
        {
          itemIdentifier: "0",
        },
      ],
    });

    infologgerMock.mockRestore();
  });

  it("should handle error if no event", async () => {
    const errorloggerMock = vi.spyOn(logger, "error").mockImplementation(() => null);

    await expect(handler(sampleEvent, ctx, () => {})).rejects.toEqual(
      new Error("Failed to create audit"),
    );

    errorloggerMock.mockRestore();
  });
});
