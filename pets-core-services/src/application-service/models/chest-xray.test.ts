import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { beforeEach, describe, expect, test, vi } from "vitest";

import awsClients from "../../shared/clients/aws";
import { ChestXRayNotTakenReason, YesOrNo } from "../types/enums";
import { ChestXRayDbOps, NewChestXRayNotTaken, NewChestXRayTaken } from "./chest-xray";

describe("Test for Chest X-Ray Db Ops Class", () => {
  const ddbMock = mockClient(awsClients.dynamoDBDocClient);

  beforeEach(() => {
    ddbMock.reset();
  });

  const newChestXrayTaken: NewChestXRayTaken = {
    applicationId: "test-application-id",
    createdBy: "test-chest-xray-creator",
    chestXrayTaken: YesOrNo.Yes,
    dateXrayTaken: "2025-05-05",
    posteroAnteriorXrayFileName: "posterior-anterior.dicom",
    posteroAnteriorXray: "saved/bucket/path/for/posterior/anterior",
    apicalLordoticXrayFileName: "apical-lordotic.dicom",
    apicalLordoticXray: "saved/bucket/path/for/apical/lordotic",
    lateralDecubitusXrayFileName: "lateral-decubitus.dicom",
    lateralDecubitusXray: "saved/bucket/path/for/lateral/decubitus",
  };

  const newChestXrayNotTaken: NewChestXRayNotTaken = {
    applicationId: "test-application-id",
    createdBy: "test-chest-xray-creator",
    chestXrayTaken: YesOrNo.No,
    reasonXrayWasNotTaken: ChestXRayNotTakenReason.Other,
    xrayWasNotTakenFurtherDetails: "Extra Notes",
  };

  test("Creating new X-ray record for Chest X-ray taken", async () => {
    // Arrange
    ddbMock.on(PutCommand);
    vi.useFakeTimers();
    const expectedDateTime = "2025-03-04";
    vi.setSystemTime(expectedDateTime);

    // Act
    const chestXray = await ChestXRayDbOps.createChestXray(newChestXrayTaken);

    // Assert
    expect(chestXray).toMatchObject({
      ...newChestXrayTaken,
      dateXrayTaken: new Date("2025-05-05"),
      dateCreated: new Date(expectedDateTime),
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(ddbMock.commandCalls(PutCommand)[0].firstArg.input).toMatchObject({
      TableName: "test-application-details",
      Item: {
        ...newChestXrayTaken,
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

  test("Creating new X-ray record for Chest X-ray not taken", async () => {
    // Arrange
    ddbMock.on(PutCommand);
    vi.useFakeTimers();
    const expectedDateTime = "2025-03-04";
    vi.setSystemTime(expectedDateTime);

    // Act
    const chestXray = await ChestXRayDbOps.createChestXray(newChestXrayNotTaken);

    // Assert
    expect(chestXray).toMatchObject({
      ...newChestXrayNotTaken,
      dateCreated: new Date(expectedDateTime),
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(ddbMock.commandCalls(PutCommand)[0].firstArg.input).toMatchObject({
      TableName: "test-application-details",
      Item: {
        ...newChestXrayNotTaken,
        pk: "APPLICATION#test-application-id",
        sk: "APPLICATION#CHEST#XRAY",
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(ddbMock.commandCalls(PutCommand)[0].firstArg.input).toMatchObject({
      ConditionExpression: "attribute_not_exists(pk) AND attribute_not_exists(sk)",
    });
  });

  test.each([
    {
      newChestXray: newChestXrayTaken,
      title: "Chest X-ray taken",
    },
    {
      newChestXray: newChestXrayNotTaken,
      title: "Chest X-ray not taken",
    },
  ])("Getting taken X-ray by application ID", async ({ newChestXray }) => {
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
    const chestXray = await ChestXRayDbOps.getByApplicationId(newChestXray.applicationId);

    // Assert
    expect(chestXray).toMatchObject({
      ...chestXray,
      dateCreated: new Date("2025-02-07"),
    });
  });
});
