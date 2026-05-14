import { describe, expect, test, vi } from "vitest";

import { CountryCode } from "../../shared/country";
import { seededApplications } from "../../shared/fixtures/application";
import { logger } from "../../shared/logger";
import { ApplicantDbOps } from "../../shared/models/applicant";
import { mockAPIGwEvent } from "../../test/mocks/events";
import { AllowedSex } from "../types/enums";
import { PostApplicantEvent, postApplicantHandler } from "./postApplicant";
import { PutApplicantEvent, updateApplicantHandler } from "./updateApplicant";

const applicantDetails: PutApplicantEvent["parsedBody"] = {
  fullName: "John Doe",
  countryOfNationality: CountryCode.ALA,
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
  passportNumber: "ABC1234JANE",
  countryOfIssue: CountryCode.BRB,
};

const newApplicantDetails: PostApplicantEvent["parsedBody"] = {
  fullName: "John Doe",
  passportNumber: "ABC1234JANE",
  countryOfIssue: CountryCode.BRB,
  countryOfNationality: CountryCode.ALA,
  issueDate: "2024-07-07",
  expiryDate: "2029-07-07",
  dateOfBirth: "1999-07-07",
  sex: AllowedSex.Other,
  applicantHomeAddress1: "First Line of Address",
  applicantHomeAddress2: "Second Line of Address",
  applicantHomeAddress3: "Third Line of Address",
  townOrCity: "the-town-or-city",
  provinceOrState: "the-province",
  postcode: "the-post-code",
  country: CountryCode.KOR,
};

const applicantDetailsMultiApp: PostApplicantEvent["parsedBody"] = {
  fullName: "Kathy Jones",
  passportNumber: "Test2",
  countryOfNationality: CountryCode.ARG,
  countryOfIssue: CountryCode.ARG,
  issueDate: "2025-01-01",
  expiryDate: "2030-01-01",
  dateOfBirth: "2000-02-07",
  sex: AllowedSex.Female,
  applicantHomeAddress1: "23 Long street",
  applicantHomeAddress2: "River Valley",
  applicantHomeAddress3: "Southumberland",
  townOrCity: "JohannesBurg",
  provinceOrState: "",
  country: CountryCode.ARG,
  postcode: "1234",
};

