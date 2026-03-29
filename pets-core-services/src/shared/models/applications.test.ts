import { QueryCommand, QueryCommandOutput } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { beforeEach, describe, expect, test, vi } from "vitest";

import awsClients from "../clients/aws";
import { CountryCode } from "../country";
import { DynamoBatchLoader } from "../helpers/batch-util";
import { ApplicationStatus } from "../types/enum";
import { ApplicationRoot } from "./applications";

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
  const createdBy = "test-email";
  const passportNumber = "Test";
  const countryOfIssue = CountryCode.IND;

  test("Getting all in progress applications for users clinic", async () => {
    // Mock DynamoDB query response
    ddbMock.on(QueryCommand).resolves({
      Items: [
        {
          applicationId: applicationId,
          passportNumber: passportNumber,
          countryOfIssue: countryOfIssue,
          clinicId: clinicId,
          dateCreated: new Date("2025-02-07"),
          applicationStatus: ApplicationStatus.inProgress,
        },
      ],
    } as unknown as QueryCommandOutput);

    //  Mock batch loader
    vi.spyOn(DynamoBatchLoader, "batchLoad").mockResolvedValueOnce(
      new Map([["user1", { applicantId: "user1", applicantName: "John Doe" }]]),
    );

    const result = await ApplicationRoot.getByClinicId(clinicId, 100);

    expect(result.items).toHaveLength(1);

    expect(result.items[0].applicantName).toBe("John Doe");

    expect(result.cursor).toBeNull();

    // Act
    const application = await ApplicationRoot.getByClinicId(clinicId, 100);

    // Assert
    expect(application).toMatchObject({
      applicationId,
      clinicId,
      createdBy,
      dateCreated: new Date("2025-02-07"),
    });
  });
  test("should handle pagination cursor", async () => {
    const lastEvaluatedKey = { applicationId: "app-last" };

    ddbMock.on(QueryCommand).resolves({
      Items: [],
      LastEvaluatedKey: lastEvaluatedKey,
    });

    vi.spyOn(DynamoBatchLoader, "batchLoad").mockResolvedValueOnce(new Map());

    const result = await ApplicationRoot.getByClinicId(clinicId, 100);

    const expectedCursor = Buffer.from(JSON.stringify(lastEvaluatedKey)).toString("base64");

    expect(result.cursor).toBe(expectedCursor);
  });

  test("should pass correct params to DynamoDB", async () => {
    ddbMock.on(QueryCommand).resolves({ Items: [] });

    vi.spyOn(DynamoBatchLoader, "batchLoad").mockResolvedValueOnce(new Map());

    await ApplicationRoot.getByClinicId(clinicId, 100);

    const calls = ddbMock.commandCalls(QueryCommand);
    const input = calls[0].args[0].input;

    expect(input.TableName).toBe("ApplicationTable");
    expect(input.IndexName).toBe("GSI1");
    expect(input.ExpressionAttributeValues?.[":clinicId"]).toBe("test-clinic-id");
    expect(input.Limit).toBe(10);
  });

  test("should throw error if DynamoDB fails", async () => {
    ddbMock.on(QueryCommand).rejects(new Error("DynamoDB error"));

    await expect(ApplicationRoot.getByClinicId(clinicId, 100)).rejects.toThrow("DynamoDB error");
  });
});
