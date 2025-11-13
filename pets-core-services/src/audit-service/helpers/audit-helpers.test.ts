import { LookupEventsCommand } from "@aws-sdk/client-cloudtrail";
import { mockClient } from "aws-sdk-client-mock";
import { describe, expect, test, vi } from "vitest";

import awsClients from "../../shared/clients/aws";
import { logger } from "../../shared/logger";
import { seededAuditData } from "../fixtures/audit-data";
import { getConsoleEvent } from "./audit-helpers";

describe("Test helper functions", () => {
  const record = seededAuditData[0];
  const cloudTrailClientMock = mockClient(awsClients.cloudTrailClient);

  test("getConsoleEvent function returns 'App'", async () => {
    // Arrange
    cloudTrailClientMock.on(LookupEventsCommand).resolves({
      Events: [
        {
          CloudTrailEvent: JSON.stringify({
            userAgent: "console.amazonaws.com",
            requestParameters: {
              table: "application-details",
              tableName: "application-details",
            },
          }),
        },
      ],
    });

    // Act
    const response = await getConsoleEvent(record);

    // Assert
    expect(response).toBe("App");
  });

  test("getConsoleEvent function returns 'API'", async () => {
    // Arrange
    cloudTrailClientMock.on(LookupEventsCommand).resolves({ Events: [{ EventSource: "app" }] });

    // Act
    const response = await getConsoleEvent(record);

    // Assert
    expect(response).toBe("API");
  });

  test("getConsoleEvent function response for missing data in 'record'", async () => {
    // Arrange
    cloudTrailClientMock.on(LookupEventsCommand).resolves({ Events: [{ EventSource: "app" }] });
    const errorloggerMock = vi.spyOn(logger, "error").mockImplementation(() => null);

    // Act
    const response = await getConsoleEvent({
      ...record,
      eventSourceARN: undefined,
    });

    // Assert
    expect(errorloggerMock).toHaveBeenCalledWith(
      "Record is missing tableName or ApproximateCreationDateTime",
    );
    expect(response).toBeUndefined();
  });

  test("Audit was not created because of missing creatorBy", async () => {
    // Arrange
    cloudTrailClientMock.on(LookupEventsCommand).rejects("Err0r!");
    const errorloggerMock = vi.spyOn(logger, "error").mockImplementation(() => null);

    // Act
    const response = await getConsoleEvent(record);

    // Assert
    expect(errorloggerMock).toHaveBeenCalledWith(
      { err: Error("Err0r!") },
      "CloudTrail lookup failed",
    );
    expect(response).toBeUndefined();
  });
});
