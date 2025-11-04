import { Context, DynamoDBStreamEvent } from "aws-lambda";
import { describe, expect, test } from "vitest";

import { seededAuditData } from "../fixtures/audit-data";
import { createAuditHandler } from "./create-audit";

describe("Test for create applicantion handler", () => {
  const ctx = "" as unknown as Context;

  const sampleEvent = {
    Records: seededAuditData,
  } as DynamoDBStreamEvent;

  test("Application is generated successfully", async () => {
    // Arrange

    // Act
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response = await createAuditHandler(sampleEvent, ctx, () => {});

    // Assert
    expect(response).toMatchObject({
      batchItemFailures: [
        {
          itemIdentifier: "0",
        },
      ],
    });
  });
});
