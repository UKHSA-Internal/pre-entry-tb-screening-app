import { APIGatewayProxyResult } from "aws-lambda";
import { mockClient } from "aws-sdk-client-mock";
import { describe, expect, test } from "vitest";

import awsClients from "../../shared/clients/aws";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { context, mockAPIGwEvent } from "../../test/mocks/events";
import { handler } from "./clinics";

describe("Test for Applicant Lambda", () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const ddbMock = mockClient(awsClients.dynamoDBDocClient);

  // createClinicHandler is not fully functional yet
  test.skip("Creating a Clinic", async () => {
    // Arrange
    const event: PetsAPIGatewayProxyEvent = {
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
    const event: PetsAPIGatewayProxyEvent = {
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
    const event: PetsAPIGatewayProxyEvent = {
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

  test("Checking an active Clinic", async () => {
    // Arrange;
    const event: PetsAPIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      resource: "/clinics/active/{clinicId}",
      path: "/clinics/active/1",
      pathParameters: {
        clinicId: "1",
      },
      httpMethod: "GET",
    };

    // Act
    const response: APIGatewayProxyResult = await handler(event, context);

    // Assert
    expect(response.statusCode).toBe(200);
  });
});
