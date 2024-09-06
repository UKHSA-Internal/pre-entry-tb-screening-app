import AWSXRay from "aws-xray-sdk";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand
} from "@aws-sdk/lib-dynamodb";
import { 
  DynamoDBClient, 
  PutItemOutput,
  ScanCommand, 
  ScanOutput
} from "@aws-sdk/client-dynamodb";
import { ServiceException } from "@smithy/smithy-client";
import { Configuration } from "@utils/Configuration";
import { IPetsClinic } from "@models/IPetsClinic";

export default class PetsClinicDAO {
  private static dbClient: DynamoDBDocumentClient;
  private readonly tableName: string;

  constructor() {
    const config: any = Configuration.getInstance().getDynamoDBConfig();
    this.tableName = config.table;
    if (!PetsClinicDAO.dbClient) {
      let client: DynamoDBClient;
      if (process.env._X_AMZN_TRACE_ID) {
        client = AWSXRay.captureAWSv3Client(new DynamoDBClient(config.params));
      } else {
        client = new DynamoDBClient(config.params);
      }
      PetsClinicDAO.dbClient = DynamoDBDocumentClient.from(client);
    }
  }

  public async getItem(petsClinicId: string) {
    const params = {
      TableName: this.tableName,
      Key: {
        "petsClinicId": petsClinicId,
      },
    };
    const command = new GetCommand(params);

    return await PetsClinicDAO.dbClient.send(command);
  }
  
  public async getAll(): Promise<ScanOutput | ServiceException> {
    const params = {
      TableName: this.tableName
    };
    const command = new ScanCommand(params);
    return await PetsClinicDAO.dbClient.send(command);
  }

  public async putItem(
    petsClinicItem: IPetsClinic
  ): Promise<PutItemOutput | ServiceException> {
    const params = {
      TableName: this.tableName,
      Item: petsClinicItem,
    };
    const command = new PutCommand(params);
    return await PetsClinicDAO.dbClient.send(command);
  }
}
