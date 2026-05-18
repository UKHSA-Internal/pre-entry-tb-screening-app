import { AttributeValue } from "@aws-sdk/client-dynamodb";
import {
  MessageAttributeValue,
  SendMessageCommand,
  SendMessageCommandInput,
  SQSClient,
} from "@aws-sdk/client-sqs";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { DynamoDBRecord } from "aws-lambda";

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
  public sendDbStreamMessage(messageBody: DynamoDBRecord) {
    logger.info("[SQS] Sending message");
    return this.sendMessage(
      messageBody,
      process.env.EDAP_INTEGRATION_QUEUE_NAME as string,
      this.getAWSAccountIdForEDAP() as string,
    );
  }

  private getAWSAccountIdForEDAP() {
    const environment = process.env.ENVIRONMENT; // e.g. "dev" | "uat" | "prod"
    let queueOwnerAWSAccountId: string | undefined;
    if (environment === "preprod" || environment === "prod") {
      queueOwnerAWSAccountId = process.env.EDAP_AWS_ACCOUNT_ID;
    } else {
      queueOwnerAWSAccountId = process.env.AWS_ACCOUNT_ID;
    }
    return queueOwnerAWSAccountId;
  }

  /**
   * Send a message to DLQ
   * @param messageBody
   */
  public sendToDLQ(messageBody: DynamoDBRecord) {
    logger.info("[DLQ] Sending message");

    return this.sendMessage(
      messageBody,
      process.env.EDAP_INTEGRATION_DLQ_NAME as string,
      process.env.AWS_ACCOUNT_ID as string,
    );
  }

  /**
   * Send a message to the specified queue (the AWS SQS queue URL is resolved based on the queueName for each message )
   * @param messageBody - A string message body
   * @param messageAttributes - A MessageAttributeMap
   * @param queueName - The queue name
   */
  private async sendMessage(
    messageBody: DynamoDBRecord,
    queueName: string,
    queueOwnerAWSAccountId: string,
    messageAttributes?: Record<string, MessageAttributeValue>,
  ) {
    // Detect FIFO automatically
    const isFifo = queueName.endsWith(".fifo");

    // Get the queue URL for the provided queue name

    const queueUrl = `https://sqs.${process.env.AWS_REGION}.amazonaws.com/${queueOwnerAWSAccountId}/${queueName}`;

    const params: SendMessageCommandInput = {
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(messageBody),
    };

    if (isFifo) {
      const dynamoDB = messageBody.dynamodb;
      const newImage = dynamoDB?.NewImage;
      const data = newImage ? unmarshall(newImage as Record<string, AttributeValue>) : undefined;

      params.MessageGroupId = `${data?.pk ?? dynamoDB?.ApproximateCreationDateTime}_${data?.sk ?? Date.now().toString()}`;
      params.MessageDeduplicationId = Date.now().toString();
    }

    if (messageAttributes) {
      Object.assign(params, { MessageAttributes: messageAttributes });
    }

    // Send a message to the queue
    await this.sqsClient.send(new SendMessageCommand(params));
  }
}

export { SQService };
