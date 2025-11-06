import { Context, DynamoDBStreamEvent } from "aws-lambda";
import { describe, expect, test, vi } from "vitest";

import { logger } from "../../shared/logger";
import { seededAuditData } from "../fixtures/audit-data";
import { createAuditHandler } from "./create-audit";

describe("Test for create applicantion handler", () => {
  const ctx = "" as unknown as Context;

  const sampleEvent = seededAuditData as DynamoDBStreamEvent[];

  test("Audit is generated successfully", async () => {
    // Arrange

    // Act
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response = await createAuditHandler(sampleEvent, ctx, () => {});

    // Assert
    expect(response).toMatchObject({
      batchItemFailures: [],
    });
  });

  test("Audit was not created because of missing creatorBy", async () => {
    // Arrange
    const errorloggerMock = vi.spyOn(logger, "error").mockImplementation(() => null);

    // Act
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response = await createAuditHandler(
      [{ ...seededAuditData[0], eventSourceARN: undefined }],
      ctx,
      () => {},
    );

    // Assert
    expect(response).toMatchObject({ batchItemFailures: [] });
    expect(errorloggerMock).toHaveBeenCalledWith("Audit was not created");
  });
});
