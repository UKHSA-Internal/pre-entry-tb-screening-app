import { GetCommand, PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { AllowedSex } from "../../applicant-service/types/enums";
import awsClients from "../clients/aws";
import { CountryCode } from "../country";
import { seededApplications } from "../fixtures/application";
import { logger } from "../logger";
import { ApplicantDbOps, NewApplicant, UpdatedApplicant } from "./applicant";

const applicantDetails: NewApplicant = {
  applicationId: seededApplications[2].applicationId,
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
  createdBy: "test-applicant-creator",
};

describe("Tests for Applicant Model", () => {
  const ddbMock = mockClient(awsClients.dynamoDBDocClient);

  beforeEach(() => {
    ddbMock.reset();
  });

  test("Create New Applicant Successfully", async () => {
    // Arrange
    ddbMock.on(PutCommand);
    vi.useFakeTimers();
    const expectedDateTime = "2025-03-04";
    vi.setSystemTime(expectedDateTime);

    // Act
    const applicant = await ApplicantDbOps.createNewApplicant(applicantDetails);

    // Assert
    expect(applicant).toMatchObject({
      ...applicantDetails,
      dateCreated: new Date(expectedDateTime),
      issueDate: new Date("2025-01-01"),
      expiryDate: new Date("2030-01-01"),
      dateOfBirth: new Date("2000-02-07"),
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(ddbMock.commandCalls(PutCommand)[0].firstArg.input).toMatchObject({
      TableName: "test-applicant-details",
      Item: {
        ...applicantDetails,
        issueDate: "2025-01-01T00:00:00.000Z",
        expiryDate: "2030-01-01T00:00:00.000Z",
        dateOfBirth: "2000-02-07T00:00:00.000Z",
        passportId: "COUNTRY#ALA#PASSPORT#test-passport-id",
        pk: "APPLICATION#generated-app-id-3",
        sk: "APPLICANT#DETAILS",
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(ddbMock.commandCalls(PutCommand)[0].firstArg.input).toMatchObject({
      ConditionExpression: "attribute_not_exists(pk) AND attribute_not_exists(sk)",
    });
  });

  test("Update an Applicant Successfully", async () => {
    // Arrange
    vi.useFakeTimers();
    const expectedDateTime = "2025-03-04";
    vi.setSystemTime(expectedDateTime);
    ddbMock.on(GetCommand).resolvesOnce({
      Item: seededApplications[2],
    });
    ddbMock.on(UpdateCommand).resolves({
      Attributes: {
        ...applicantDetails,
        dateCreated: "2025-03-04T00:00:00.000Z",
        dateOfBirth: "2000-02-07T00:00:00.000Z",
        dateUpdated: new Date(expectedDateTime).toISOString(),
        expiryDate: "2030-01-01T00:00:00.000Z",
        issueDate: "2025-01-01T00:00:00.000Z",
      },
    });

    // Act
    await ApplicantDbOps.updateApplicant({
      ...applicantDetails,
      updatedBy: "updater name",
    } as UpdatedApplicant);

    // Assert
    expect(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      ddbMock.commandCalls(UpdateCommand)[0].firstArg.input.ExpressionAttributeValues,
    ).toMatchObject({
      ":applicantHomeAddress1": "First Line of Address",
      ":applicantHomeAddress2": "Second Line of Address",
      ":applicantHomeAddress3": "Third Line of Address",
      ":applicationId": "generated-app-id-3",
      ":country": "ALA",
      ":countryOfNationality": "ALA",
      ":createdBy": "test-applicant-creator",
      ":dateOfBirth": "2000-02-07",
      ":dateUpdated": "2025-03-04T00:00:00.000Z",
      ":expiryDate": "2030-01-01",
      ":fullName": "John Doe",
      ":issueDate": "2025-01-01",
      ":postcode": "the-post-code",
      ":provinceOrState": "the-province",
      ":sex": "Other",
      ":townOrCity": "the-town-or-city",
      ":updatedBy": "updater name",
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(ddbMock.commandCalls(UpdateCommand)[0].firstArg.input).toMatchObject({
      ConditionExpression: "attribute_exists(pk) AND attribute_exists(sk)",
    });
  });

  test("Search missing Applicant details should return an empty array", async () => {
    // Arrange
    ddbMock.on(QueryCommand).resolves({
      Items: undefined,
    });

    // Act
    const searchResult = await ApplicantDbOps.findByPassportId(
      CountryCode.ALA,
      "missing-applicant",
    );

    // Assert
    expect(searchResult).toHaveLength(0);
  });

  test("Search existing applicant details", async () => {
    // Arrange
    vi.useFakeTimers();
    vi.setSystemTime("2025-03-04");

    const dateCreated = "2025-02-07";
    ddbMock.on(QueryCommand).resolves({
      Items: [
        {
          ...applicantDetails,
          dateCreated,
          issueDate: "2025-01-01T00:00:00.000Z",
          expiryDate: "2030-01-01T00:00:00.000Z",
          dateOfBirth: "2000-02-07T00:00:00.000Z",
          passportId: "COUNTRY#ALA#PASSPORT#saved-applicant",
          pk: "APPLICATION#test-application-id",
          sk: "APPLICANT#DETAILS",
        },
      ],
    });

    // Act
    const searchResult = await ApplicantDbOps.findByPassportId(CountryCode.ALA, "saved-applicant");

    // Assert
    expect(searchResult).toHaveLength(1);
    expect(searchResult[0]).toMatchObject({
      ...applicantDetails,
      dateCreated: new Date(dateCreated),
      issueDate: new Date("2025-01-01"),
      expiryDate: new Date("2030-01-01"),
      dateOfBirth: new Date("2000-02-07"),
    });
  });

  test("Getting applicant by application ID", async () => {
    const dateCreated = "2025-02-07";
    ddbMock.on(GetCommand).resolves({
      Item: {
        ...applicantDetails,
        dateCreated,
        pk: "APPLICATION#test-application-id",
        sk: "APPLICANT#DETAILS",
      },
    });

    // Act
    const applicant = await ApplicantDbOps.getByApplicationId(applicantDetails.applicationId);

    // Assert
    expect(applicant).toMatchObject({
      ...applicantDetails,
      dateCreated: new Date("2025-02-07"),
      issueDate: new Date("2025-01-01"),
      expiryDate: new Date("2030-01-01"),
      dateOfBirth: new Date("2000-02-07"),
    });
  });

  test("Error handling while updating an applicant details", async () => {
    const errorLoggerMock = vi.spyOn(logger, "error").mockImplementation(() => null);
    ddbMock.on(GetCommand).resolvesOnce({
      Item: seededApplications[0],
    });
    ddbMock.on(UpdateCommand);

    // Act / Assert
    try {
      await ApplicantDbOps.updateApplicant({
        country: CountryCode.KOR,
        applicationId: "whatever",
        updatedBy: "me",
      });
    } catch (err) {
      expect(err).toThrow(new TypeError("obj is not a function"));
    }
    expect(errorLoggerMock).toHaveBeenCalledWith(
      TypeError("Cannot read properties of undefined (reading 'Attributes')"),
      "Error updating applicant details",
    );
  });

  test("No attributes handling while updating an applicant", async () => {
    const errorLoggerMock = vi.spyOn(logger, "error").mockImplementation(() => null);
    ddbMock.on(GetCommand).resolvesOnce({
      Item: seededApplications[0],
    });
    ddbMock.on(UpdateCommand).resolves({ Attributes: undefined });

    // Act / Assert
    try {
      await ApplicantDbOps.updateApplicant({
        country: CountryCode.KOR,
        applicationId: "oneofthem",
        updatedBy: "admin",
      });
    } catch (err) {
      expect(err).toThrow(new TypeError("obj is not a function"));
    }
    expect(errorLoggerMock).toHaveBeenCalledWith(
      Error("Applicant update failed"),
      "Error updating applicant details",
    );
  });
});
