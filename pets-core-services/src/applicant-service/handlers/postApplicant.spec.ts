import { describe, expect, test } from "vitest";

import { CountryCode } from "../../shared/country";
import { seededApplications } from "../../shared/fixtures/application";
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
  applicantHomeAddress3: "Third Line of Address",
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
      pathParameters: { applicationId: seededApplications[0].applicationId },
      parsedBody: newApplicantDetails,
    };

    // Act
    const response = await postApplicantHandler(event);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject({
      ...newApplicantDetails,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      dateCreated: expect.any(String),
    });
  });

  test("Missing application throws a 400 error", async () => {
    // Arrange
    const parsedBody: PostApplicantEvent["parsedBody"] = {
      ...newApplicantDetails,
    };
    const event: PostApplicantEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: "nonexisting-application-id" },
      parsedBody,
    };

    // Act
    const response = await postApplicantHandler(event);

    // Assert
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Application with ID: nonexisting-application-id does not exist",
    });
  });

  test("Mismatch in Clinic ID throws a 400 error", async () => {
    // Arrange
    const parsedBody: PostApplicantEvent["parsedBody"] = {
      ...newApplicantDetails,
    };

    const event: PostApplicantEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[2].applicationId },
      parsedBody,
    };

    // Act
    const response = await postApplicantHandler(event);

    // Assert
    expect(response.statusCode).toBe(403);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Clinic Id mismatch",
    });
  });

  test("Existing passport number and country throws a 400 error", async () => {
    // Arrange
    const existingApplicant = seededApplicants[0];
    const parsedBody: PostApplicantEvent["parsedBody"] = {
      ...newApplicantDetails,
      passportNumber: existingApplicant.passportNumber,
      countryOfIssue: existingApplicant.countryOfIssue,
    };
    const event: PostApplicantEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[0].applicationId },
      parsedBody,
    };

    // Act
    const response = await postApplicantHandler(event);

    // Assert
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "A record with this applicant details has already been saved",
    });
  });

  test("Duplicate post throws a 400 error", async () => {
    // Arrange
    const parsedBody: PostApplicantEvent["parsedBody"] = {
      ...newApplicantDetails,
      passportNumber: "new-passport-id",
      countryOfIssue: CountryCode.FSM,
    };
    const event: PostApplicantEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[1].applicationId }, // An Applicant has been created for this Application already
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
