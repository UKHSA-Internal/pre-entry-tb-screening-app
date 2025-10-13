import { describe, expect, test, vi } from "vitest";

import { seededApplications } from "../../shared/fixtures/application";
import { mockAPIGwEvent } from "../../test/mocks/events";
// import { seededTravelInformation } from "../fixtures/travel-information";
import { VisaOptions } from "../types/enums";
import {
  UpdateTravelInformationEvent,
  updateTravelInformationHandler,
} from "./update-travel-information";

const updateTravelDetails: UpdateTravelInformationEvent["parsedBody"] = {
  visaCategory: VisaOptions.Work,
  ukMobileNumber: "uk mobile number",
  ukEmailAddress: "uk email address",
};

describe("Test for Updating Travel Information into DB", () => {
  test("Updating travel Information Successfully", async () => {
    // Arrange
    const event: UpdateTravelInformationEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[0].applicationId },
      parsedBody: updateTravelDetails,
    };

    // Act
    const response = await updateTravelInformationHandler(event);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject({
      applicationId: seededApplications[0].applicationId,
      ...updateTravelDetails,
      dateUpdated: expect.any(String),
    });
  });

  // test("Duplicate post throws a 400 error", async () => {
  //   // Arrange
  //   const existingTravelInformation = seededTravelInformation[0];
  //   const event: UpdateTravelInformationEvent = {
  //     ...mockAPIGwEvent,
  //     pathParameters: { applicationId: seededApplications[1].applicationId },
  //     parsedBody: existingTravelInformation,
  //   };

  //   // Act
  //   const response = await updateTravelInformationHandler(event);

  //   // Assert
  //   expect(response.statusCode).toBe(400);
  //   expect(JSON.parse(response.body)).toMatchObject({ message: "Travel Details already saved" });
  // });

  test("Missing required body returns a 500 response", async () => {
    // Arrange
    const event: UpdateTravelInformationEvent = {
      ...mockAPIGwEvent,
    };

    // Act
    const response = await updateTravelInformationHandler(event);

    // Assert
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Internal Server Error: Travel Information Request not parsed correctly",
    });
  });

  test("Any error returns a 500 response", async () => {
    // Arrange;
    vi.spyOn(global, "decodeURIComponent").mockImplementationOnce(() => {
      throw new Error("Malformed URI");
    });
    const event: UpdateTravelInformationEvent = {
      ...mockAPIGwEvent,
    };

    // Act
    const response = await updateTravelInformationHandler(event);

    // Assert
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Something went wrong",
    });
  });
});
