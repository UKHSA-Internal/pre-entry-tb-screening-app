import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { describe, expect, test } from "vitest";

import { CountryCode } from "../../shared/country";
import { context, mockAPIGwEvent } from "../../test/mocks/events";
import { seededApplicants } from "../fixtures/applicants";
import { AllowedSex } from "../types/enums";
import { handler } from "./applicants.ts";

describe("Test for Applicant Lambda", () => {
  test("Validating GET Applicant Successfully", async () => {
    // Arrange
    const event: APIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      resource: "/applicant",
      path: "/applicant",
      httpMethod: "GET",
    };

    // Act
    const response: APIGatewayProxyResult = await handler(event, context);

    // Assert
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Headers failed validation",
      validationError: {
        countryofissue: ["Required"],
        passportnumber: ["Required"],
      },
    });
  });

  test("Fetching an existing Applicant", async () => {
    // Arrange
    const event: APIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      resource: "/applicant",
      path: "/applicant",
      httpMethod: "GET",
      headers: {
        passportnumber: seededApplicants[0].passportNumber,
        countryofissue: seededApplicants[0].countryOfIssue,
      },
    };

    // Act
    const response: APIGatewayProxyResult = await handler(event, context);

    // Assert
    expect(response.statusCode).toBe(200);
  });

  test("Validating POST Applicant Successfully", async () => {
    // Arrange
    const event: APIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      resource: "/register/applicant",
      path: "/applicant/register",
      httpMethod: "POST",
    };

    // Act
    const response: APIGatewayProxyResult = await handler(event, context);

    // Assert
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Request Body failed validation",
      validationError: {
        countryOfIssue: ["Required"],
        issueDate: ["Required"],
      },
    });
  });

  test("Posting an Applicant Successfully", async () => {
    // Arrange;
    const event: APIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      resource: "/register/applicant",
      path: "/applicant/register",
      httpMethod: "POST",
      body: JSON.stringify({
        fullName: "John Doe",
        passportNumber: "test-passport-id",
        countryOfNationality: CountryCode.IND,
        countryOfIssue: CountryCode.IND,
        issueDate: "2025-01-01",
        expiryDate: "2030-01-01",
        dateOfBirth: "2000-02-07",
        sex: AllowedSex.Other,
        applicantHomeAddress1: "First Line of Address",
        townOrCity: "the-town-or-city",
        provinceOrState: "the-province",
        postcode: "the-post-code",
        country: CountryCode.BMU,
      }),
    };

    // Act
    const response: APIGatewayProxyResult = await handler(event, context);

    // Assert
    expect(response.statusCode).toBe(200);
  });
});
