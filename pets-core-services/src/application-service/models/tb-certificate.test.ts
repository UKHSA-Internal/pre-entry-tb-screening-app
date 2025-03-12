import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { beforeEach, describe, expect, test, vi } from "vitest";

import awsClients from "../../shared/clients/aws";
import { YesOrNo } from "../types/enums";
import { NewTbCertificateDetails, TbCertificate } from "./tb-certificate";

describe("Tests for TB Certificate Model", () => {
  const ddbMock = mockClient(awsClients.dynamoDBDocClient);

  beforeEach(() => {
    ddbMock.reset();
  });

  const newTbCertificate: NewTbCertificateDetails = {
    applicationId: "test-application-id",
    certificateIssued: YesOrNo.Yes,
    certificateComments: "comments",
    certificateIssueDate: "2025-01-21",
    certificateNumber: "123456",
    createdBy: "test-tb-certificate-creator",
  };

  test("Creating new tb certificate", async () => {
    // Arrange
    ddbMock.on(PutCommand);
    vi.useFakeTimers();
    const expectedDateTime = "2025-03-04";
    vi.setSystemTime(expectedDateTime);

    // Act
    const tbCertificate = await TbCertificate.createTbCertificate(newTbCertificate);

    // Assert
    expect(tbCertificate).toMatchObject({
      ...newTbCertificate,
      dateCreated: new Date(expectedDateTime),
      certificateIssueDate: new Date("2025-01-21"),
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(ddbMock.commandCalls(PutCommand)[0].firstArg.input).toMatchObject({
      TableName: "test-application-details",
      Item: {
        ...newTbCertificate,
        certificateIssueDate: "2025-01-21T00:00:00.000Z",
        pk: "APPLICATION#test-application-id",
        sk: "APPLICATION#TB#CERTIFICATE",
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(ddbMock.commandCalls(PutCommand)[0].firstArg.input).toMatchObject({
      ConditionExpression: "attribute_not_exists(pk) AND attribute_not_exists(sk)",
    });
  });

  test("Getting tb certificate by application ID", async () => {
    const dateCreated = "2025-02-07";
    ddbMock.on(GetCommand).resolves({
      Item: {
        ...newTbCertificate,
        dateCreated,
        pk: "APPLICATION#test-application-id",
        sk: "APPLICATION#TB#CERTIFICATE",
      },
    });

    // Act
    const tbCertificate = await TbCertificate.getByApplicationId(newTbCertificate.applicationId);

    // Assert
    expect(tbCertificate).toMatchObject({
      ...newTbCertificate,
      dateCreated: new Date("2025-02-07"),
      certificateIssueDate: new Date("2025-01-21"),
    });
  });
});
