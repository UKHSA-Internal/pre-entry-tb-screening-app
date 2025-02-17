import { BillingMode, CreateTableCommand } from "@aws-sdk/client-dynamodb";

import awsClients from "../shared/clients/aws";

const { dynamoDBDocClient } = awsClients;

export const createTable = async (tableName: string) => {
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
    ],
    BillingMode: BillingMode.PAY_PER_REQUEST,
  });
  await dynamoDBDocClient.send(createTableCommand);
};
