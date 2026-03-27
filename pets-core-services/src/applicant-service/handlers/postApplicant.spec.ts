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

const existingApplicantDetails: PostApplicantEvent["parsedBody"] = {
  fullName: "Jane Doe",
  passportNumber: "ABC1234JANE",
  countryOfNationality: CountryCode.BRB,
  countryOfIssue: CountryCode.BRB,
  issueDate: "2007-05-12",
  expiryDate: "2012-05-12",
  dateOfBirth: "2003-05-12",
  sex: AllowedSex.Male,
  applicantHomeAddress1: "23 Long street",
  applicantHomeAddress2: "River Valley",
  applicantHomeAddress3: "Southumberland",
  townOrCity: "Mumbai",
  provinceOrState: "Mumbai",
  postcode: "1234",
  country: CountryCode.BRB,
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
    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.body)).toMatchObject(newApplicantDetails);
  });

  test("Saving a new Applicant Successfully: Support ClinicId", async () => {
    // Arrange
    const event: PostApplicantEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[0].applicationId },
      parsedBody: newApplicantDetails,
      requestContext: {
        ...mockAPIGwEvent.requestContext,
        authorizer: {
          ...mockAPIGwEvent.requestContext.authorizer,
          clinicId: process.env.VITE_SUPPORT_CLINIC_ID as string,
        },
      },
    };

    // Act
    const response = await postApplicantHandler(event);

    // Assert
    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.body)).toMatchObject(newApplicantDetails);
  });

  test("Saving an Applicant with existing passport number and country returns back the existing applicant details", async () => {
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
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject(existingApplicantDetails);
  });

  test("For an Existing Applicant- Return back the applicant details", async () => {
    // Arrange
    const parsedBody: PostApplicantEvent["parsedBody"] = {
      ...newApplicantDetails,
      passportNumber: "ABC1234JANE",
      countryOfIssue: CountryCode.BRB,
    };
    const event: PostApplicantEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[1].applicationId }, // An Applicant has been created for this Application already
      parsedBody,
    };

    // Act
    const response = await postApplicantHandler(event);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject(existingApplicantDetails);
  });

  test("Missing required body returns a 400 response", async () => {
    // Arrange
    const event: PostApplicantEvent = {
      ...mockAPIGwEvent,
    };

    // Act
    const response = await postApplicantHandler(event);

    // Assert
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Request event missing body",
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
