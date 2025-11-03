import { GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { beforeEach, describe, expect, test, vi } from "vitest";

import awsClients from "../../shared/clients/aws";
import { VisaOptions } from "../types/enums";
import {
  NewTravelInformation,
  NewTravelInformationUpdate,
  TravelInformationDbOps,
} from "./travel-information";

describe("Tests for Travel Information Model", () => {
  const ddbMock = mockClient(awsClients.dynamoDBDocClient);

  beforeEach(() => {
    ddbMock.reset();
  });

  const newTravelInformation: NewTravelInformation = {
    applicationId: "test-application-id",
    visaCategory: VisaOptions.Study,
    ukAddressLine1: "first line",
    ukAddressTownOrCity: "uk address town",
    ukAddressPostcode: "uk address postcode",
    ukMobileNumber: "uk mobile number",
    ukEmailAddress: "uk email address",
    createdBy: "test-travel-information-creator",
  };

  const updateTravelInformation: NewTravelInformationUpdate = {
    applicationId: "test-application-id",
    visaCategory: VisaOptions.Study,
    ukMobileNumber: "uk mobile number",
    ukEmailAddress: "uk email address",
    updatedBy: "test-travel-information-creator",
  };
  test("Creating new travel information", async () => {
    // Arrange
    ddbMock.on(PutCommand);
    vi.useFakeTimers();
    const expectedDateTime = "2025-03-04";
    vi.setSystemTime(expectedDateTime);

    // Act
    const travelInformation =
      await TravelInformationDbOps.createTravelInformation(newTravelInformation);

    // Assert
    expect(travelInformation).toMatchObject({
      ...newTravelInformation,
      dateCreated: new Date(expectedDateTime),
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(ddbMock.commandCalls(PutCommand)[0].firstArg.input).toMatchObject({
      TableName: "test-application-details",
      Item: {
        ...newTravelInformation,
        pk: "APPLICATION#test-application-id",
        sk: "APPLICATION#TRAVEL#INFORMATION",
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(ddbMock.commandCalls(PutCommand)[0].firstArg.input).toMatchObject({
      ConditionExpression: "attribute_not_exists(pk) AND attribute_not_exists(sk)",
    });
  });

  test("Updating travel information", async () => {
    const pk = "APPLICATION#test-application-id";
    const sk = "APPLICATION#TRAVEL#INFORMATION";
    // Arrange
    ddbMock.on(UpdateCommand).resolves({
      Attributes: {
        ...updateTravelInformation,
        dateUpdated: "2025-03-04T00:00:00.000Z",
      },
    });
    vi.useFakeTimers();
    const expectedDateTime = "2025-03-04";
    vi.setSystemTime(expectedDateTime);

    // Act
    const travelInformation =
      await TravelInformationDbOps.updateTravelInformation(updateTravelInformation);

    // Assert
    expect(travelInformation).toMatchObject({
      ...updateTravelInformation,
      dateUpdated: new Date(expectedDateTime),
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(ddbMock.commandCalls(UpdateCommand)[0].firstArg.input).toMatchObject({
      Key: { pk, sk },
      TableName: "test-application-details",
    });
  });
  test("Updating travel information: should throw error if DynamoDB update fails", async () => {
    ddbMock.on(UpdateCommand).resolves({});

    await expect(
      TravelInformationDbOps.updateTravelInformation(updateTravelInformation),
    ).rejects.toThrow("Update failed");
  });
  test("Getting travel information by application ID", async () => {
    const dateCreated = "2025-02-07";
    ddbMock.on(GetCommand).resolves({
      Item: {
        ...newTravelInformation,
        dateCreated,
        pk: "APPLICATION#test-application-id",
        sk: "APPLICATION#TRAVEL#INFORMATION",
      },
    });

    // Act
    const travelInformation = await TravelInformationDbOps.getByApplicationId(
      newTravelInformation.applicationId,
    );

    // Assert
    expect(travelInformation).toMatchObject({
      ...newTravelInformation,
      dateCreated: new Date("2025-02-07"),
    });
  });

  test("Getting travel information by application ID: should throw error if DynamoDB fails", async () => {
    ddbMock.on(GetCommand).rejects(new Error("DynamoDB failure"));
    await expect(TravelInformationDbOps.getByApplicationId("test-application-id")).rejects.toThrow(
      "DynamoDB failure",
    );
  });
});
