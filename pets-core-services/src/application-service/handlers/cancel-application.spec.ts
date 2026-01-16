import { describe, expect, test } from "vitest";

import { seededApplications } from "../../shared/fixtures/application";
import { ApplicationStatus } from "../../shared/types/enum";
import { mockAPIGwEvent } from "../../test/mocks/events";
import { CancelApplicationEvent, cancelApplicationHandler } from "./cancel-application";

describe("Test for cancel applicantion handler", () => {
  test("Application is cancelled successfully", async () => {
    // Arrange

    // Act
    const response = await cancelApplicationHandler({
      ...mockAPIGwEvent,
      parsedBody: {
        applicationId: seededApplications[0].applicationId,
        status: ApplicationStatus.cancelled,
        cancellationReason: "I don't want it anymore",
      },
    });

    // Assert
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject({
      applicationId: expect.any(String),
      dateCreated: expect.any(String),
      status: "Cancelled",
      cancellationReason: "I don't want it anymore",
    });
  });

  test("Missing required body returns a 500 response", async () => {
    // Arrange

    // Act
    const response = await cancelApplicationHandler(mockAPIGwEvent);

    // Assert
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Internal Server Error: Request event missing body",
    });
  });

  test("Validation error returns a 500 response", async () => {
    // Arrange
    const event = {
      ...mockAPIGwEvent,
      parsedBody: {
        applicationId: seededApplications[0].applicationId,
        // status: this is required arg is missing,
        cancellationReason: "change of plan",
      },
    };

    // Act
    const response = await cancelApplicationHandler(event as CancelApplicationEvent);

    // Assert
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Request body data validation failed",
    });
  });
});
