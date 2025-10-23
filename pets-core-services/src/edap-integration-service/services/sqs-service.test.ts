import { SendMessageCommand, SendMessageCommandOutput, SQSClient } from "@aws-sdk/client-sqs";
import { beforeEach, describe, expect, it, MockInstance, vi } from "vitest";

import { SQService } from "./sqs-service";

vi.mock("../../shared/logger", () => ({
  logger: {
    info: vi.fn(),
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

  it("sends message to integration queue (standard)", async () => {
    await service.sendDbStreamMessage("hello");

    expect(sendSpy).toHaveBeenCalledTimes(1);
    const cmd = sendSpy.mock.calls[0][0];
    const input = cmd.input;

    expect(input.QueueUrl).toBe(
      "https://sqs.eu-west-2.amazonaws.com/111111111111/sqs-edap-integration",
    );
    expect(input.MessageBody).toBe("hello");
    expect(input.MessageGroupId).toBeUndefined();
  });

  it("adds FIFO parameters when queue ends with .fifo", async () => {
    process.env.EDAP_INTEGRATION_QUEUE_NAME = "integration-queue.fifo";

    await service.sendDbStreamMessage("fifo-test");

    const cmd = sendSpy.mock.calls[0][0];
    const input = cmd.input;

    expect(input.MessageGroupId).toBe("default");
    expect(input.MessageDeduplicationId).toBeDefined();
  });

  it("sends message to DLQ with correct URL", async () => {
    await service.sendToDLQ("dlq-message");

    const cmd = sendSpy.mock.calls[0][0];
    const input = cmd.input;

    expect(input.QueueUrl).toBe(
      "https://sqs.eu-west-2.amazonaws.com/111111111111/sqs-edap-integration-dlq",
    );
    expect(input.MessageBody).toBe("dlq-message");
  });
});
