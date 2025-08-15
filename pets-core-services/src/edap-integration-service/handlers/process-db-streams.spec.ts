/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { Context, DynamoDBRecord, DynamoDBStreamEvent } from "aws-lambda";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { logger } from "../../shared/logger";

vi.mock("../services/sqs-service", async () => {
  return await import("../tests/mocks/SQServiceMock");
});

vi.mock("../services/stream-service", async () => {
  return await import("../tests/mocks/StreamServiceMock");
});

vi.mock("../../shared/logger", () => {
  return {
    logger: {
      error: vi.fn(),
      info: vi.fn(),
    },
  };
});
import { sendDbStreamMessageMock, sendToDLQMock } from "../tests/mocks/SQServiceMock";
import { getClinicDataStreamMock } from "../tests/mocks/StreamServiceMock";
import { edapIntegrationHandler } from "./process-db-streams";

describe("integrationHandler", () => {
  const ctx = "" as unknown as Context;

  let sampleEvent: DynamoDBStreamEvent;
  let sampleRecord: DynamoDBRecord;

  beforeEach(() => {
    vi.clearAllMocks();

    sampleRecord = {
      eventID: "1",
      eventName: "INSERT",
      eventVersion: "1.0",
      eventSource: "aws:dynamodb",
      awsRegion: "us-east-1",
      dynamodb: {
        applicationId: "123",
      },
    } as unknown as DynamoDBRecord;

    sampleEvent = {
      Records: [sampleRecord],
    } as DynamoDBStreamEvent;
  });

  test("processes a record successfully", async () => {
    getClinicDataStreamMock.mockImplementation(() => ({ applicationId: "1234" }));
    sendDbStreamMessageMock.mockResolvedValue(undefined);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await edapIntegrationHandler(sampleEvent, ctx, () => {
      return;
    });
    expect(result.batchItemFailures).toHaveLength(0);
    expect(getClinicDataStreamMock).toHaveBeenCalledTimes(1);
    expect(sendDbStreamMessageMock).toHaveBeenCalledWith(JSON.stringify({ applicationId: "1234" }));
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining("successfully processed"));
  });

  test("sends to DLQ on processing error", async () => {
    getClinicDataStreamMock.mockImplementation(() => {
      throw new Error("Stream error");
    });
    sendToDLQMock.mockResolvedValue(undefined);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await edapIntegrationHandler(sampleEvent, ctx, () => {
      return;
    });
    expect(result.batchItemFailures).toHaveLength(1);
    expect(sendToDLQMock).toHaveBeenCalledTimes(1);
    expect(sendToDLQMock).toHaveBeenCalledWith(JSON.stringify(sampleEvent.Records[0]));
    expect(logger.error).toHaveBeenCalledWith("ERR:", expect.any(Error));
  });

  test("error in sending to DLQ throws", async () => {
    getClinicDataStreamMock.mockImplementation(() => {
      throw new Error("Stream error");
    });
    sendToDLQMock.mockRejectedValue(new Error("DLQ failed"));

    await expect(
      edapIntegrationHandler(sampleEvent, ctx, () => {
        return;
      }),
    ).rejects.toThrow("Record can't be sent in the SQS/DLQ message");
  });

  test("throws if event is undefined", async () => {
    // @ts-expect-error testing bad input
    await expect(edapIntegrationHandler(undefined)).rejects.toThrow("ERROR: event is not defined");
    expect(logger.error).toHaveBeenCalledWith("ERROR: event is not defined.");
  });
});
