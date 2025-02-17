import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

class AWSClients {
  private static instance: AWSClients;
  private _dynamoDBDocClient?: DynamoDBDocumentClient;

  static getInstance(): AWSClients {
    if (!AWSClients.instance) {
      AWSClients.instance = new AWSClients();
    }
    return AWSClients.instance;
  }

  get dynamoDBDocClient(): DynamoDBDocumentClient {
    if (this._dynamoDBDocClient) return this._dynamoDBDocClient;

    const client = new DynamoDBClient({ region: "eu-west-2" });
    this._dynamoDBDocClient = DynamoDBDocumentClient.from(client);
    return this._dynamoDBDocClient;
  }
}

const awsClients = AWSClients.getInstance();

export default awsClients;
