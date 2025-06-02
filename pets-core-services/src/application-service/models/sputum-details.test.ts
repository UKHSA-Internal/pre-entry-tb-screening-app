import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { beforeEach, describe, expect, test, vi } from "vitest";

import awsClients from "../../shared/clients/aws";
import { TaskStatus } from "../../shared/types/enum";
import { SputumDetailsDbOps } from "./sputum-details";

const ddbMock = mockClient(awsClients.dynamoDBDocClient);

describe("Tests for SputumDetailsDbOps model", () => {
  const applicationId = "test-application-id";
  const pk = `APPLICATION#${applicationId}`;
  const sk = "APPLICATION#SPUTUM#DETAILS";

  const existingItem = {
    pk,
    sk,
    applicationId,
    status: TaskStatus.incompleted,
    createdBy: "test-user",
    dateCreated: "2025-01-01T00:00:00.000Z",
    version: 1,
    sputumSamples: {
      sample1: {
        dateOfSample: "2025-01-02T00:00:00.000Z",
        collectionMethod: "Coughed Up",
      },
    },
  };

  beforeEach(() => {
    ddbMock.reset();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-03-10T00:00:00.000Z"));
  });

  test("createOrUpdateSputumDetails: should update sputum sample details", async () => {
    ddbMock.on(GetCommand).resolves({ Item: existingItem });
    ddbMock.on(UpdateCommand).resolves({
      Attributes: {
        ...existingItem,
        version: 2,
        status: TaskStatus.completed,
        sputumSamples: {
          ...existingItem.sputumSamples,
          sample2: {
            dateOfSample: "2025-03-10T00:00:00.000Z",
            collectionMethod: "Coughed Up",
          },
        },
      },
    });

    const updated = await SputumDetailsDbOps.createOrUpdateSputumDetails(applicationId, {
      applicationId,
      createdBy: "test-user",
      version: 1,
      sputumSamples: {
        sample2: {
          dateOfSample: "2025-03-10T00:00:00.000Z",
          collectionMethod: "Coughed Up",
        },
      },
    });

    expect(updated).toMatchObject({
      applicationId,
      createdBy: "test-user",
      version: 2,
      status: TaskStatus.completed,
      sputumSamples: {
        sample1: {
          dateOfSample: new Date("2025-01-02T00:00:00.000Z"),
          collectionMethod: "Coughed Up",
        },
        sample2: {
          dateOfSample: new Date("2025-03-10T00:00:00.000Z"),
          collectionMethod: "Coughed Up",
        },
      },
    });

    const call = ddbMock.commandCalls(UpdateCommand)[0];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(call?.firstArg.input).toMatchObject({
      Key: { pk, sk },
      TableName: "test-application-details",
    });
  });

  test("createOrUpdateSputumDetails:should throw if existing record is not found", async () => {
    ddbMock.on(GetCommand).resolves({});

    await expect(
      SputumDetailsDbOps.createOrUpdateSputumDetails(applicationId, {
        applicationId,
        createdBy: "test-user",
        sputumSamples: {},
      }),
    ).rejects.toThrow("Sputum details not found");
  });
  test("createOrUpdateSputumDetails: should throw error if DynamoDB update fails", async () => {
    ddbMock.on(GetCommand).resolves({ Item: existingItem });
    ddbMock.on(UpdateCommand).resolves({});

    await expect(
      SputumDetailsDbOps.createOrUpdateSputumDetails(applicationId, {
        applicationId,
        createdBy: "test-user",
        version: 1,
        sputumSamples: {},
      }),
    ).rejects.toThrow("Update failed");
  });
  test("getByApplicationId: should retrieve sputum details by applicationId", async () => {
    ddbMock.on(GetCommand).resolves({ Item: existingItem });

    const result = await SputumDetailsDbOps.getByApplicationId(applicationId);

    expect(result).toMatchObject({
      applicationId,
      createdBy: "test-user",
      status: TaskStatus.incompleted,
      dateCreated: new Date("2025-01-01T00:00:00.000Z"),
      sputumSamples: {
        sample1: {
          dateOfSample: new Date("2025-01-02T00:00:00.000Z"),
          collectionMethod: "Coughed Up",
        },
      },
    });
  });

  test("getByApplicationId: should return undefined if no sputum details are found", async () => {
    ddbMock.on(GetCommand).resolves({});

    const result = await SputumDetailsDbOps.getByApplicationId(applicationId);
    expect(result).toBeUndefined();
  });
});
