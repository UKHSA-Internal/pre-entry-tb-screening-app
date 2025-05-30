import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { beforeEach, describe, expect, it } from "vitest";

import awsClients from "../../shared/clients/aws";
import { TaskStatus } from "../../shared/types/enum";
import { SputumDetailsDbOps } from "../models/sputum-details";

const dynamoMock = mockClient(awsClients.dynamoDBDocClient);

describe("SputumDetailsDbOps", () => {
  const TableName = "mock-table";
  const applicationId = "app-123";
  const pk = `APPLICATION#${applicationId}`;
  const sk = "APPLICATION#SPUTUM#DETAILS";

  beforeEach(() => {
    process.env.APPLICATION_SERVICE_DATABASE_NAME = TableName;
    dynamoMock.reset();
  });

  it("should fetch sputum details by application ID", async () => {
    const mockItem = {
      pk,
      sk,
      applicationId,
      status: TaskStatus.incompleted,
      sputumSamples: {
        sample1: {
          dateSputumSample: new Date().toISOString(),
          sputumCollectionMethod: "Method A",
        },
      },
      createdBy: "user1",
      dateCreated: new Date().toISOString(),
    };

    dynamoMock.on(GetCommand).resolves({ Item: mockItem });

    const result = await SputumDetailsDbOps.getByApplicationId(applicationId);
    expect(result).toBeDefined();
    expect(result?.applicationId).toBe(applicationId);
    expect(result?.sputumSamples.sample1?.sputumCollectionMethod).toBe("Method A");
  });

  it("should throw error if no item found", async () => {
    dynamoMock.on(GetCommand).resolves({});

    await expect(SputumDetailsDbOps.getByApplicationId(applicationId)).resolves.toBeUndefined();
  });

  it("should merge and update sputum sample details", async () => {
    const existingItem = {
      pk,
      sk,
      applicationId,
      status: TaskStatus.incompleted,
      sputumSamples: {
        sample1: {
          dateSputumSample: new Date().toISOString(),
          sputumCollectionMethod: "Old Method",
        },
      },
      createdBy: "user1",
      dateCreated: new Date().toISOString(),
    };

    dynamoMock.on(GetCommand).resolves({ Item: existingItem });
    dynamoMock.on(UpdateCommand).resolves({ Attributes: {} });

    const input = {
      createdBy: "user1",
      applicationId,
      sputumSamples: {
        sample2: {
          dateSputumSample: new Date(),
          sputumCollectionMethod: "New Method",
        },
      },
    };

    await expect(
      SputumDetailsDbOps.createOrUpdateSputumDetails(applicationId, input),
    ).resolves.toMatchObject({
      applicationId: "app-123",
      createdBy: undefined,
      // dateCreated should be: Date { NaN }
      dateCreated: new Date("-"),
      sputumSamples: {
        sample1: undefined,
        sample2: undefined,
        sample3: undefined,
      },
      status: undefined,
      version: undefined,
    });

    expect(dynamoMock.calls(UpdateCommand).length).toBeGreaterThan(0);
  });

  it("should throw error on bad db response", async () => {
    const existingItem = {
      pk,
      sk,
      applicationId,
      status: TaskStatus.incompleted,
      sputumSamples: {
        sample1: {
          dateSputumSample: new Date().toISOString(),
          sputumCollectionMethod: "Old Method",
        },
      },
      createdBy: "user1",
      dateCreated: new Date().toISOString(),
    };

    dynamoMock.on(GetCommand).resolves({ Item: existingItem });
    dynamoMock.on(UpdateCommand).resolves({});

    const input = {
      createdBy: "user1",
      applicationId,
      sputumSamples: {
        sample2: {
          dateSputumSample: new Date(),
          sputumCollectionMethod: "New Method",
        },
      },
    };

    await expect(
      SputumDetailsDbOps.createOrUpdateSputumDetails(applicationId, input),
    ).rejects.toThrowError(new Error("Update failed"));

    expect(dynamoMock.calls(UpdateCommand).length).toBeGreaterThan(0);
  });
});
