import { GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { beforeEach, describe, expect, test, vi } from "vitest";

import awsClients from "../../shared/clients/aws";
import { YesOrNo } from "../types/enums";
import {
  ITbCertificateDetailsUpdate,
  NewTbCertificateIssuedDetails,
  TbCertificateDbOps,
} from "./tb-certificate";

describe("Tests for TB Certificate Model", () => {
  const ddbMock = mockClient(awsClients.dynamoDBDocClient);

  beforeEach(() => {
    ddbMock.reset();
  });

  const newTbCertificate: NewTbCertificateIssuedDetails = {
    applicationId: "test-application-id",
    isIssued: YesOrNo.Yes,
    comments: "comments",
    issueDate: "2025-01-21",
    expiryDate: "2025-06-21",
    certificateNumber: "123456",
    createdBy: "test-tb-certificate-creator",
    clinicName: "Lakeside Medical & TB Screening Centre",
    physicianName: "Dr.Annelie Botha",
    referenceNumber: "test-application-id",
  };

  const updateTbCertificate: ITbCertificateDetailsUpdate = {
    applicationId: "test-application-id",
    comments: "comments",
    physicianName: "Dr.Annelie Botha",
    dateUpdated: new Date("2025-06-21"),
    updatedBy: "test-tb-certificate-creator",
  };

  test("Creating new tb certificate", async () => {
    // Arrange
    ddbMock.on(PutCommand);
    vi.useFakeTimers();
    const expectedDateTime = "2025-03-04";
    vi.setSystemTime(expectedDateTime);

    // Act
    const tbCertificate = await TbCertificateDbOps.createTbCertificate(newTbCertificate);

    // Assert
    expect(tbCertificate).toMatchObject({
      ...newTbCertificate,
      dateCreated: new Date(expectedDateTime),
      issueDate: new Date("2025-01-21"),
      expiryDate: new Date("2025-06-21"),
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(ddbMock.commandCalls(PutCommand)[0].firstArg.input).toMatchObject({
      TableName: "test-application-details",
      Item: {
        ...newTbCertificate,
        issueDate: "2025-01-21T00:00:00.000Z",
        expiryDate: "2025-06-21T00:00:00.000Z",
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
    const tbCertificate = await TbCertificateDbOps.getByApplicationId(
      newTbCertificate.applicationId,
    );

    // Assert
    expect(tbCertificate).toMatchObject({
      ...newTbCertificate,
      dateCreated: new Date("2025-02-07"),
      issueDate: new Date("2025-01-21"),
      expiryDate: new Date("2025-06-21"),
    });
  });

  test("Updating tb  certificate details", async () => {
    const pk = "APPLICATION#test-application-id";
    const sk = "APPLICATION#TB#CERTIFICATE";
    // Arrange
    ddbMock.on(UpdateCommand).resolves({
      Attributes: {
        ...updateTbCertificate,
        dateUpdated: "2025-03-04T00:00:00.000Z",
      },
    });
    vi.useFakeTimers();
    const expectedDateTime = "2025-03-04";
    vi.setSystemTime(expectedDateTime);

    // Act
    const updatedTBCertDetails = await TbCertificateDbOps.updateTbCertificate(updateTbCertificate);

    // Assert
    expect(updatedTBCertDetails).toMatchObject({
      ...updateTbCertificate,
      dateUpdated: new Date(expectedDateTime),
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(ddbMock.commandCalls(UpdateCommand)[0].firstArg.input).toMatchObject({
      Key: { pk, sk },
      TableName: "test-application-details",
    });
  });
  test("Updating tb certificate information: should throw error if DynamoDB update fails", async () => {
    ddbMock.on(UpdateCommand).resolves({});

    await expect(TbCertificateDbOps.updateTbCertificate(updateTbCertificate)).rejects.toThrow(
      "Update failed",
    );
  });
});
