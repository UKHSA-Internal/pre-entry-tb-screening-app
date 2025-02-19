import {
  AttributeDefinition,
  BillingMode,
  CreateTableCommand,
  GlobalSecondaryIndex,
} from "@aws-sdk/client-dynamodb";

import awsClients from "../shared/clients/aws";

const { dynamoDBDocClient } = awsClients;

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
