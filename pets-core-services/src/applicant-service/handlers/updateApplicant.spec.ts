import { describe, expect, test, vi } from "vitest";

import { CountryCode } from "../../shared/country";
import { seededApplications } from "../../shared/fixtures/application";
import { logger } from "../../shared/logger";
import { ApplicantDbOps } from "../../shared/models/applicant";
import { mockAPIGwEvent } from "../../test/mocks/events";
import { AllowedSex } from "../types/enums";
import { PutApplicantEvent, updateApplicantHandler } from "./updateApplicant";

const newApplicantDetails: PutApplicantEvent["parsedBody"] = {
  fullName: "John Doe",
  passportNumber: "test-passport-id",
  countryOfNationality: CountryCode.ALA,
  countryOfIssue: CountryCode.ALA,
  issueDate: "2025-01-01",
  expiryDate: "2030-01-01",
  dateOfBirth: "2000-02-07",
  sex: AllowedSex.Other,
  applicantHomeAddress1: "First Line of Address",
  applicantHomeAddress2: "Second Line of Address",
  applicantHomeAddress3: "Third Line of Address",
  townOrCity: "the-town-or-city",
  provinceOrState: "the-province",
  postcode: "the-post-code",
  country: CountryCode.ALA,
};

describe("Test for Updating Applicant into DB", () => {
  test("Updating an Applicant Successfully", async () => {
    // Arrange
    const event: PutApplicantEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[0].applicationId },
      parsedBody: newApplicantDetails,
    };

    // Act
    const response = await updateApplicantHandler(event);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject(newApplicantDetails);
  });

  test("Incorrect applicationId throws a 400 error", async () => {
    // Arrange
    const parsedBody: PutApplicantEvent["parsedBody"] = {
      ...newApplicantDetails,
    };
    const event: PutApplicantEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: "nonexisting-application-id" },
      parsedBody,
    };

    // Act
    const response = await updateApplicantHandler(event);

    // Assert
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Application with ID: nonexisting-application-id does not exist",
    });
  });

  test("Missing applicationId returns 400 error", async () => {
    // Arrange
    const event: PutApplicantEvent = {
      ...mockAPIGwEvent,
      parsedBody: newApplicantDetails,
    };

    // Act
    const response = await updateApplicantHandler(event);

    // Assert
    expect(response.statusCode).toBe(400);
  });

  test("Missing required Headers returns a 500 response", async () => {
    // Arrange
    const event: PutApplicantEvent = {
      ...mockAPIGwEvent,
    };

    // Act
    const response = await updateApplicantHandler(event);

    // Assert
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Internal Server Error: Request not parsed correctly",
    });
  });

  test("Any error returns a 500 response", async () => {
    // Arrange;
    const errorLoggerMock = vi.spyOn(logger, "error").mockImplementation(() => null);
    vi.spyOn(ApplicantDbOps, "updateApplicant").mockRejectedValue(Error("update error"));
    const malformedEvent: PutApplicantEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[0].applicationId },
      parsedBody: {} as PutApplicantEvent["parsedBody"],
    };

    // Act
    const response = await updateApplicantHandler(malformedEvent);

    // Assert
    expect(errorLoggerMock).toHaveBeenCalledWith(
      Error("update error"),
      "Error saving Applicant details",
    );
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Something went wrong",
    });
  });
});
