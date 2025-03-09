import { APIGatewayProxyResult } from "aws-lambda";
import { describe, expect, test } from "vitest";

import { seededApplications } from "../../shared/fixtures/application";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { context, mockAPIGwEvent } from "../../test/mocks/events";
import { MenstrualPeriods, PregnancyStatus, VisaOptions, YesOrNo } from "../types/enums";
import { handler } from "./application";

describe("Test for Application Lambda", () => {
  test("Creating an Application Successfully", async () => {
    // Arrange
    const event: PetsAPIGatewayProxyEvent = {
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
    const event: PetsAPIGatewayProxyEvent = {
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

  describe("Travel Information", () => {
    const newTravelInfo = {
      visaCategory: VisaOptions.Students,
      ukAddressLine1: "first line",
      ukAddressLine2: "second line",
      ukAddressTownOrCity: "town or city",
      ukAddressPostcode: "uk address postcode",
      ukMobileNumber: "uk mobile number",
      ukEmailAddress: "uk email address",
    };

    test("Creating Travel Information Successfully", async () => {
      // Arrange;
      const event: PetsAPIGatewayProxyEvent = {
        ...mockAPIGwEvent,
        resource: "/application/{applicationId}/travel-information",
        path: `/application/${seededApplications[0].applicationId}/travel-information`,
        httpMethod: "POST",
        body: JSON.stringify(newTravelInfo),
      };

      // Act
      const response: APIGatewayProxyResult = await handler(event, context);

      // Assert
      expect(response.statusCode).toBe(200);
    });

    test("Validating creating travel information Successfully", async () => {
      // Arrange
      const event: PetsAPIGatewayProxyEvent = {
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

    test("Missing application throws a 400 error", async () => {
      // Arrange
      const event: PetsAPIGatewayProxyEvent = {
        ...mockAPIGwEvent,
        resource: "/application/{applicationId}/travel-information",
        path: "/application/nonexisting-application-id/travel-information",
        httpMethod: "POST",
        body: JSON.stringify(newTravelInfo),
      };

      // Act
      const response: APIGatewayProxyResult = await handler(event, context);

      // Assert
      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body)).toMatchObject({
        message: "Application with ID: nonexisting-application-id does not exist",
      });
    });

    test("Mismatch in Clinic ID throws a 400 error", async () => {
      // Arrange
      const event: PetsAPIGatewayProxyEvent = {
        ...mockAPIGwEvent,
        resource: "/application/{applicationId}/travel-information",
        path: `/application/${seededApplications[2].applicationId}/travel-information`,
        httpMethod: "POST",
        body: JSON.stringify(newTravelInfo),
      };

      // Act
      const response: APIGatewayProxyResult = await handler(event, context);

      // Assert
      expect(response.statusCode).toBe(403);
      expect(JSON.parse(response.body)).toMatchObject({
        message: "Clinic Id mismatch",
      });
    });
  });

  describe("Medical Screening", () => {
    test("Validating saving medical screening Successfully", async () => {
      // Arrange
      const event: PetsAPIGatewayProxyEvent = {
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
      const event: PetsAPIGatewayProxyEvent = {
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

  describe("Chest X-Ray", () => {
    test("Saving Chest X-Ray Successfully", async () => {
      // Arrange;
      const event: PetsAPIGatewayProxyEvent = {
        ...mockAPIGwEvent,
        resource: "/application/{applicationId}/chest-xray",
        path: `/application/${seededApplications[0].applicationId}/chest-xray`,
        httpMethod: "POST",
        body: JSON.stringify({
          chestXrayTaken: YesOrNo.Yes,
          posteroAnteriorXray: "test/bucket/path/for/posterior/anterior",
          apicalLordoticXray: "test/bucket/path/for/apical/lordotic",
          lateralDecubitusXray: "test/bucket/path/for/lateral-decubitus",
        }),
      };

      // Act
      const response: APIGatewayProxyResult = await handler(event, context);

      // Assert
      expect(response.statusCode).toBe(200);
    });

    test("Saving Chest X-Ray Not Taken Details", async () => {
      // Arrange;
      const event: PetsAPIGatewayProxyEvent = {
        ...mockAPIGwEvent,
        resource: "/application/{applicationId}/chest-xray",
        path: `/application/${seededApplications[0].applicationId}/chest-xray`,
        httpMethod: "POST",
        body: JSON.stringify({
          chestXrayTaken: YesOrNo.No,
          reasonXrayWasNotTaken: "Other",
          xrayWasNotTakenFurtherDetails: "Physician Notes",
        }),
      };

      // Act
      const response: APIGatewayProxyResult = await handler(event, context);

      // Assert
      expect(response.statusCode).toBe(200);
    });
  });
});

// TODO: Add tests for this as well as tb certs
