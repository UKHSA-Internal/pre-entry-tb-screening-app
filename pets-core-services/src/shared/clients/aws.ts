import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { LambdaClient } from "@aws-sdk/client-lambda";
import { S3Client } from "@aws-sdk/client-s3";
import { SQSClient } from "@aws-sdk/client-sqs";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

class AWSClients {
  private static instance: AWSClients;
  private _dynamoDBDocClient?: DynamoDBDocumentClient;
  private _s3Client?: S3Client;
  private _lambdaClient?: LambdaClient;
  private _sqsClient?: SQSClient;

  static getInstance(): AWSClients {
    if (!AWSClients.instance) {
      AWSClients.instance = new AWSClients();
    }
    return AWSClients.instance;
  }

  get dynamoDBDocClient(): DynamoDBDocumentClient {
    if (this._dynamoDBDocClient) return this._dynamoDBDocClient;

    const client = new DynamoDBClient({ region: process.env.AWS_REGION });
    this._dynamoDBDocClient = DynamoDBDocumentClient.from(client);
    return this._dynamoDBDocClient;
  }

  get lambdaClient(): LambdaClient {
    this._lambdaClient ??= new LambdaClient({ region: process.env.AWS_REGION });
    return this._lambdaClient;
  }

  get s3Client(): S3Client {
    this._s3Client ??= new S3Client({ region: process.env.AWS_REGION });
    return this._s3Client;
  }

  get sqsClient(): SQSClient {
    this._sqsClient = this._sqsClient ?? new SQSClient({ region: process.env.AWS_REGION });

    return this._sqsClient;
  }
}

const awsClients = AWSClients.getInstance();

export default awsClients;
