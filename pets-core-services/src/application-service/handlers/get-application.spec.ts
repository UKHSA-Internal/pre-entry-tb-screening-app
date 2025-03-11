import { describe, expect, test } from "vitest";

import { seededApplications } from "../../shared/fixtures/application";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { mockAPIGwEvent } from "../../test/mocks/events";
import { getApplicationHandler } from "./get-application";

describe("Getting Application Handler", () => {
  test("Missing application returns 404", async () => {
    // Arrange
    const event: PetsAPIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: "non-existing-application-ids" },
    };

    // Act
    const response = await getApplicationHandler(event);
    // Assert
    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Application does not exist",
    });
  });

  test("Fetch application successfully", async () => {
    // Arrange
    const event: PetsAPIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[1].applicationId },
    };

    // Act
    const response = await getApplicationHandler(event);
    // Assert
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      applicationId: seededApplications[1].applicationId,
      // Defined in pets-core-services/src/application-service/fixtures/travel-information.ts
      travelInformation: {
        applicationId: seededApplications[1].applicationId,
        status: "completed",
        dateCreated: expect.any(String),
        ukAddressLine1: "182 Willow Crescent",
        ukAddressLine2: "Northfield",
        ukAddressTownOrCity: "Birmingham",
        ukAddressPostcode: "B12 8QP",
        ukMobileNumber: "07001234567",
        ukEmailAddress: "JaneDoe@email.com",
        visaCategory: "Students",
      },
      // Defined in pets-core-services/src/application-service/fixtures/medical-screening.ts
      medicalScreening: {
        age: 25,
        symptomsOfTb: "Yes",
        symptoms: ["Cough", "Haemoptysis (coughing up blood)"],
        historyOfConditionsUnder11: [],
        historyOfConditionsUnder11Details: "Physician Notes",
        historyOfPreviousTb: "Yes",
        previousTbDetails: "Previous TB notes",
        contactWithPersonWithTb: "Yes",
        contactWithTbDetails: "More Physician Notes",
        pregnant: "Yes",
        haveMenstralPeriod: "Yes",
        physicalExaminationNotes: "NA",
        applicationId: seededApplications[1].applicationId,
        dateCreated: expect.any(String),
        status: "completed",
      },
      chestXray: {
        chestXrayTaken: "Yes",
        posteroAnteriorXray: "saved/bucket/path/for/posterior/anterior",
        apicalLordoticXray: "saved/bucket/path/for/apical/lordotic",
        lateralDecubitusXray: "saved/bucket/path/for/lateral-decubitus",
        xrayResult: "Chest X-ray normal",
        xrayActiveTbFindings: [],
        xrayAssociatedMinorFindings: [],
        xrayMinorFindings: [],
        applicationId: seededApplications[1].applicationId,
        dateCreated: expect.any(String),
        status: "completed",
      },
    });
  });

  test("Verify Clinic ID", async () => {
    // Arrange
    const event: PetsAPIGatewayProxyEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[1].applicationId },
      requestContext: {
        ...mockAPIGwEvent.requestContext,
        authorizer: {
          ...mockAPIGwEvent.requestContext.authorizer,
          clinicId: "compromised-clinic-id",
        },
      },
    };

    // Act
    const response = await getApplicationHandler(event);

    // Assert
    expect(response.statusCode).toBe(403);
    expect(JSON.parse(response.body)).toMatchObject({ message: "Clinic Id mismatch" });
  });
});
