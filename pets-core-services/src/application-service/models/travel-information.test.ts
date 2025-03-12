import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { beforeEach, describe, expect, test, vi } from "vitest";

import awsClients from "../../shared/clients/aws";
import { VisaOptions } from "../types/enums";
import { ITravelInformation, TravelInformation } from "./travel-information";

describe("Tests for Travel Information Model", () => {
  const ddbMock = mockClient(awsClients.dynamoDBDocClient);

  beforeEach(() => {
    ddbMock.reset();
  });

  const newTravelInformation: Omit<ITravelInformation, "dateCreated" | "status"> = {
    applicationId: "test-application-id",
    visaCategory: VisaOptions.Students,
    ukAddressLine1: "first line",
    ukAddressTownOrCity: "uk address town",
    ukAddressPostcode: "uk address postcode",
    ukMobileNumber: "uk mobile number",
    ukEmailAddress: "uk email address",
    createdBy: "test-travel-information-creator",
  };

  test("Creating new travel information", async () => {
    // Arrange
    ddbMock.on(PutCommand);
    vi.useFakeTimers();
    const expectedDateTime = "2025-03-04";
    vi.setSystemTime(expectedDateTime);

    // Act
    const travelInformation = await TravelInformation.createTravelInformation(newTravelInformation);

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
    const travelInformation = await TravelInformation.getByApplicationId(
      newTravelInformation.applicationId,
    );

    // Assert
    expect(travelInformation).toMatchObject({
      ...newTravelInformation,
      dateCreated: new Date("2025-02-07"),
    });
  });
});
