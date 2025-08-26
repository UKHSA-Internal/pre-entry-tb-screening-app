import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { beforeEach, describe, expect, test, vi } from "vitest";

import awsClients from "../../shared/clients/aws";
import { YesOrNo } from "../types/enums";
import { ISputumDecision, SputumDecision } from "./sputum-decision";

describe("Tests for Medical Screening Information Model", () => {
  const ddbMock = mockClient(awsClients.dynamoDBDocClient);

  beforeEach(() => {
    ddbMock.reset();
  });

  const newSputumDecision: Omit<ISputumDecision, "dateCreated" | "status"> = {
    applicationId: "test-application-id",
    sputumRequired: YesOrNo.Yes,
  };

  test("Creating new sputum decision", async () => {
    // Arrange
    ddbMock.on(PutCommand);
    vi.useFakeTimers();
    const expectedDateTime = "2025-03-04";
    vi.setSystemTime(expectedDateTime);

    // Act
    const sputumDecision = await SputumDecision.createSputumDecision(newSputumDecision);

    // Assert
    expect(sputumDecision).toMatchObject({
      ...newSputumDecision,
      dateCreated: new Date(expectedDateTime),
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(ddbMock.commandCalls(PutCommand)[0].firstArg.input).toMatchObject({
      TableName: "test-application-details",
      Item: {
        ...newSputumDecision,
        pk: "APPLICATION#test-application-id",
        sk: "APPLICATION#SPUTUM#DECISION",
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(ddbMock.commandCalls(PutCommand)[0].firstArg.input).toMatchObject({
      ConditionExpression: "attribute_not_exists(pk) AND attribute_not_exists(sk)",
    });
  });

  test("Getting medical screening by application ID", async () => {
    const dateCreated = "2025-02-07";
    ddbMock.on(GetCommand).resolves({
      Item: {
        ...newSputumDecision,
        dateCreated,
        pk: "APPLICATION#test-application-id",
        sk: "APPLICATION#MEDICAL#SCREENING",
      },
    });

    // Act
    const sputumDecision = await SputumDecision.getByApplicationId(newSputumDecision.applicationId);

    // Assert
    expect(sputumDecision).toMatchObject({
      ...sputumDecision,
      dateCreated: new Date("2025-02-07"),
    });
  });
});
