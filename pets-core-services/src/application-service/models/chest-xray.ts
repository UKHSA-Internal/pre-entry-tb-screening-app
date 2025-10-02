import { GetCommand, PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";

import awsClients from "../../shared/clients/aws";
import { logger } from "../../shared/logger";
import { Application } from "../../shared/models/application";
import { TaskStatus } from "../../shared/types/enum";

const { dynamoDBDocClient: docClient } = awsClients;

abstract class IChestXRay {
  applicationId: string;
  status: TaskStatus;
  dateCreated: Date;
  createdBy: string;
  dateXrayTaken: Date;
  posteroAnteriorXrayFileName: string;
  posteroAnteriorXray: string;
  apicalLordoticXrayFileName?: string;
  apicalLordoticXray?: string;
  lateralDecubitusXrayFileName?: string;
  lateralDecubitusXray?: string;
  constructor(details: IChestXRay) {
    this.applicationId = details.applicationId;
    this.status = details.status;

    // Audit
    this.dateCreated = details.dateCreated;
    this.createdBy = details.createdBy;

    this.dateXrayTaken = new Date(details.dateXrayTaken);
    this.posteroAnteriorXrayFileName = details.posteroAnteriorXrayFileName;
    this.posteroAnteriorXray = details.posteroAnteriorXray;
    this.apicalLordoticXrayFileName = details.apicalLordoticXrayFileName;
    this.apicalLordoticXray = details.apicalLordoticXray;
    this.lateralDecubitusXrayFileName = details.lateralDecubitusXrayFileName;
    this.lateralDecubitusXray = details.lateralDecubitusXray;
  }
}

export type NewChestXRay = Omit<IChestXRay, "dateCreated" | "status" | "dateXrayTaken"> & {
  dateXrayTaken: Date | string;
};

export class ChestXRay extends IChestXRay {
  static readonly getPk = (applicationId: string) => Application.getPk(applicationId);
  static readonly sk = "APPLICATION#CHEST#XRAY";
  static readonly getTableName = () => process.env.APPLICATION_SERVICE_DATABASE_NAME;

  private constructor(details: IChestXRay) {
    super(details);
  }

  private todbItem() {
    const dbItem = {
      ...this,
      dateXrayTaken: this.dateXrayTaken.toISOString(),
      dateCreated: this.dateCreated.toISOString(),
      pk: ChestXRay.getPk(this.applicationId),
      sk: ChestXRay.sk,
    };
    return dbItem;
  }

  static async createChestXray(details: NewChestXRay) {
    try {
      logger.info("Saving Chest X-Ray Information to DB");
      const updatedDetails = {
        ...details,
        dateXrayTaken: new Date(details.dateXrayTaken),
        dateCreated: new Date(),
        status: TaskStatus.completed,
      };

      const chestXray = new ChestXRay(updatedDetails as IChestXRay);

      const dbItem = chestXray.todbItem();
      const params: PutCommandInput = {
        TableName: ChestXRay.getTableName(),
        Item: { ...dbItem },
        ConditionExpression: "attribute_not_exists(pk) AND attribute_not_exists(sk)",
      };
      const command = new PutCommand(params);
      const response = await docClient.send(command);

      logger.info({ response }, "Chest X-ray saved successfully");

      return chestXray;
    } catch (error) {
      logger.error(error, "Error Saving Chest X-ray");
      throw error;
    }
  }

  static async getByApplicationId(applicationId: string) {
    try {
      logger.info("fetching Chest X-ray");

      const params = {
        TableName: ChestXRay.getTableName(),
        Key: {
          pk: ChestXRay.getPk(applicationId),
          sk: ChestXRay.sk,
        },
      };

      const command = new GetCommand(params);
      const data = await docClient.send(command);

      if (!data.Item) {
        logger.info("No chestXray found");
        return;
      }

      logger.info("Chest X Ray fetched successfully");

      const dbItem = data.Item as ReturnType<ChestXRay["todbItem"]>;

      const chestXray = new ChestXRay({
        ...dbItem,
        dateXrayTaken: new Date(dbItem.dateXrayTaken),
        dateCreated: new Date(dbItem.dateCreated),
      });
      return chestXray;
    } catch (error) {
      logger.error(error, "Error retrieving Chest X-ray");
      throw error;
    }
  }

  toJson() {
    return {
      applicationId: this.applicationId,
      status: this.status,
      dateXrayTaken: this.dateXrayTaken,
      posteroAnteriorXrayFileName: this.posteroAnteriorXrayFileName,
      posteroAnteriorXray: this.posteroAnteriorXray,
      apicalLordoticXrayFileName: this.apicalLordoticXrayFileName,
      apicalLordoticXray: this.apicalLordoticXray,
      lateralDecubitusXrayFileName: this.lateralDecubitusXrayFileName,
      lateralDecubitusXray: this.lateralDecubitusXray,
      dateCreated: this.dateCreated,
    };
  }
}
