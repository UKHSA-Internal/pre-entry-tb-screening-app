import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { Context, DynamoDBStreamEvent } from "aws-lambda";
import { mockClient } from "aws-sdk-client-mock";
import { afterAll, describe, expect, it, vi } from "vitest";

import awsClients from "../../shared/clients/aws";
import { logger } from "../../shared/logger";
import { seededAuditData } from "../fixtures/audit-data";
import { handler } from "./audit";

describe("Audit Lambda", () => {
  const ctx = "" as unknown as Context;

  const sampleEvent = seededAuditData as DynamoDBStreamEvent[];

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
      batchItemFailures: [],
    });

    infologgerMock.mockRestore();
  });

  it("should handle error if no event", async () => {
    const errorloggerMock = vi.spyOn(logger, "error").mockImplementation(() => null);
    const ddbMock = mockClient(awsClients.dynamoDBDocClient);
    ddbMock.on(PutCommand).rejects("Err0r");

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await handler(seededAuditData, ctx, () => {});

    expect(result).toMatchObject({
      batchItemFailures: [],
    });

    expect(errorloggerMock).toHaveBeenNthCalledWith(
      2,
      { e: Error("Err0r") },
      "Could not create audit",
    );

    errorloggerMock.mockRestore();
  });
});
