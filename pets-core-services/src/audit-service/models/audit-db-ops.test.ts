import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBRecord, StreamRecord } from "aws-lambda";
import { mockClient } from "aws-sdk-client-mock";
import { beforeEach, describe, expect, test, vi } from "vitest";

import awsClients from "../../shared/clients/aws";
// import { seededApplications } from "../../shared/fixtures/application";
import { logger } from "../../shared/logger";
// import { SourceType } from "../types/enums";
import { AuditDbOps } from "./audit-db-ops";

const DynamoDBRecordTemplate: DynamoDBRecord = {
  eventID: "9c7f75b0e7701ae79a6b1fe27a1e251e",
  eventName: "INSERT",
  eventVersion: "1.1",
  eventSource: "aws:dynamodb",
  awsRegion: "eu-west-2",
  dynamodb: undefined,
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
    ddbMock.on(PutCommand);
    // .resolves({
    //   applicationId: "568b49e2-cbdf-47df-81ad-fecaa2b5b3b2",
    //   // User Email or AWS user for console updates
    //   updatedBy: "updatedBy@email.com",
    //   eventType: "INSERT",
    //   // Application (App/API) - Application, API (for IOM) or Console
    //   source: "App",
    //   // applicant-details / application-details
    //   sourceTable: "application-details",
    //   changeDetails: JSON.stringify(DynamoDBJSONNewImageData),
    //   dateUpdated: new Date(),
    // });
    vi.useFakeTimers();
    const expectedDateTime = "2025-03-04";
    vi.setSystemTime(expectedDateTime);
    // const createdData = {
    //   applicationId: seededApplications[1].applicationId,
    //   updatedBy: "shane.park@iom.com",
    //   eventType: "INSERT",
    //   source: SourceType.app,
    //   sourceTable: "application-details",
    //   changeDetails: JSON.stringify({
    //     applicationId: "generated-app-id-2",
    //     clinicId: "Apollo Clinic",
    //     createdBy: "appollo-clinic-user@email",
    //     dateCreated: null,
    //   }),
    // };
    const infoLoggerMock = vi.spyOn(logger, "info").mockImplementation(() => null);

    // Act
    await AuditDbOps.createNewAuditFromDBRecord({
      ...DynamoDBRecordTemplate,
      dynamodb: DynamoDBJSONNewImageData,
    });

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
        pk: "AUDIT#568b49e2-cbdf-47df-81ad-fecaa2b5b3b2",
        sk: "AUDIT#DETAILS",
        // source: "App",
        // sourceTable: undefined,
        // updatedBy: "where is it?",
      },
      TableName: "test-audit-details",
    });
    expect(infoLoggerMock).toHaveBeenCalledWith("Started saving new Audit to DB");
    expect(infoLoggerMock).toHaveBeenCalledWith("New audit created successfully");

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(ddbMock.commandCalls(PutCommand)[0].firstArg.input).toMatchObject({
      ConditionExpression: "attribute_not_exists(pk) AND attribute_not_exists(sk)",
    });
  });
});
