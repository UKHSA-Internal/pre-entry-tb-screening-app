import {
  AttributeDefinition,
  BillingMode,
  CreateTableCommand,
  GlobalSecondaryIndex,
} from "@aws-sdk/client-dynamodb";
import { CreateQueueCommand, QueueAttributeName } from "@aws-sdk/client-sqs";

import awsClients from "../shared/clients/aws";

const { dynamoDBDocClient, sqsClient } = awsClients;

export const createTable = async (
  tableName: string,
  extraAttributes: AttributeDefinition[],
  GlobalSecondaryIndexes?: GlobalSecondaryIndex[],
) => {
  const createTableCommand = new CreateTableCommand({
    TableName: tableName,
    KeySchema: [
      {
        AttributeName: "pk",
        KeyType: "HASH",
      },
      {
        AttributeName: "sk",
        KeyType: "RANGE",
      },
    ],
    AttributeDefinitions: [
      {
        AttributeName: "pk",
        AttributeType: "S",
      },
      {
        AttributeName: "sk",
        AttributeType: "S",
      },
      ...extraAttributes,
    ],
    BillingMode: BillingMode.PAY_PER_REQUEST,
    GlobalSecondaryIndexes,
  });
  await dynamoDBDocClient.send(createTableCommand);
};

export const createQueue = async (
  queueName: string,
  attributes: Partial<Record<QueueAttributeName, string>> | undefined,
) => {
  const createQueueCommand = new CreateQueueCommand({
    QueueName: queueName,
    Attributes: { ...attributes },
  });
  await sqsClient.send(createQueueCommand);
};
