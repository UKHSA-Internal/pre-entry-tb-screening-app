import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { describe, expect, test } from "vitest";

import { context, mockAPIGwEvent } from "../../test/mocks/events";
import { handler } from "./clinics.ts";

describe("Test for Applicant Lambda", () => {
  test("Creating a Clinic", async () => {
    // Arrange
    const event: APIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      resource: "/clinics/{clinicId}",
      path: "/clinics/12345",
      pathParameters: {
        clinicId: "12345",
      },
      httpMethod: "POST",
      body: JSON.stringify({
        clinicId: "Test-Clinic-Id",
        clinicName: "Test Clinic",
        iom: true,
      }),
    };

    // Act
    const response: APIGatewayProxyResult = await handler(event, context);

    // Assert
    expect(response.statusCode).toBe(200);
  });

  test("Fetching a Clinic", async () => {
    // Arrange;
    const event: APIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      resource: "/clinics/{clinicId}",
      path: "/clinics/12345",
      pathParameters: {
        clinicId: "12345",
      },
      httpMethod: "GET",
    };

    // Act
    const response: APIGatewayProxyResult = await handler(event, context);

    // Assert
    expect(response.statusCode).toBe(200);
  });

  test("Fetching all Clinics", async () => {
    // Arrange;
    const event: APIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      resource: "/clinics",
      path: "/clinics",
      httpMethod: "GET",
    };

    // Act
    const response: APIGatewayProxyResult = await handler(event, context);

    // Assert
    expect(response.statusCode).toBe(200);
  });
});
