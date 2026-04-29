import { DynamoDBDocumentClient, QueryCommand, QueryCommandOutput } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { CountryCode } from "../../shared/country";
import { ApplicationStatus, ApplicationStatusGroup } from "../../shared/types/enum";
import { DynamoBatchLoader } from "../helpers/dynamo-batch-util";
import { DashboardApplication } from "./dashboard-applications";

describe("Tests for Applications Model", () => {
  const ddbMock = mockClient(DynamoDBDocumentClient);
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
          applicationStatusGroup: ApplicationStatusGroup.incomplete,
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

    expect(result).toHaveLength(1);

    expect(result[0].applicantName).toBe("John Doe");

    // Act
    const applications = await DashboardApplication.getByClinicId(clinicId, 100);

    // Assert
    expect(applications).toMatchObject([
      {
        applicantId: "COUNTRY#IND#PASSPORT#Test",
        applicantName: "John Doe",
        applicationId: "test=app-id",
        applicationStatus: "In Progress",
        applicationStatusGroup: "Incomplete",
        clinicId: "test-clinic-id",
        countryOfIssue: "IND",
        dateCreated: new Date("2025-02-07"),
        passportNumber: "Test",
      },
    ]);
  });

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
