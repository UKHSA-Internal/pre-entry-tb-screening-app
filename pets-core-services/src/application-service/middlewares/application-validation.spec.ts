import assert from "assert";
import { describe, expect, test } from "vitest";

import { seededApplications } from "../../shared/fixtures/application";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { mockAPIGwEvent } from "../../test/mocks/events";
import { validateApplication } from "./application-validation";

describe("Application Validation", () => {
  test("Missing application throws a 400 error", async () => {
    // Arrange
    const event: PetsAPIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: "nonexisting-application-id" },
    };

    // Act
    const response = await validateApplication({ event });

    // Assert
    assert(response);
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Application with ID: nonexisting-application-id does not exist",
    });
  });

  test("Mismatch in Clinic ID throws a 400 error", async () => {
    // Arrange
    const event: PetsAPIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[2].applicationId },
    };

    // Act
    const response = await validateApplication({ event });

    // Assert
    assert(response);
    expect(response.statusCode).toBe(403);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Clinic Id mismatch",
    });
  });

  test("UKHSA staff from different clinic should not result in error", async () => {
    // Arrange
    const event: PetsAPIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      requestContext: {
        ...mockAPIGwEvent.requestContext,
        authorizer: { clinicId: "UK/LHR/00/", createdBy: "hardcoded@user.com" },
      },
      pathParameters: { applicationId: seededApplications[2].applicationId },
    };

    // Act
    const response = await validateApplication({ event });

    // Assert
    expect(response).toBe(undefined);
  });
});
