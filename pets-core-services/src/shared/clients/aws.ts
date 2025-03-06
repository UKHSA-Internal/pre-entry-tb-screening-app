import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { LambdaClient } from "@aws-sdk/client-lambda";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

class AWSClients {
  private static instance: AWSClients;
  private _dynamoDBDocClient?: DynamoDBDocumentClient;
  private _lambdaClient?: LambdaClient;

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

  get lambdaClient(): LambdaClient {
    if (!this._lambdaClient) {
      this._lambdaClient = new LambdaClient({ region: "eu-west-2" });
    }
    return this._lambdaClient;
  }
}

const awsClients = AWSClients.getInstance();

export default awsClients;
