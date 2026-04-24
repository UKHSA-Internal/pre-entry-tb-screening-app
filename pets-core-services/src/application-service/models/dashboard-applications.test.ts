import { QueryCommand, QueryCommandOutput } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { beforeEach, describe, expect, test, vi } from "vitest";

import awsClients from "../../shared/clients/aws";
import { CountryCode } from "../../shared/country";
import { ApplicationStatus } from "../../shared/types/enum";
import { DynamoBatchLoader } from "../helpers/dynamo-batch-util";
import { DashboardApplication } from "./dashboard-applications";

describe("Tests for Applications Model", () => {
  const ddbMock = mockClient(awsClients.dynamoDBDocClient);
  //  Mock logger
  vi.mock("../logger", () => ({
    logger: {
      info: vi.fn(),
      error: vi.fn(),
    },
  }));

  //  Mock batch loader
  vi.spyOn(DynamoBatchLoader, "batchLoad");
  beforeEach(() => {
    vi.clearAllMocks();
    ddbMock.reset();
  });

  const clinicId = "test-clinic-id";
  const applicationId = "test=app-id";
  const passportNumber = "Test";
  const countryOfIssue = CountryCode.IND;
  const applicantId = "COUNTRY#IND#PASSPORT#Test";

  test("Getting all in progress applications for users clinic", async () => {
    // Mock DynamoDB query response
    ddbMock.on(QueryCommand).resolves({
      Items: [
        {
          applicationId: applicationId,
          applicantId: applicantId,
          clinicId: clinicId,
          dateCreated: new Date("2025-02-07"),
          applicationStatus: ApplicationStatus.inProgress,
        },
      ],
    } as unknown as QueryCommandOutput);

    //  Mock batch loader
    vi.spyOn(DynamoBatchLoader, "batchLoad").mockResolvedValue(
      new Map([
        [
          applicantId,
          {
            applicantId: "COUNTRY#IND#PASSPORT#Test",
            fullName: "John Doe",
            passportNumber: passportNumber,
            countryOfIssue: countryOfIssue,
          },
        ],
      ]),
    );

    const result = await DashboardApplication.getByClinicId(clinicId, 100);

    expect(result.applications).toHaveLength(1);

    expect(result.applications[0].applicantName).toBe("John Doe");

    expect(result.cursor).toBeNull();

    // Act
    const applications = await DashboardApplication.getByClinicId(clinicId, 100);

    // Assert
    expect(applications.applications[0]).toMatchObject({
      applicantId: "COUNTRY#IND#PASSPORT#Test",
      applicantName: "John Doe",
      applicationId: "test=app-id",
      applicationStatus: "In Progress",
      clinicId: "test-clinic-id",
      countryOfIssue: "IND",
      dateCreated: new Date("2025-02-07"),
      passportNumber: "Test",
    });
  });
  // test("should handle pagination cursor", async () => {
  //   const lastEvaluatedKey = { applicationId: "app-last" };

  //   ddbMock.on(QueryCommand).resolves({
  //     Items: [],
  //     LastEvaluatedKey: lastEvaluatedKey,
  //   });

  //   vi.spyOn(DynamoBatchLoader, "batchLoad").mockResolvedValueOnce(new Map());

  //   const result = await ApplicationRoot.getByClinicId(clinicId, 100);

  //   const expectedCursor = Buffer.from(JSON.stringify(lastEvaluatedKey)).toString("base64");

  //   expect(result.cursor).toBe(expectedCursor);
  // });

  test("should pass correct params to DynamoDB", async () => {
    ddbMock.on(QueryCommand).resolves({ Items: [] });

    vi.spyOn(DynamoBatchLoader, "batchLoad").mockResolvedValueOnce(new Map());

    await DashboardApplication.getByClinicId(clinicId, 100);

    const calls = ddbMock.commandCalls(QueryCommand);
    const input = calls[0].args[0].input;

    expect(input.TableName).toBe("test-application-details");
    expect(input.IndexName).toBe("application-db-clinic-index");
    expect(input.ExpressionAttributeValues?.[":clinicId"]).toBe("test-clinic-id");
    expect(input.Limit).toBe(100);
  });

  test("should throw error if DynamoDB fails", async () => {
    ddbMock.on(QueryCommand).rejects(new Error("DynamoDB error"));

    await expect(DashboardApplication.getByClinicId(clinicId, 100)).rejects.toThrow(
      "DynamoDB error",
    );
  });
});
