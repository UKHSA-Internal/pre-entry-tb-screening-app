import { describe, expect, test, vi } from "vitest";

import { seededApplications } from "../../shared/fixtures/application";
import { Application } from "../../shared/models/application";
import { mockAPIGwEvent } from "../../test/mocks/events";
import { CancelApplicationEvent, cancelApplicationHandler } from "./cancel-application";

describe("Test for cancel applicantion handler", () => {
  test("Application is cancelled successfully", async () => {
    // Arrange

    // Act
    const response = await cancelApplicationHandler({
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[0].applicationId },
      parsedBody: {
        cancellationReason: "not needed anymore",
      },
    });

    // Assert
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject({
      applicationId: expect.any(String),
      dateCreated: expect.any(String),
      dateUpdated: expect.any(String),
      updatedBy: mockAPIGwEvent.requestContext.authorizer.createdBy,
      status: "Cancelled",
      cancellationReason: "not needed anymore",
    });
  });

  test("Missing required body returns a 500 response", async () => {
    // Arrange

    // Act
    const response = await cancelApplicationHandler({
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[0].applicationId },
    });

    // Assert
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Internal Server Error: Request event missing body",
    });
  });

  test("Validation error returns a 500 response", async () => {
    // Arrange
    const event = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[0].applicationId },
      parsedBody: {
        applicationId: seededApplications[0].applicationId,
        // incorrect type
        cancellationReason: 23,
      },
    };

    // Act
    const response = await cancelApplicationHandler(event as unknown as CancelApplicationEvent);

    // Assert
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Request body data validation failed",
    });
  });

  test("Unknown error", async () => {
    // Arrange
    vi.spyOn(Application, "cancelApplication").mockRejectedValue(Error("can't cancel"));

    // Act
    const response = await cancelApplicationHandler({
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[0].applicationId },
      parsedBody: {
        cancellationReason: "not needed anymore",
      },
    });

    // Assert
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Something went wrong",
    });
  });
});