const newApplicantDetailsMultiApp: PutApplicantEvent["parsedBody"] = {
  passportNumber: "Test2",
  countryOfIssue: CountryCode.ARG,
  applicantHomeAddress1: "45 Long street",
};
describe("Test for Updating Applicant into DB", () => {
  test("Handling error while updating non-existent Applicant", async () => {
    // Arrange
    const errorLoggerMock = vi.spyOn(logger, "error").mockImplementation(() => null);
    const event: PutApplicantEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[0].applicationId, superuser: "false" },
      parsedBody: { ...applicantDetails, passportNumber: "test" },
    };

    // Act
    const response = await updateApplicantHandler(event);

    // Assert
    expect(errorLoggerMock).toHaveBeenNthCalledWith(1, "Applicant does not exist");
    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Applicant does not exist",
    });
  });

  test("Updating an Applicant Successfully-first in progress application", async () => {
    // Arrange
    const event: PutApplicantEvent = {
      ...mockAPIGwEvent,
      requestContext: {
        ...mockAPIGwEvent.requestContext,
        authorizer: { clinicId: "UK/LHR/00/", createdBy: "hardcoded@user.com", superuser: "false" },
      },
      pathParameters: { applicationId: seededApplications[1].applicationId },
      parsedBody: applicantDetails,
    };
    // Create an applicant
    const eventPOST: PostApplicantEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[1].applicationId },
      parsedBody: newApplicantDetails,
    };
    await postApplicantHandler(eventPOST);

    // Act
    const response = await updateApplicantHandler(event);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject(applicantDetails);
  });
  test("Updating an Applicant Successfully-multi application-limited fields to update", async () => {
    // Arrange
    const event: PutApplicantEvent = {
      ...mockAPIGwEvent,
      requestContext: {
        ...mockAPIGwEvent.requestContext,
        authorizer: { clinicId: "UK/LHR/00/", createdBy: "hardcoded@user.com", superuser: "false" },
      },
      pathParameters: { applicationId: seededApplications[6].applicationId },
      parsedBody: newApplicantDetailsMultiApp,
    };
    // Create an applicant
    const eventPOST: PostApplicantEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[6].applicationId },
      parsedBody: applicantDetailsMultiApp,
    };
    await postApplicantHandler(eventPOST);

    // Act
    const response = await updateApplicantHandler(event);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject({
      fullName: "Kathy Jones",
      passportNumber: "Test2",
      countryOfNationality: CountryCode.ARG,
      countryOfIssue: CountryCode.ARG,
      issueDate: "2025-01-01",
      expiryDate: "2030-01-01",
      dateOfBirth: "2000-02-07",
      sex: AllowedSex.Female,
      applicantHomeAddress1: "45 Long street",
      applicantHomeAddress2: "River Valley",
      applicantHomeAddress3: "Southumberland",
      townOrCity: "JohannesBurg",
      provinceOrState: "",
      country: CountryCode.ARG,
      postcode: "1234",
    });
  });

  test("Validation Error -Updating an Applicant-multi application-limited fields to update", async () => {
    // Arrange
    const event: PutApplicantEvent = {
      ...mockAPIGwEvent,
      requestContext: {
        ...mockAPIGwEvent.requestContext,
        authorizer: { clinicId: "UK/LHR/00/", createdBy: "hardcoded@user.com", superuser: "false" },
      },
      pathParameters: { applicationId: seededApplications[6].applicationId },
      parsedBody: { ...newApplicantDetailsMultiApp, fullName: "test" },
    };
    // Create an applicant
    const eventPOST: PostApplicantEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[6].applicationId },
      parsedBody: applicantDetailsMultiApp,
    };
    await postApplicantHandler(eventPOST);

    // Act
    const response = await updateApplicantHandler(event);

    // Assert
    expect(response.statusCode).toBe(422);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Validation Failed",
    });
  });
  test("Updating an Applicant Successfully as a Superuser", async () => {
    // Arrange
    const event: PutApplicantEvent = {
      ...mockAPIGwEvent,
      requestContext: {
        ...mockAPIGwEvent.requestContext,
        authorizer: { clinicId: "UK/LHR/00/", createdBy: "hardcoded@user.com", superuser: "true" },
      },
      pathParameters: { applicationId: seededApplications[1].applicationId },
      parsedBody: applicantDetails,
    };
    // Create an applicant
    const eventPOST: PostApplicantEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[1].applicationId },
      parsedBody: newApplicantDetails,
    };
    await postApplicantHandler(eventPOST);

    // Act
    const response = await updateApplicantHandler(event);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject(applicantDetails);
  });
  test("Updating an Applicant - using support clinicId", async () => {
    // Arrange
    const event: PutApplicantEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[0].applicationId },
      parsedBody: applicantDetails,

      requestContext: {
        ...mockAPIGwEvent.requestContext,
        authorizer: {
          ...mockAPIGwEvent.requestContext.authorizer,
          clinicId: process.env.VITE_SUPPORT_CLINIC_ID as string,
          superuser: "false",
        },
      },
    };
    // Create an applicant
    const eventPOST: PostApplicantEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[0].applicationId },
      parsedBody: newApplicantDetails,
    };
    await postApplicantHandler(eventPOST);

    // Act
    const response = await updateApplicantHandler(event);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject(applicantDetails);
  });
  test("Applicant does not exist error", async () => {
    // Arrange
    const parsedBody: PutApplicantEvent["parsedBody"] = {
      ...applicantDetails,
      passportNumber: "test",
    };
    const event: PutApplicantEvent = {
      ...mockAPIGwEvent,
      requestContext: {
        ...mockAPIGwEvent.requestContext,
        authorizer: { clinicId: "UK/LHR/00/", createdBy: "hardcoded@user.com", superuser: "false" },
      },
      pathParameters: { applicationId: "nonexisting-application-id" },
      parsedBody,
    };

    // Act
    const response = await updateApplicantHandler(event);

    // Assert
    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Applicant does not exist",
    });
  });

  test("Missing required body returns a 400 response", async () => {
    // Arrange
    const event: PutApplicantEvent = {
      ...mockAPIGwEvent,
      requestContext: {
        ...mockAPIGwEvent.requestContext,
        authorizer: { clinicId: "UK/LHR/00/", createdBy: "hardcoded@user.com", superuser: "false" },
      },
    };

    // Act
    const response = await updateApplicantHandler(event);

    // Assert
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Request event missing body",
    });
  });

  test("Any error returns a 500 response", async () => {
    // Arrange;
    const errorLoggerMock = vi.spyOn(logger, "error").mockImplementation(() => null);
    vi.spyOn(ApplicantDbOps, "updateApplicant").mockRejectedValue(Error("update error"));
    // Arrange
    const event: PutApplicantEvent = {
      ...mockAPIGwEvent,
      requestContext: {
        ...mockAPIGwEvent.requestContext,
        authorizer: { clinicId: "UK/LHR/00/", createdBy: "hardcoded@user.com", superuser: "false" },
      },
      pathParameters: { applicationId: seededApplications[1].applicationId },
      parsedBody: applicantDetails,
    };
    // Create an applicant
    const eventPOST: PostApplicantEvent = {
      ...mockAPIGwEvent,
      pathParameters: { applicationId: seededApplications[1].applicationId },
      parsedBody: newApplicantDetails,
    };
    await postApplicantHandler(eventPOST);

    // Act
    const response = await updateApplicantHandler(event);

    // Assert
    expect(errorLoggerMock).toHaveBeenCalledWith(
      Error("update error"),
      "Error updating Applicant details",
    );
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      message: "Something went wrong",
    });
  });
});
