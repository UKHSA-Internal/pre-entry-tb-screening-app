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

    expect(input.MessageGroupId).toMatch(/^unique-pk_test-sk_\d+$/);
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
    expect(cmd.input.MessageGroupId).toMatch(/^unique-pk_attr-missing_\d+$/);
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

  describe("MessageGroupId length limit (FIFO)", () => {
    beforeEach(() => {
      process.env.EDAP_INTEGRATION_QUEUE_NAME = "integration-queue.fifo";
    });

    it("does not exceed 128 characters when pk and sk together would exceed the limit", async () => {
      const message = { pk: "a".repeat(70), sk: "b".repeat(70) };

      await service.sendDbStreamMessage(message);

      const { MessageGroupId } = sendSpy.mock.calls[0][0].input;
      expect(MessageGroupId!.length).toBeLessThanOrEqual(128);
    });

    it("is exactly 128 characters when the full group ID string exceeds 128 characters", async () => {
      const message = { pk: "a".repeat(70), sk: "b".repeat(70) };

      await service.sendDbStreamMessage(message);

      const { MessageGroupId } = sendSpy.mock.calls[0][0].input;
      expect(MessageGroupId!.length).toBe(128);
    });

    it("still ends with the timestamp (MessageDeduplicationId) when truncated", async () => {
      const message = { pk: "a".repeat(70), sk: "b".repeat(70) };

      await service.sendDbStreamMessage(message);

      const { MessageGroupId, MessageDeduplicationId } = sendSpy.mock.calls[0][0].input;
      expect(MessageGroupId!.endsWith(MessageDeduplicationId!)).toBe(true);
    });

    it("does not truncate and stays within 128 characters when pk and sk are short", async () => {
      const message = { pk: "short-pk", sk: "short-sk" };

      await service.sendDbStreamMessage(message);

      const { MessageGroupId } = sendSpy.mock.calls[0][0].input;
      expect(MessageGroupId!.length).toBeLessThanOrEqual(128);
      expect(MessageGroupId).toMatch(/^short-pk_short-sk_\d+$/);
    });

    it("does not exceed 128 characters when sk is absent and pk is very long", async () => {
      const message = { pk: "a".repeat(120) };

      await service.sendDbStreamMessage(message);

      const { MessageGroupId } = sendSpy.mock.calls[0][0].input;
      expect(MessageGroupId!.length).toBeLessThanOrEqual(128);
    });
  });

  describe("onlyASCIICharacters", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const sanitize = (s: string): string => (service as any).onlyASCIICharacters(s) as string;

    it("returns an ASCII-only string unchanged", () => {
      expect(sanitize("hello_world-123")).toBe("hello_world-123");
    });

    it("returns an empty string unchanged", () => {
      expect(sanitize("")).toBe("");
    });

    it("replaces a single non-ASCII character with '?'", () => {
      expect(sanitize("caf\u00e9")).toBe("caf?"); // é → ?
    });

    it("replaces multiple different non-ASCII characters", () => {
      expect(sanitize("\u00fcber-na\u00efve")).toBe("?ber-na?ve"); // ü, ï → ?
    });

    it("replaces emoji with '?'", () => {
      expect(sanitize("hello\uD83D\uDE00world")).toBe("hello??world"); // 😀 is two surrogates
    });

    it("keeps control characters (0x00–0x1F) as they are within ASCII range", () => {
      expect(sanitize("a\tb")).toBe("a?b"); // tab is 0x09, out of allowed range
    });

    it("replaces every non-ASCII character in a string of all non-ASCII", () => {
      const input = "\u00e9\u00f1\u00fc";
      expect(sanitize(input)).toBe("???");
    });

    it('replaces every non-ASCII character in string: "PAN/Ciudad,de,Panamá/NA/01/00X "', () => {
      const input = '"PAN/Ciudad,de,Panamá/NA/01/00X "';
      expect(sanitize(input)).toBe('"PAN/Ciudad,de,Panam?/NA/01/00X_"');
    });

    it('replaces every non-ASCII character in string: "Apollo Clinic"', () => {
      const input = "Apollo Clinic";
      expect(sanitize(input)).toBe("Apollo_Clinic");
    });

    it("FIFO MessageGroupId contains only ASCII characters when pk includes non-ASCII", async () => {
      process.env.EDAP_INTEGRATION_QUEUE_NAME = "integration-queue.fifo";
      const message = { pk: "caf\u00e9-pk", sk: "test-sk" };

      await service.sendDbStreamMessage(message);

      const { MessageGroupId } = sendSpy.mock.calls[0][0].input;
      // eslint-disable-next-line no-control-regex
      expect(MessageGroupId).toMatch(/^[\x00-\x7F]+$/);
      expect(MessageGroupId).toContain("caf?-pk");
    });
  });
});
