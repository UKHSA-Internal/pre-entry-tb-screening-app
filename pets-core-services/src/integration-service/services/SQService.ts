import {
  GetQueueUrlCommand,
  GetQueueUrlCommandOutput,
  MessageAttributeValue,
  ReceiveMessageCommand,
  ReceiveMessageCommandOutput,
  SendMessageCommand,
  SendMessageCommandInput,
  SQSClient,
} from "@aws-sdk/client-sqs";
import { ServiceException } from "@smithy/smithy-client";

import { logger } from "../../shared/logger";
import { Service } from "../models/injector/ServiceDecorator";

/**
 * Service class for interfacing with the Simple Queue Service
 */

@Service()
class SQService {
  public readonly sqsClient: SQSClient;

  /**
   * Constructor for the ActivityService class
   * @param sqsClient - The Simple Queue Service client
   */
  constructor(sqsClient: SQSClient) {
    this.sqsClient = new SQSClient({ ...sqsClient, region: "eu-west-2" });
  }

  /**
   * Send a message to cert-gen queue
   * @param messageBody
   */
  public sendCertGenMessage(messageBody: string) {
    logger.info(`Message Body to be sent: ${messageBody}`);

    return this.sendMessage(messageBody, process.env.INTEGRATION_SERVICE_QUEUE_NAME as string);
  }

  /**
   * Send a message to the specified queue (the AWS SQS queue URL is resolved based on the queueName for each message )
   * @param messageBody - A string message body
   * @param messageAttributes - A MessageAttributeMap
   * @param queueName - The queue name
   */
  private async sendMessage(
    messageBody: string,
    queueName: string,
    messageAttributes?: Record<string, MessageAttributeValue>,
  ) {
    // Get the queue URL for the provided queue name
    const queueUrlResult: GetQueueUrlCommandOutput = await this.sqsClient.send(
      new GetQueueUrlCommand({ QueueName: queueName }),
    );

    const params = {
      QueueUrl: queueUrlResult.QueueUrl,
      MessageBody: messageBody,
    };

    if (messageAttributes) {
      Object.assign(params, { MessageAttributes: messageAttributes });
    }

    // Send a message to the queue
    await this.sqsClient.send(new SendMessageCommand(params as SendMessageCommandInput));
  }

  /**
   * Get the messages in the queue
   */

  public async getMessages(): Promise<ReceiveMessageCommandOutput | ServiceException> {
    // Get the queue URL for the provided queue name
    const queueUrlResult: GetQueueUrlCommandOutput = await this.sqsClient.send(
      new GetQueueUrlCommand({ QueueName: process.env.INTEGRATION_SERVICE_QUEUE_NAME as string }),
    );
    // Get the messages from the queue
    return this.sqsClient.send(new ReceiveMessageCommand({ QueueUrl: queueUrlResult.QueueUrl! }));
  }
}

export { SQService };
