import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { beforeEach, describe, expect, test, vi } from "vitest";

import awsClients from "../../shared/clients/aws";
import { logger } from "../../shared/logger";
import { ChestXRay, NewChestXRay } from "./chest-xray";

describe("Test for Chest X-Ray Db Ops Class", () => {
  const ddbMock = mockClient(awsClients.dynamoDBDocClient);

  beforeEach(() => {
    ddbMock.reset();
  });

  const newChestXray: NewChestXRay = {
    applicationId: "test-application-id",
    createdBy: "test-chest-xray-creator",
    dateXrayTaken: "2025-05-05",
    posteroAnteriorXrayFileName: "posterior-anterior.dicom",
    posteroAnteriorXray: "saved/bucket/path/for/posterior/anterior",
    apicalLordoticXrayFileName: "apical-lordotic.dicom",
    apicalLordoticXray: "saved/bucket/path/for/apical/lordotic",
    lateralDecubitusXrayFileName: "lateral-decubitus.dicom",
    lateralDecubitusXray: "saved/bucket/path/for/lateral/decubitus",
  };

  test("Creating new X-ray record for Chest X-ray taken", async () => {
    // Arrange
    ddbMock.on(PutCommand);
    vi.useFakeTimers();
    const expectedDateTime = "2025-03-04";
    vi.setSystemTime(expectedDateTime);

    // Act
    const chestXray = await ChestXRay.createChestXray(newChestXray);

    // Assert
    expect(chestXray).toMatchObject({
      ...newChestXray,
      dateXrayTaken: new Date("2025-05-05"),
      dateCreated: new Date(expectedDateTime),
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(ddbMock.commandCalls(PutCommand)[0].firstArg.input).toMatchObject({
      TableName: "test-application-details",
      Item: {
        ...newChestXray,
        dateXrayTaken: new Date("2025-05-05").toISOString(),
        pk: "APPLICATION#test-application-id",
        sk: "APPLICATION#CHEST#XRAY",
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(ddbMock.commandCalls(PutCommand)[0].firstArg.input).toMatchObject({
      ConditionExpression: "attribute_not_exists(pk) AND attribute_not_exists(sk)",
    });
  });

  test("Getting taken X-ray by application ID", async () => {
    const dateCreated = "2025-02-07";

    ddbMock.on(GetCommand).resolves({
      Item: {
        ...newChestXray,
        dateCreated,
        pk: "APPLICATION#test-application-id",
        sk: "APPLICATION#CHEST#XRAY",
      },
    });

    // Act
    const chestXray = await ChestXRay.getByApplicationId(newChestXray.applicationId);

    // Assert
    expect(chestXray).toMatchObject({
      ...chestXray,
      dateCreated: new Date("2025-02-07"),
    });
  });

  test("Handling error while getting Chest X-ray by applicationId", async () => {
    const errorLoggerMock = vi.spyOn(logger, "error").mockImplementation(() => null);
    ddbMock.on(GetCommand).rejects(Error("DB error"));

    // Act / Assert
    await expect(ChestXRay.getByApplicationId(newChestXray.applicationId)).rejects.toThrow(
      "DB error",
    );
    expect(errorLoggerMock).toHaveBeenCalledWith(Error("DB error"), "Error retrieving Chest X-ray");
  });
});
