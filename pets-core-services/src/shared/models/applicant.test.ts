import { GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { AllowedSex } from "../../applicant-service/types/enums";
import awsClients from "../clients/aws";
import { CountryCode } from "../country";
import { Applicant, NewApplicant } from "./applicant";

const applicantDetails: NewApplicant = {
  applicationId: "test-application-id",
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
    const applicant = await Applicant.createNewApplicant(applicantDetails);

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
        pk: "APPLICATION#test-application-id",
        sk: "APPLICANT#DETAILS",
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(ddbMock.commandCalls(PutCommand)[0].firstArg.input).toMatchObject({
      ConditionExpression: "attribute_not_exists(pk) AND attribute_not_exists(sk)",
    });
  });

  test("Search missing Applicant details should return an empty array", async () => {
    // Arrange
    ddbMock.on(QueryCommand).resolves({
      Items: undefined,
    });

    // Act
    const searchResult = await Applicant.findByPassportId(CountryCode.ALA, "missing-applicant");

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
    const searchResult = await Applicant.findByPassportId(CountryCode.ALA, "saved-applicant");

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
    const applicant = await Applicant.getByApplicationId(applicantDetails.applicationId);

    // Assert
    expect(applicant).toMatchObject({
      ...applicantDetails,
      dateCreated: new Date("2025-02-07"),
      issueDate: new Date("2025-01-01"),
      expiryDate: new Date("2030-01-01"),
      dateOfBirth: new Date("2000-02-07"),
    });
  });
});
