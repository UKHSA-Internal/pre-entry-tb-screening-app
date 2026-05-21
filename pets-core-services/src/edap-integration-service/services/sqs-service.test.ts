import { SendMessageCommand, SendMessageCommandOutput, SQSClient } from "@aws-sdk/client-sqs";
import { DynamoDBRecord } from "aws-lambda";
import { beforeEach, describe, expect, it, MockInstance, vi } from "vitest";

import { logger } from "../../shared/logger";
import { SQService } from "./sqs-service";

const dbRecord: DynamoDBRecord = {
  awsRegion: "eu-west-1",
  dynamodb: {
    NewImage: {
      pk: { S: "unique-pk" },
      sk: { S: "test-sk" },
      dateCreated: { S: "2025-05-05" },
    },
  },
  eventID: "event-id",
  eventName: "INSERT",
  eventSource: "event-source",
  eventSourceARN: "ARN::sth",
  eventVersion: "v.1.0",
  userIdentity: "user-identity",
};

vi.mock("../../shared/logger", () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

describe("SQService", () => {
  let service: SQService;
  let sendSpy: MockInstance<(command: SendMessageCommand) => Promise<SendMessageCommandOutput>>;

  beforeEach(() => {
    vi.clearAllMocks();

    // 🔧 Environment setup
    process.env.AWS_REGION = "eu-west-2";
    process.env.AWS_ACCOUNT_ID = "111111111111";
    process.env.EDAP_AWS_ACCOUNT_ID = "222222222222";
    process.env.EDAP_INTEGRATION_QUEUE_NAME = "sqs-edap-integration";
    process.env.EDAP_INTEGRATION_DLQ_NAME = "sqs-edap-integration-dlq";
    process.env.ENVIRONMENT = "dev";

    // 🧩 Create fake SQS client and spy on .send()
    const fakeClient = new SQSClient({ region: "eu-west-2" });

    sendSpy = vi
      .spyOn(
        fakeClient as unknown as {
          send: (command: SendMessageCommand) => Promise<SendMessageCommandOutput>;
        },
        "send",
      )
      .mockResolvedValue({
        MessageId: "mock-id",
      } as unknown as SendMessageCommandOutput);

    // Inject our fake client

    service = new SQService();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (service as any).sqsClient = fakeClient;
  });

  it("uses dev account ID for non-prod environment", () => {
    process.env.ENVIRONMENT = "dev";
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const accountId = (service as any).getAWSAccountIdForEDAP();
    expect(accountId).toBe("111111111111");
  });

  it("uses prod account ID for prod environment", () => {
    process.env.ENVIRONMENT = "prod";
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const accountId = (service as any).getAWSAccountIdForEDAP();
    expect(accountId).toBe("222222222222");
  });

  it("uses EDAP account ID for preprod environment", () => {
    process.env.ENVIRONMENT = "preprod";
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const accountId = (service as any).getAWSAccountIdForEDAP();
    expect(accountId).toBe("222222222222");
  });

  it("sends message to integration queue (standard)", async () => {
    await service.sendDbStreamMessage(dbRecord);

    expect(sendSpy).toHaveBeenCalledTimes(1);
    const cmd = sendSpy.mock.calls[0][0];
    const input = cmd.input;

    expect(input.QueueUrl).toBe(
      "https://sqs.eu-west-2.amazonaws.com/111111111111/sqs-edap-integration",
    );
    expect(input.MessageBody).toEqual(JSON.stringify(dbRecord));
    expect(input.MessageGroupId).toBeUndefined();
  });

  it("adds FIFO parameters when queue ends with .fifo", async () => {
    process.env.EDAP_INTEGRATION_QUEUE_NAME = "integration-queue.fifo";
    const fifoMessage = { pk: "unique-pk", sk: "test-sk" };

    await service.sendDbStreamMessage(fifoMessage);

    const cmd = sendSpy.mock.calls[0][0];
    const input = cmd.input;

    expect(input.MessageGroupId).toBe("unique-pk_test-sk");
    expect(input.MessageDeduplicationId).toBeDefined();
  });

  it("sends message to DLQ with correct URL", async () => {
    await service.sendToDLQ(dbRecord);

    const cmd = sendSpy.mock.calls[0][0];
    const input = cmd.input;

    expect(input.QueueUrl).toBe(
      "https://sqs.eu-west-2.amazonaws.com/111111111111/sqs-edap-integration-dlq",
    );
    expect(input.MessageBody).toContain("unique-pk");
  });

  it("uses AWS_ACCOUNT_ID for uat environment", () => {
    process.env.ENVIRONMENT = "uat";
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const accountId = (service as any).getAWSAccountIdForEDAP();
    expect(accountId).toBe("111111111111");
  });

  it("logs info when sending to integration queue", async () => {
    await service.sendDbStreamMessage(dbRecord);
    expect(logger.info).toHaveBeenCalledWith("[SQS] Sending message");
  });

  it("logs info when sending to DLQ", async () => {
    await service.sendToDLQ(dbRecord);
    expect(logger.info).toHaveBeenCalledWith("[DLQ] Sending message");
  });

  it("DLQ always uses AWS_ACCOUNT_ID even in prod environment", async () => {
    process.env.ENVIRONMENT = "prod";
    await service.sendToDLQ(dbRecord);

    const cmd = sendSpy.mock.calls[0][0];
    // DLQ hardcodes AWS_ACCOUNT_ID (111111111111), not EDAP account (222222222222)
    expect(cmd.input.QueueUrl).toContain("111111111111");
    expect(cmd.input.QueueUrl).toContain("sqs-edap-integration-dlq");
  });

  it("uses timestamp as MessageGroupId sk fallback for FIFO queue when sk is absent", async () => {
    process.env.EDAP_INTEGRATION_QUEUE_NAME = "integration-queue.fifo";
    const messageWithoutSk = { pk: "unique-pk" };

    await service.sendDbStreamMessage(messageWithoutSk);

    const cmd = sendSpy.mock.calls[0][0];
    expect(cmd.input.MessageGroupId).toMatch(/^unique-pk_\d+$/);
    expect(cmd.input.MessageDeduplicationId).toBeDefined();
  });

  it("rejects when SQS client throws during sendDbStreamMessage", async () => {
    sendSpy.mockRejectedValueOnce(new Error("SQS network error"));

    await expect(service.sendDbStreamMessage(dbRecord)).rejects.toThrow("SQS network error");
  });

  it("rejects when SQS client throws during sendToDLQ", async () => {
    sendSpy.mockRejectedValueOnce(new Error("DLQ network error"));

    await expect(service.sendToDLQ(dbRecord)).rejects.toThrow("DLQ network error");
  });
});
