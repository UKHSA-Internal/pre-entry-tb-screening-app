import AWSXRay from "aws-xray-sdk";
import {
    DynamoDBDocumentClient,
    PutCommand
} from "@aws-sdk/lib-dynamodb";
import { 
    DynamoDBClient, 
    PutItemOutput
  } from "@aws-sdk/client-dynamodb";
  import { ServiceException } from "@smithy/smithy-client";
import { Configuration } from "@utils/Configuration";
import { IPetsApplicant } from "@models/IPetsApplicant";

export default class PetsApplicantDAO {
    private static dbClient: DynamoDBDocumentClient;
    private readonly tableName: string;
  
    constructor() {
      const config: any = Configuration.getInstance().getDynamoDBConfig();
      this.tableName = config.table;
      if (!PetsApplicantDAO.dbClient) {
        let client: DynamoDBClient;
        if (process.env._X_AMZN_TRACE_ID) {
          client = AWSXRay.captureAWSv3Client(new DynamoDBClient(config.params));
        } else {
          client = new DynamoDBClient(config.params);
        }
        PetsApplicantDAO.dbClient = DynamoDBDocumentClient.from(client);
      }
    }

    public async putItem(
      petsApplicantItem: IPetsApplicant
    ): Promise<PutItemOutput | ServiceException> {
      const params = {
        TableName: this.tableName,
        Item: petsApplicantItem,
      };
      const command = new PutCommand(params);
      return await PetsApplicantDAO.dbClient.send(command);
    }
  }
  