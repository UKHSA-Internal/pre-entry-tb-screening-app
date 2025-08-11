import {
  GetQueueUrlCommand,
  GetQueueUrlCommandOutput,
  MessageAttributeValue,
  SendMessageCommand,
  SendMessageCommandInput,
  SQSClient,
} from "@aws-sdk/client-sqs";

import awsClients from "../../shared/clients/aws";
import { logger } from "../../shared/logger";

const { sqsClient } = awsClients;

/**
 * Service class for interfacing with the Simple Queue Service
 */

class SQService {
  public readonly sqsClient: SQSClient;

  constructor() {
    this.sqsClient = sqsClient;
  }

  /**
   * Send a message to EDAP integration queue
   * @param messageBody
   */
  public sendDbStreamMessage(messageBody: string) {
    logger.info(`Message Body to be sent: ${messageBody}`);

    return this.sendMessage(messageBody, process.env.EDAP_INTEGRATION_QUEUE_NAME as string);
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
    logger.info(`Queue URL result: ${JSON.stringify(queueUrlResult)}`);

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
}

export { SQService };
