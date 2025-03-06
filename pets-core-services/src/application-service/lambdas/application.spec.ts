import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { describe, expect, test } from "vitest";

import { seededApplications } from "../../shared/fixtures/application";
import { context, mockAPIGwEvent } from "../../test/mocks/events";
import { MenstrualPeriods, PregnancyStatus, VisaOptions, YesOrNo } from "../types/enums";
import { handler } from "./application";

describe("Test for Application Lambda", () => {
  test("Creating an Application Successfully", async () => {
    // Arrange
    const event: APIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      resource: "/application",
      path: "/application",
      httpMethod: "POST",
    };

    // Act
    const response: APIGatewayProxyResult = await handler(event, context);

    // Assert
    expect(response.statusCode).toBe(200);
  });

  test("Fetching an application", async () => {
    // Arrange
    const event: APIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      resource: "/application/{applicationId}",
      path: `/application/${seededApplications[0].applicationId}`,
      httpMethod: "GET",
    };

    // Act
    const response: APIGatewayProxyResult = await handler(event, context);

    // Assert
    expect(response.statusCode).toBe(200);
  });

  test("Validating creating travel information Successfully", async () => {
    // Arrange
    const event: APIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      resource: "/application/{applicationId}/travel-information",
      path: `/application/${seededApplications[0].applicationId}/travel-information`,
      httpMethod: "POST",
    };

    // Act
    const response: APIGatewayProxyResult = await handler(event, context);

    // Assert
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Request Body failed validation",
      validationError: {
        ukAddressLine1: ["Required"],
        ukAddressPostcode: ["Required"],
        ukEmailAddress: ["Required"],
        ukMobileNumber: ["Required"],
        visaCategory: ["Required"],
      },
    });
  });

  test("Creating Travel Information Successfully", async () => {
    // Arrange;
    const event: APIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      resource: "/application/{applicationId}/travel-information",
      path: `/application/${seededApplications[0].applicationId}/travel-information`,
      httpMethod: "POST",
      body: JSON.stringify({
        visaCategory: VisaOptions.Students,
        ukAddressLine1: "first line",
        ukAddressLine2: "second line",
        ukAddressTownOrCity: "town or city",
        ukAddressPostcode: "uk address postcode",
        ukMobileNumber: "uk mobile number",
        ukEmailAddress: "uk email address",
      }),
    };

    // Act
    const response: APIGatewayProxyResult = await handler(event, context);

    // Assert
    expect(response.statusCode).toBe(200);
  });

  test("Validating saving medical screening Successfully", async () => {
    // Arrange
    const event: APIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      resource: "/application/{applicationId}/medical-screening",
      path: `/application/${seededApplications[0].applicationId}/medical-screening`,
      httpMethod: "POST",
    };

    // Act
    const response: APIGatewayProxyResult = await handler(event, context);

    // Assert
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Request Body failed validation",
      validationError: {
        age: ["Required"],
        symptomsOfTb: ["Required"],
        symptoms: ["Required"],
        historyOfConditionsUnder11: ["Required"],
        historyOfPreviousTb: ["Required"],
        contactWithPersonWithTb: ["Required"],
        pregnant: ["Required"],
        haveMenstralPeriod: ["Required"],
        physicalExaminationNotes: ["Required"],
      },
    });
  });

  test("Saving Medical Screening Successfully", async () => {
    // Arrange;
    const event: APIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      resource: "/application/{applicationId}/medical-screening",
      path: `/application/${seededApplications[0].applicationId}/medical-screening`,
      httpMethod: "POST",
      body: JSON.stringify({
        age: 32,
        symptomsOfTb: YesOrNo.No,
        symptoms: [],
        historyOfConditionsUnder11: [],
        historyOfPreviousTb: YesOrNo.No,
        contactWithPersonWithTb: YesOrNo.No,
        pregnant: PregnancyStatus.No,
        haveMenstralPeriod: MenstrualPeriods.NA,
        physicalExaminationNotes: "NA",
      }),
    };

    // Act
    const response: APIGatewayProxyResult = await handler(event, context);

    // Assert
    expect(response.statusCode).toBe(200);
  });
});
