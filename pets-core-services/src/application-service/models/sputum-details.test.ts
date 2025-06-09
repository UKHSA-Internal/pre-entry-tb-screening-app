import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { beforeEach, describe, expect, test, vi } from "vitest";

import awsClients from "../../shared/clients/aws";
import { TaskStatus } from "../../shared/types/enum";
import { PositiveOrNegative, SputumCollectionMethod } from "../types/enums";
import { buildUpdateExpressionsForSputumDetails, SputumDetailsDbOps } from "./sputum-details";

const ddbMock = mockClient(awsClients.dynamoDBDocClient);

describe("Tests for SputumDetails model", () => {
  const applicationId = "test-application-id";
  const pk = `APPLICATION#${applicationId}`;
  const sk = "APPLICATION#SPUTUM#DETAILS";

  const existingItem = {
    pk,
    sk,
    applicationId,
    status: TaskStatus.incompleted,
    createdBy: "test-user",
    dateCreated: new Date("2025-01-01T00:00:00.000Z"),
    version: 1,
    sputumSamples: {
      sample1: {
        dateOfSample: new Date("2025-01-02T00:00:00.000Z"),
        collectionMethod: SputumCollectionMethod.COUGHED_UP,
        dateUpdated: new Date("2025-01-02T00:00:00.000Z"),
      },
    },
  };

  beforeEach(() => {
    ddbMock.reset();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-03-10T00:00:00.000Z"));
  });

  test("createOrUpdateSputumDetails: should create first sputum sample collection details", async () => {
    ddbMock.on(GetCommand).resolves({ Item: undefined });
    ddbMock.on(UpdateCommand).resolves({
      Attributes: {
        ...existingItem,
        version: 1,
        status: TaskStatus.incompleted,
        sputumSamples: {
          sample1: {
            dateOfSample: "2025-03-10T00:00:00.000Z",
            collectionMethod: SputumCollectionMethod.COUGHED_UP,
            dateUpdated: "2025-03-10T00:00:00.000Z",
          },
        },
      },
    });

    const updated = await SputumDetailsDbOps.createOrUpdateSputumDetails(applicationId, {
      applicationId,
      createdBy: "test-user",
      version: 1,
      sputumSamples: {
        sample1: {
          dateOfSample: new Date("2025-03-10T00:00:00.000Z"),
          collectionMethod: SputumCollectionMethod.COUGHED_UP,
          dateUpdated: new Date("2025-03-10T00:00:00.000Z"),
        },
      },
    });

    expect(updated).toMatchObject({
      applicationId,
      version: 1,
      status: TaskStatus.incompleted,
      sputumSamples: {
        sample1: {
          dateOfSample: "2025-03-10T00:00:00.000Z",
          collectionMethod: SputumCollectionMethod.COUGHED_UP,
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

  test("createOrUpdateSputumDetails: should update sputum sample details", async () => {
    ddbMock.on(GetCommand).resolves({ Item: existingItem });
    ddbMock.on(UpdateCommand).resolves({
      Attributes: {
        ...existingItem,
        version: 2,
        status: TaskStatus.incompleted,
        sputumSamples: {
          ...existingItem.sputumSamples,
          sample2: {
            dateOfSample: new Date("2025-03-11T00:00:00.000Z"),
            collectionMethod: SputumCollectionMethod.COUGHED_UP,
            dateUpdated: new Date("2025-03-11T00:00:00.000Z"),
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
          dateOfSample: new Date("2025-03-11T00:00:00.000Z"),
          collectionMethod: SputumCollectionMethod.COUGHED_UP,
          dateUpdated: new Date("2025-03-11T00:00:00.000Z"),
        },
      },
    });

    expect(updated).toMatchObject({
      applicationId,
      version: 2,
      status: TaskStatus.incompleted,
      sputumSamples: {
        sample1: {
          dateOfSample: new Date("2025-01-02T00:00:00.000Z"),
          collectionMethod: SputumCollectionMethod.COUGHED_UP,
          dateUpdated: new Date("2025-01-02T00:00:00.000Z"),
        },
        sample2: {
          dateOfSample: new Date("2025-03-11T00:00:00.000Z"),
          collectionMethod: SputumCollectionMethod.COUGHED_UP,
          dateUpdated: new Date("2025-03-11T00:00:00.000Z"),
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

  test("buildUpdateExpressionsForSputumDetails: should update existing sputum sample all details", () => {
    const newSputumSamples = {
      applicationId: "1234",
      createdBy: "John",
      sputumSamples: {
        sample1: {
          dateOfSample: new Date("2025-03-11T00:00:00.000Z"),
          collectionMethod: SputumCollectionMethod.COUGHED_UP,
          smearResult: PositiveOrNegative.POSITIVE,
          dateUpdated: new Date("2025-03-12T00:00:00.000Z"),
        },
      },
    };

    const mergedSamples = {
      sample1: {
        dateOfSample: new Date("2025-03-11T00:00:00.000Z"),
        collectionMethod: SputumCollectionMethod.COUGHED_UP,
        cultureResult: PositiveOrNegative.NEGATIVE,
        smearResult: PositiveOrNegative.POSITIVE,
        dateUpdated: new Date("2025-03-12T00:00:00.000Z"),
      },
      sample2: undefined,
      sample3: undefined,
    };

    const updated = buildUpdateExpressionsForSputumDetails(
      newSputumSamples,
      mergedSamples,
      false,
      false,
      3,
    );

    expect(updated).toMatchObject({
      ConditionExpression: "version = :expectedVersion",
      ExpressionAttributeNames: {
        "#s_sample1": "sample1",
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":dateUpdated": "2025-03-10T00:00:00.000Z",
        ":expectedVersion": undefined,
        ":newVersion": 4,
        ":status": "incompleted",
        ":v_sample1": {
          collectionMethod: "Coughed up",
          dateOfSample: new Date("2025-03-11T00:00:00.000Z"),
          dateUpdated: new Date("2025-03-12T00:00:00.000Z"),
          cultureResult: "Negative",
          smearResult: "Positive",
        },
      },
      UpdateExpression:
        "SET sputumSamples.#s_sample1 = :v_sample1, version = :newVersion, dateUpdated = :dateUpdated, #status = :status",
    });
  });

  test("createOrUpdateSputumDetails: should update sputum sample details and results and mark status complete", async () => {
    ddbMock.on(GetCommand).resolves({ Item: existingItem });
    ddbMock.on(UpdateCommand).resolves({
      Attributes: {
        ...existingItem,
        version: 2,
        status: TaskStatus.completed,
        sputumSamples: {
          ...existingItem.sputumSamples,
          sample1: {
            dateOfSample: new Date("2025-01-02T00:00:00.000Z"),
            collectionMethod: SputumCollectionMethod.COUGHED_UP,
            smearResult: PositiveOrNegative.POSITIVE,
            cultureResult: PositiveOrNegative.POSITIVE,
            dateUpdated: new Date("2025-01-02T00:00:00.000Z"),
          },
          sample2: {
            dateOfSample: new Date("2025-03-11T00:00:00.000Z"),
            collectionMethod: SputumCollectionMethod.COUGHED_UP,
            smearResult: PositiveOrNegative.POSITIVE,
            cultureResult: PositiveOrNegative.POSITIVE,
            dateUpdated: new Date("2025-03-11T00:00:00.000Z"),
          },
          sample3: {
            dateOfSample: new Date("2025-03-12T00:00:00.000Z"),
            collectionMethod: "Induced",
            smearResult: PositiveOrNegative.POSITIVE,
            cultureResult: PositiveOrNegative.POSITIVE,
            dateUpdated: new Date("2025-03-12T00:00:00.000Z"),
          },
        },
      },
    });

    const updated = await SputumDetailsDbOps.createOrUpdateSputumDetails(applicationId, {
      applicationId,
      createdBy: "test-user",
      version: 1,
      sputumSamples: {
        sample1: {
          dateOfSample: new Date("2025-01-02T00:00:00.000Z"),
          collectionMethod: SputumCollectionMethod.COUGHED_UP,
          smearResult: PositiveOrNegative.POSITIVE,
          cultureResult: PositiveOrNegative.POSITIVE,
          dateUpdated: new Date("2025-01-02T00:00:00.000Z"),
        },
        sample2: {
          dateOfSample: new Date("2025-03-11T00:00:00.000Z"),
          collectionMethod: SputumCollectionMethod.COUGHED_UP,
          smearResult: PositiveOrNegative.POSITIVE,
          cultureResult: PositiveOrNegative.POSITIVE,
          dateUpdated: new Date("2025-03-11T00:00:00.000Z"),
        },
        sample3: {
          dateOfSample: new Date("2025-03-12T00:00:00.000Z"),
          collectionMethod: SputumCollectionMethod.INDUCED,
          smearResult: PositiveOrNegative.POSITIVE,
          cultureResult: PositiveOrNegative.POSITIVE,
          dateUpdated: new Date("2025-03-12T00:00:00.000Z"),
        },
      },
    });

    expect(updated).toMatchObject({
      applicationId,
      version: 2,
      status: TaskStatus.completed,
      sputumSamples: {
        sample1: {
          dateOfSample: new Date("2025-01-02T00:00:00.000Z"),
          collectionMethod: SputumCollectionMethod.COUGHED_UP,
          smearResult: PositiveOrNegative.POSITIVE,
          cultureResult: PositiveOrNegative.POSITIVE,
          dateUpdated: new Date("2025-01-02T00:00:00.000Z"),
        },
        sample2: {
          dateOfSample: new Date("2025-03-11T00:00:00.000Z"),
          collectionMethod: SputumCollectionMethod.COUGHED_UP,
          smearResult: PositiveOrNegative.POSITIVE,
          cultureResult: PositiveOrNegative.POSITIVE,
          dateUpdated: new Date("2025-03-11T00:00:00.000Z"),
        },
        sample3: {
          dateOfSample: new Date("2025-03-12T00:00:00.000Z"),
          collectionMethod: "Induced",
          smearResult: PositiveOrNegative.POSITIVE,
          cultureResult: PositiveOrNegative.POSITIVE,
          dateUpdated: new Date("2025-03-12T00:00:00.000Z"),
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

  test("createOrUpdateSputumDetails: should throw error if sputum sample object schema is invalid", async () => {
    ddbMock.on(GetCommand).resolves({
      Item: {
        pk,
        sk,
        applicationId,
        status: TaskStatus.incompleted,
        createdBy: "test-user",
        dateCreated: new Date("2025-01-01T00:00:00.000Z"),
        version: 1,
        sputumSamples: {
          sample1: [],
        },
      },
    });
    ddbMock.on(UpdateCommand).resolves({});

    await expect(
      SputumDetailsDbOps.createOrUpdateSputumDetails(applicationId, {
        applicationId,
        createdBy: "test-user",
        version: 1,
        sputumSamples: {
          sample1: {
            dateOfSample: "2025-03-10T00:00:00.000Z",
            collectionMethod: SputumCollectionMethod.COUGHED_UP,
            dateUpdated: new Date("2025-03-10T00:00:00.000Z"),
          },
        },
      }),
    ).rejects.toThrow("Invalid sample object");
  });

  test("createOrUpdateSputumDetails: should throw error if sputum sample object in DB has missing required fields", async () => {
    ddbMock.on(GetCommand).resolves({
      Item: {
        pk,
        sk,
        applicationId,
        status: TaskStatus.incompleted,
        createdBy: "test-user",
        dateCreated: new Date("2025-01-01T00:00:00.000Z"),
        version: 1,
        sputumSamples: {
          sample1: {
            collectionMethod: SputumCollectionMethod.COUGHED_UP,
            dateUpdated: new Date("2025-01-02T00:00:00.000Z"),
          },
        },
      },
    });
    ddbMock.on(UpdateCommand).resolves({});

    await expect(
      SputumDetailsDbOps.createOrUpdateSputumDetails(applicationId, {
        applicationId,
        createdBy: "test-user",
        version: 1,
        sputumSamples: {
          sample1: {
            dateOfSample: "2025-03-10T00:00:00.000Z",
            collectionMethod: SputumCollectionMethod.COUGHED_UP,
            dateUpdated: new Date("2025-03-10T00:00:00.000Z"),
          },
        },
      }),
    ).rejects.toThrow(
      "Missing required fields in sputum sample: dateOfSample, collectionMethod, or dateUpdated",
    );
  });

  test("getByApplicationId: should retrieve sputum details by applicationId", async () => {
    ddbMock.on(GetCommand).resolves({ Item: existingItem });

    const result = await SputumDetailsDbOps.getByApplicationId(applicationId);

    expect(result).toMatchObject({
      applicationId,
      status: TaskStatus.incompleted,
      dateCreated: new Date("2025-01-01T00:00:00.000Z"),
      sputumSamples: {
        sample1: {
          dateOfSample: new Date("2025-01-02T00:00:00.000Z").toISOString(),
          collectionMethod: SputumCollectionMethod.COUGHED_UP,
          dateUpdated: new Date("2025-01-02T00:00:00.000Z").toISOString(),
        },
      },
    });
  });

  test("getByApplicationId: should return undefined if no sputum details are found", async () => {
    ddbMock.on(GetCommand).resolves({});

    const result = await SputumDetailsDbOps.getByApplicationId(applicationId);
    expect(result).toBeUndefined();
  });

  test("getByApplicationId: should throw error if DynamoDB fails", async () => {
    ddbMock.on(GetCommand).rejects(new Error("DynamoDB failure"));
    await expect(SputumDetailsDbOps.getByApplicationId(applicationId)).rejects.toThrow(
      "DynamoDB failure",
    );
  });
});
