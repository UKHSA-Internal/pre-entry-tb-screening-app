import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBRecord, StreamRecord } from "aws-lambda";
import { mockClient } from "aws-sdk-client-mock";
import { beforeEach, describe, expect, test, vi } from "vitest";

import awsClients from "../../shared/clients/aws";
import { logger } from "../../shared/logger";
import { getConsoleEvent } from "../helpers/audit-helpers";
import { SourceType } from "../types/enums";
import { AuditDbOps } from "./audit-db-ops";

const DynamoDBJSONNewImageData: StreamRecord = {
  NewImage: {
    applicationId: {
      S: "568b49e2-cbdf-47df-81ad-fecaa2b5b3b2",
    },
    clinicId: {
      S: "Apollo Clinic",
    },
    createdBy: {
      S: "clinic-one-user@email",
    },
    pk: {
      S: "APPLICATION#568b49e2-cbdf-47df-81ad-fecaa2b5b3b2",
    },
    sk: {
      S: "APPLICATION#TRAVEL#INFORMATION",
    },
    ukAddressPostcode: {
      S: "NW1 6XE",
    },
  },
};
const DynamoDBRecordTemplate: DynamoDBRecord = {
  eventID: "9c7f75b0e7701ae79a6b1fe27a1e251e",
  eventName: "INSERT",
  eventVersion: "1.1",
  eventSource: "aws:dynamodb",
  awsRegion: "eu-west-2",
  dynamodb: DynamoDBJSONNewImageData,
  eventSourceARN:
    "arn:aws:dynamodb:eu-west-2:108782068086:table/application-details/stream/2025-08-28T12:56:03.940",
};

describe("Tests for Application Model", () => {
  const ddbMock = mockClient(awsClients.dynamoDBDocClient);

  beforeEach(() => {
    ddbMock.reset();
  });

  test("Creating new audit", async () => {
    // Arrange
    ddbMock.on(PutCommand);
    vi.useFakeTimers();
    const expectedDateTime = "2025-03-04";
    vi.setSystemTime(expectedDateTime);
    const infoLoggerMock = vi.spyOn(logger, "info").mockImplementation(() => null);
    vi.mock("../helpers/audit-helpers");
    vi.mocked(getConsoleEvent).mockResolvedValue(SourceType.console);

    // Act
    await AuditDbOps.createNewAuditFromDBRecord(DynamoDBRecordTemplate);

    // Assert
    const call = ddbMock.commandCalls(PutCommand)[0];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(call?.firstArg.input).toMatchObject({
      ConditionExpression: "attribute_not_exists(pk) AND attribute_not_exists(sk)",
      Item: {
        applicationId: "568b49e2-cbdf-47df-81ad-fecaa2b5b3b2",
        changeDetails:
          '{"applicationId":{"S":"568b49e2-cbdf-47df-81ad-fecaa2b5b3b2"},"clinicId":{"S":"Apollo Clinic"},"createdBy":{"S":"clinic-one-user@email"},"pk":{"S":"APPLICATION#568b49e2-cbdf-47df-81ad-fecaa2b5b3b2"},"sk":{"S":"APPLICATION#TRAVEL#INFORMATION"},"ukAddressPostcode":{"S":"NW1 6XE"}}',
        dateUpdated: "2025-03-04T00:00:00.000Z",
        eventType: "INSERT",
        pk: "AUDIT#1741046400000",
        sk: "APPLICATION#568b49e2-cbdf-47df-81ad-fecaa2b5b3b2#TRAVEL#INFORMATION",
        source: "Console",
        sourceTable: "application-details",
        updatedBy: "clinic-one-user@email",
      },
      TableName: "test-audit-details",
    });
    expect(infoLoggerMock).toHaveBeenNthCalledWith(4, "New audit created successfully");

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(ddbMock.commandCalls(PutCommand)[0].firstArg.input).toMatchObject({
      ConditionExpression: "attribute_not_exists(pk) AND attribute_not_exists(sk)",
    });
  });

  test("Creating new missing table name", async () => {
    // Arrange
    ddbMock.on(PutCommand);
    vi.useFakeTimers();
    const expectedDateTime = "2025-03-04";
    vi.setSystemTime(expectedDateTime);
    const errorLoggerMock = vi.spyOn(logger, "error").mockImplementation(() => null);

    // Act
    await AuditDbOps.createNewAuditFromDBRecord({
      ...DynamoDBRecordTemplate,
      eventSourceARN: "arn:aws:dynamodb:eu-west-2:108782068086",
    });

    // Assert
    expect(errorLoggerMock).toHaveBeenCalledWith("Could not get table name from regex: null");
  });

  test("Creating new using updatedBy email", async () => {
    // Arrange
    ddbMock.on(PutCommand);
    vi.useFakeTimers();
    const expectedDateTime = "2025-03-04";
    vi.setSystemTime(expectedDateTime);

    // Act
    const result = await AuditDbOps.createNewAuditFromDBRecord({
      ...DynamoDBRecordTemplate,
      dynamodb: {
        ...DynamoDBJSONNewImageData,
        NewImage: {
          ...DynamoDBJSONNewImageData.NewImage,
          updatedBy: {
            S: "test.user.666@emailbox.co.uk",
          },
        },
      },
    });

    // Assert
    expect(result).toMatchObject({
      updatedBy: "test.user.666@emailbox.co.uk",
    });
  });

  test("Creating new no email", async () => {
    // Arrange
    const errorLoggerMock = vi.spyOn(logger, "error").mockImplementation(() => null);
    ddbMock.on(PutCommand);
    vi.useFakeTimers();
    const expectedDateTime = "2025-03-04";
    vi.setSystemTime(expectedDateTime);
    const dynamodbCopy = Object.assign({}, DynamoDBJSONNewImageData);
    // @ts-expect-error test
    delete dynamodbCopy.NewImage.createdBy;

    // Act
    await AuditDbOps.createNewAuditFromDBRecord({
      ...DynamoDBRecordTemplate,
      dynamodb: dynamodbCopy,
    });

    // Assert
    expect(errorLoggerMock).toHaveBeenCalledWith("Missing email (updatedBy or createdBy field)");
  });
});
