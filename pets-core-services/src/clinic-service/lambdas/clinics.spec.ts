import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyResult } from "aws-lambda";
import { mockClient } from "aws-sdk-client-mock";
import { describe, expect, test, vi } from "vitest";

import awsClients from "../../shared/clients/aws";
import { CountryCode } from "../../shared/country";
import { logger } from "../../shared/logger";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { context, mockAPIGwEvent } from "../../test/mocks/events";
import { NewClinic } from "../models/clinics";
import { handler } from "./clinics";

const clinicDetails: NewClinic[] = [
  {
    clinicId: "Test-Clinic-Id",
    name: "Test Clinic",
    city: "Test Town",
    country: CountryCode.ALA,
    startDate: "2025-03-03",
    endDate: null,
    createdBy: "test-clinic-creator@epost.this",
  },
];

describe("Test for Clinic Lambda", () => {
  const ddbMock = mockClient(awsClients.dynamoDBDocClient);

  test("Creating a Clinic", async () => {
    // Arrange
    const event: PetsAPIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      resource: "/clinics/{clinicId}",
      path: `/clinics/${clinicDetails[0].clinicId}`,
      pathParameters: {
        clinicId: clinicDetails[0].clinicId,
      },
      httpMethod: "POST",
      // requestSchema: ClinicSchema,
      body: JSON.stringify({
        ...clinicDetails[0],
      }),
    };

    // Act
    const response: APIGatewayProxyResult = await handler(event, context);

    // Assert
    expect(response.statusCode).toBe(200);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(JSON.parse(JSON.parse(response.body)?.body as string)).toMatchObject({
      ...clinicDetails[0],
    });
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
    const loggerMock = vi.spyOn(logger, "info").mockImplementation(() => null);
    const event: PetsAPIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      resource: "/clinics",
      path: "/clinics",
      httpMethod: "GET",
    };
    ddbMock.on(ScanCommand).resolves({
      Items: [
        {
          ...clinicDetails[0],
          pk: `CLINIC#${clinicDetails[0].clinicId}`,
          sk: "CLINIC#ROOT",
        },
      ],
    });

    // Act
    const response: APIGatewayProxyResult = await handler(event, context);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject([
      {
        ...clinicDetails[0],
        startDate: new Date(clinicDetails[0].startDate).toISOString(),
      },
    ]);
    expect(loggerMock).toHaveBeenCalled();
    expect(loggerMock).toHaveBeenLastCalledWith(
      { resultCount: 1 },
      "Clinics data fetched successfully",
    );
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
