import { describe, expect, test, vi } from "vitest";

import { seededApplications } from "../../shared/fixtures/application";
import { mockAPIGwEvent } from "../../test/mocks/events";
import { seededTravelInformation } from "../fixtures/travel-information";
import { VisaOptions } from "../types/enums";
import {
  SaveTravelInformationEvent,
  saveTravelInformationHandler,
} from "./save-travel-information";

const newTravelDetails: SaveTravelInformationEvent["parsedBody"] = {
  visaCategory: VisaOptions.Students,
  ukAddressLine1: "first line",
  ukAddressTownOrCity: "uk address town",
  ukAddressPostcode: "uk address postcode",
  ukMobileNumber: "uk mobile number",
  ukEmailAddress: "uk email address",
};

describe("Test for Saving Travel Information into DB", () => {
  test("Saving a new travel Information Successfully", async () => {
    // Arrange
    const event: SaveTravelInformationEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[0].applicationId },
      parsedBody: newTravelDetails,
    };

    // Act
    const response = await saveTravelInformationHandler(event);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject({
      applicationId: seededApplications[0].applicationId,
      ...newTravelDetails,
      dateCreated: expect.any(String),
    });
  });

  test("Missing application throws a 400 error", async () => {
    // Arrange
    const event: SaveTravelInformationEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: "nonexisting-application-id" },
      parsedBody: newTravelDetails,
    };

    // Act
    const response = await saveTravelInformationHandler(event);

    // Assert
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Application with ID: nonexisting-application-id does not exist",
    });
  });

  test("Mismatch in Clinic ID throws a 400 error", async () => {
    // Arrange
    const event: SaveTravelInformationEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[2].applicationId },
      parsedBody: newTravelDetails,
    };

    // Act
    const response = await saveTravelInformationHandler(event);

    // Assert
    expect(response.statusCode).toBe(403);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Clinic Id mismatch",
    });
  });

  test("Duplicate post throws a 400 error", async () => {
    // Arrange
    const existingTravelInformation = seededTravelInformation[0];
    const event: SaveTravelInformationEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[1].applicationId },
      parsedBody: existingTravelInformation,
    };

    // Act
    const response = await saveTravelInformationHandler(event);

    // Assert
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({ message: "Travel Details already saved" });
  });

  test("Missing required body returns a 500 response", async () => {
    // Arrange
    const event: SaveTravelInformationEvent = {
      ...mockAPIGwEvent,
    };

    // Act
    const response = await saveTravelInformationHandler(event);

    // Assert
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Internal Server Error: Request not parsed correctly",
    });
  });

  test("Any error returns a 500 response", async () => {
    // Arrange;
    vi.spyOn(global, "decodeURIComponent").mockImplementationOnce(() => {
      throw new Error("Malformed URI");
    });
    const event: SaveTravelInformationEvent = {
      ...mockAPIGwEvent,
    };

    // Act
    const response = await saveTravelInformationHandler(event);

    // Assert
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Something went wrong",
    });
  });
});
