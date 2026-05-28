import { GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { beforeEach, describe, expect, test, vi } from "vitest";

import awsClients from "../../shared/clients/aws";
import { logger } from "../../shared/logger";
import { YesOrNo } from "../types/enums";
import { ISputumDecision, ISputumDecisionUpdate, SputumDecisionDbOps } from "./sputum-decision";

describe("Tests for Sputum Decision  Model", () => {
  const ddbMock = mockClient(awsClients.dynamoDBDocClient);

  beforeEach(() => {
    ddbMock.reset();
  });

  const newSputumDecision: Omit<ISputumDecision, "dateCreated" | "status"> = {
    applicationId: "test-application-id",
    sputumRequired: YesOrNo.Yes,
    createdBy: "test",
  };

  const updateSputumDecision: Omit<ISputumDecisionUpdate, "dateUpdated"> = {
    applicationId: "test-application-id",
    sputumRequired: YesOrNo.Yes,
    updatedBy: "test",
  };

  test("Creating new sputum decision", async () => {
    // Arrange
    ddbMock.on(PutCommand);
    vi.useFakeTimers();
    const expectedDateTime = "2025-03-04";
    vi.setSystemTime(expectedDateTime);

    // Act
    const sputumDecision = await SputumDecisionDbOps.createSputumDecision(newSputumDecision);

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

  test("Getting sputum decision by application ID", async () => {
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
    const sputumDecision = await SputumDecisionDbOps.getByApplicationId(
      newSputumDecision.applicationId,
    );

    // Assert
    expect(sputumDecision).toMatchObject({
      ...sputumDecision,
      dateCreated: new Date("2025-02-07"),
    });
  });

  test("No data while getting sputum decision by application ID", async () => {
    const infoLoggerMock = vi.spyOn(logger, "info").mockImplementation(() => null);
    ddbMock.on(GetCommand).resolves({
      Item: undefined,
    });

    // Act
    const sputumDecision = await SputumDecisionDbOps.getByApplicationId(
      newSputumDecision.applicationId,
    );

    // Assert
    expect(infoLoggerMock).toHaveBeenNthCalledWith(2, "No Sputum Decision found");
    expect(sputumDecision).toBeFalsy();
  });

  test("Error handling getting sputum decision by application ID", async () => {
    const errorLoggerMock = vi.spyOn(logger, "error").mockImplementation(() => null);
    ddbMock.on(GetCommand).rejects("this error");

    // Act
    await expect(
      SputumDecisionDbOps.getByApplicationId(newSputumDecision.applicationId),
    ).rejects.toThrow("this error");

    // Assert
    expect(errorLoggerMock).toHaveBeenCalledWith(
      Error("this error"),
      "Error retrieving Sputum Decision details",
    );
  });

  test("Updating sputum decisioin details", async () => {
    const pk = "APPLICATION#test-application-id";
    const sk = "APPLICATION#SPUTUM#DECISION";
    // Arrange
    ddbMock.on(UpdateCommand).resolves({
      Attributes: {
        ...updateSputumDecision,
        dateUpdated: "2025-03-04T00:00:00.000Z",
      },
    });
    vi.useFakeTimers();
    const expectedDateTime = "2025-03-04";
    vi.setSystemTime(expectedDateTime);

    // Act
    const updatedSputumDecision =
      await SputumDecisionDbOps.updateSputumDecision(updateSputumDecision);

    // Assert
    expect(updatedSputumDecision).toMatchObject({
      ...updateSputumDecision,
      dateUpdated: new Date(expectedDateTime),
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(ddbMock.commandCalls(UpdateCommand)[0].firstArg.input).toMatchObject({
      Key: { pk, sk },
      TableName: "test-application-details",
    });
  });
  test("Updating sputum decision information: should throw error if DynamoDB update fails", async () => {
    ddbMock.on(UpdateCommand).resolves({});

    await expect(SputumDecisionDbOps.updateSputumDecision(updateSputumDecision)).rejects.toThrow(
      "Update failed",
    );
  });
});
