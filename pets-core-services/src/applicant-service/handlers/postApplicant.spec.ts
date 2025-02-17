import { describe, expect, test } from "vitest";

import { CountryCode } from "../../shared/country";
import { mockAPIGwEvent } from "../../test/mocks/events";
import { seededApplicants } from "../fixtures/applicants";
import { AllowedSex } from "../types/enums";
import { PostApplicantEvent, postApplicantHandler } from "./postApplicant";

const newApplicantDetails: PostApplicantEvent["parsedBody"] = {
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
  townOrCity: "the-town-or-city",
  provinceOrState: "the-province",
  postcode: "the-post-code",
  country: CountryCode.ALA,
};

describe("Test for Posting Applicant into DB", () => {
  test("Saving a new Applicant Successfully", async () => {
    // Arrange

    const event: PostApplicantEvent = {
      ...mockAPIGwEvent,
      parsedBody: newApplicantDetails,
    };

    // Act
    const response = await postApplicantHandler(event);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject({
      clinicId: "Apollo Clinic",
      ...newApplicantDetails,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      dateCreated: expect.any(String),
    });
  });

  test("Duplicate post throws a 400 error", async () => {
    // Arrange
    const existingApplicant = seededApplicants[0];
    const parsedBody: PostApplicantEvent["parsedBody"] = {
      ...newApplicantDetails,
      passportNumber: existingApplicant.passportNumber,
      countryOfIssue: existingApplicant.countryOfIssue,
    };
    const event: PostApplicantEvent = {
      ...mockAPIGwEvent,
      parsedBody,
    };

    // Act
    const response = await postApplicantHandler(event);

    // Assert
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({ message: "Applicant Details already saved" });
  });

  test("Missing required Headers returns a 500 response", async () => {
    // Arrange
    const event: PostApplicantEvent = {
      ...mockAPIGwEvent,
    };

    // Act
    const response = await postApplicantHandler(event);

    // Assert
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Internal Server Error: Request not parsed correctly",
    });
  });

  test("Any error returns a 500 response", async () => {
    // Arrange;

    const malformedEvent: PostApplicantEvent = {
      ...mockAPIGwEvent,
      parsedBody: {} as PostApplicantEvent["parsedBody"],
    };

    // Act
    const response = await postApplicantHandler(malformedEvent);

    // Assert
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Something went wrong",
    });
  });
});
