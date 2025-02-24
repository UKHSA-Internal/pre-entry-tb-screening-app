import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

class AWSClients {
  private static instance: AWSClients;
  private _dynamoDBDocClient?: DynamoDBDocumentClient;
  private _s3Client?: S3Client;

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

  get s3Client(): S3Client {
    if (!this._s3Client) {
      this._s3Client = new S3Client({ region: "eu-west-2" });
    }
    return this._s3Client;
  }
}

const awsClients = AWSClients.getInstance();

export default awsClients;
