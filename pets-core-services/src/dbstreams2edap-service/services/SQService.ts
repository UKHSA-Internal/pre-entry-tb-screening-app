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
// import { Configuration } from "../utils/Configuration";

/* tslint:disable */
// const AWSXRay = require("aws-xray-sdk");
/* tslint:enable */

/**
 * Service class for interfacing with the Simple Queue Service
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
@Service()
class SQService {
  public readonly sqsClient: SQSClient;
  private readonly config: any;

  /**
   * Constructor for the ActivityService class
   * @param sqsClient - The Simple Queue Service client
   */
  constructor(sqsClient: SQSClient) {
    // const config: any = Configuration.getInstance().getConfig();
    // if (!config.sqs) {
    //   throw new Error("SQS config is not defined in the config file.");
    // }
    // const env: string = !process.env.BRANCH || process.env.BRANCH === "local" ? "local" : "remote";
    // this.config = config.sqs[env];
    // this.sqsClient = new SQSClient({ ...sqsClient, ...this.config });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    this.sqsClient = new SQSClient({ ...sqsClient, ...this.config, region: "eu-west-2" });

    // AWSConfig.sqs = this.config.params;
  }

  /**
   * Send a message to cert-gen queue
   * @param messageBody
   */
  public sendCertGenMessage(messageBody: string) {
    logger.info(`Message Body to be sent: ${messageBody}`);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.sendMessage(messageBody, this.config.queueName[0]);
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const queueUrlResult: GetQueueUrlCommandOutput = await this.sqsClient.send(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      new GetQueueUrlCommand({ QueueName: queueName }),
    );
    // .promise();

    const params = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      QueueUrl: queueUrlResult.QueueUrl,
      MessageBody: messageBody,
    };

    if (messageAttributes) {
      Object.assign(params, { MessageAttributes: messageAttributes });
    }

    // Send a message to the queue
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await this.sqsClient.send(new SendMessageCommand(params as SendMessageCommandInput));
  }

  /**
   * Get the messages in the queue
   */
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  public async getMessages(): Promise<ReceiveMessageCommandOutput | ServiceException> {
    // Get the queue URL for the provided queue name
    logger.info("here in getMessages");
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const queueUrlResult: GetQueueUrlCommandOutput = await this.sqsClient.send(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      new GetQueueUrlCommand({ QueueName: this.config.queueName[0] }),
    );
    logger.info("after get queueurl");
    // Get the messages from the queue
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    return this.sqsClient.send(new ReceiveMessageCommand({ QueueUrl: queueUrlResult.QueueUrl! }));
  }
}

export { SQService };
