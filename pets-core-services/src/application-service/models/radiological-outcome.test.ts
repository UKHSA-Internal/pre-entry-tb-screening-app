import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { beforeEach, describe, expect, test, vi } from "vitest";

import awsClients from "../../shared/clients/aws";
import { IRadiologicalOutcome, RadiologicalOutcome } from "./radiological-outcome";

describe("Tests for Medical Screening Information Model", () => {
  const ddbMock = mockClient(awsClients.dynamoDBDocClient);

  beforeEach(() => {
    ddbMock.reset();
  });

  const newRadiologicalOutcome: Omit<IRadiologicalOutcome, "dateCreated" | "status"> = {
    applicationId: "test-application-id",
    xrayResult: "Chest X-ray normal",
    xrayResultDetail: "Result details",
    xrayMinorFindings: ["Minor Findings"],
    xrayAssociatedMinorFindings: ["Associated Minor Findings"],
    xrayActiveTbFindings: ["Active TB Findings"],
  };

  test("Creating new medical sreening", async () => {
    // Arrange
    ddbMock.on(PutCommand);
    vi.useFakeTimers();
    const expectedDateTime = "2025-03-04";
    vi.setSystemTime(expectedDateTime);

    // Act
    const radiologicalOutcome =
      await RadiologicalOutcome.createRadiologicalOutcome(newRadiologicalOutcome);

    // Assert
    expect(radiologicalOutcome).toMatchObject({
      ...newRadiologicalOutcome,
      dateCreated: new Date(expectedDateTime),
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(ddbMock.commandCalls(PutCommand)[0].firstArg.input).toMatchObject({
      TableName: "test-application-details",
      Item: {
        ...newRadiologicalOutcome,
        pk: "APPLICATION#test-application-id",
        sk: "APPLICATION#RADIOLOGICAL#OUTCOME",
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
        ...newRadiologicalOutcome,
        dateCreated,
        pk: "APPLICATION#test-application-id",
        sk: "APPLICATION#RADIOLOGICAL#OUTCOME",
      },
    });

    // Act
    const radiologicalOutcome = await RadiologicalOutcome.getByApplicationId(
      newRadiologicalOutcome.applicationId,
    );

    // Assert
    expect(radiologicalOutcome).toMatchObject({
      ...radiologicalOutcome,
      dateCreated: new Date("2025-02-07"),
    });
  });

  test("Handling error while creating medical screening", async () => {
    // Arrange
    ddbMock.on(PutCommand).rejects("ErR0r");

    // Act
    await expect(
      RadiologicalOutcome.createRadiologicalOutcome(newRadiologicalOutcome),
    ).rejects.toThrow("ErR0r");
  });
});
