import {
  GetCommand,
  PutCommand,
  PutCommandInput,
  UpdateCommand,
  UpdateCommandInput,
} from "@aws-sdk/lib-dynamodb";

import awsClients from "../../shared/clients/aws";
import { buildUpdateExpression } from "../../shared/helpers/buildUpdateExpression";
import { logger } from "../../shared/logger";
import { Application } from "../../shared/models/application";
import { TaskStatus } from "../../shared/types/enum";

const { dynamoDBDocClient: docClient } = awsClients;

abstract class ChestXrayBase {
  applicationId!: string;
  posteroAnteriorXrayFileName?: string;
  apicalLordoticXrayFileName?: string;
  lateralDecubitusXrayFileName?: string;

  constructor(details: Partial<ChestXrayBase>) {
    Object.assign(this, details); // copies all matching props
  }

  toJson() {
    // Copy everything from this
    const json = { ...this } as Record<string, unknown>;

    // Exclude internal fields
    delete json.createdBy;
    delete json.updatedBy;
    delete json.pk;
    delete json.sk;

    return json;
  }
}
export type IChestXray = {
  applicationId: string;
  status: TaskStatus;

  dateXrayTaken: Date;
  posteroAnteriorXrayFileName: string;
  posteroAnteriorXray: string;
  apicalLordoticXrayFileName?: string;
  apicalLordoticXray?: string;
  lateralDecubitusXrayFileName?: string;
  lateralDecubitusXray?: string;

  dateCreated: Date;
  createdBy: string;
};

export type IChestXrayUpdate = {
  applicationId: string;

  posteroAnteriorXrayFileName?: string;
  apicalLordoticXrayFileName?: string;
  lateralDecubitusXrayFileName?: string;

  dateUpdated: Date;
  updatedBy: string;
};

export class ChestXray extends ChestXrayBase {
  status: TaskStatus;

  dateXrayTaken: Date;
  posteroAnteriorXrayFileName: string;
  posteroAnteriorXray: string;
  apicalLordoticXray?: string;
  lateralDecubitusXray?: string;

  dateCreated: Date;
  createdBy: string;

  constructor(details: IChestXray) {
    super(details);
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

export type NewChestXray = Omit<IChestXray, "dateCreated" | "status" | "dateXrayTaken"> & {
  dateXrayTaken: Date | string;
};
export class ChestXrayUpdate extends ChestXrayBase {
  dateUpdated: Date;
  updatedBy: string;
  constructor(details: IChestXrayUpdate) {
    super(details);

    // Audit
    this.dateUpdated = details.dateUpdated;
    this.updatedBy = details.updatedBy;
  }
}

export type NewChestXrayUpdate = Omit<IChestXrayUpdate, "dateUpdated">;

export class ChestXrayDbOps {
  static readonly getPk = (applicationId: string) => Application.getPk(applicationId);
  static readonly sk = "APPLICATION#CHEST#XRAY";
  static readonly getTableName = () => process.env.APPLICATION_SERVICE_DATABASE_NAME;

  static todbItem(chestXray: ChestXray) {
    const dbItem = {
      ...chestXray,
      dateXrayTaken: chestXray.dateXrayTaken.toISOString(),
      dateCreated: chestXray.dateCreated.toISOString(),
      pk: ChestXrayDbOps.getPk(chestXray.applicationId),
      sk: ChestXrayDbOps.sk,
    };
    return dbItem;
  }

  static async createChestXray(
    details: Omit<IChestXray, "dateCreated" | "status" | "dateXrayTaken"> & {
      dateXrayTaken: Date | string;
    },
  ) {
    try {
      logger.info("Saving Chest X-Ray Information to DB");
      const chestXrayDetails = {
        ...details,
        dateXrayTaken: new Date(details.dateXrayTaken),
        dateCreated: new Date(),
        status: TaskStatus.completed,
      };

      const chestXray = new ChestXray(chestXrayDetails);

      const dbItem = ChestXrayDbOps.todbItem(chestXray);

      const params: PutCommandInput = {
        TableName: ChestXrayDbOps.getTableName(),
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
  static async updateChestXray(
    details: Omit<IChestXrayUpdate, "dateUpdated" | "status">,
  ): Promise<ChestXrayUpdate> {
    try {
      logger.info("Update Chest Xray Details to DB");
      const pk = ChestXrayDbOps.getPk(details.applicationId);
      const sk = ChestXrayDbOps.sk;
      const { UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } =
        buildUpdateExpression(details);

      const params: UpdateCommandInput = {
        TableName: ChestXrayDbOps.getTableName(),
        Key: { pk, sk },
        UpdateExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
        ReturnValues: "ALL_NEW", // Return updated item
      };

      const command = new UpdateCommand(params);
      const response = await docClient.send(command);
      const attrs = response.Attributes!;
      if (!attrs) throw new Error("Update failed");

      logger.info({ response }, "Chest Xray details updated successfully");
      const chestXray = new ChestXrayUpdate({
        applicationId: attrs?.applicationId,
        posteroAnteriorXrayFileName: attrs?.posteroAnteriorXrayFileName,
        lateralDecubitusXrayFileName: attrs?.lateralDecubitusXrayFileName,
        apicalLordoticXrayFileName: attrs?.apicalLordoticXrayFileName,
        dateUpdated: new Date(attrs?.dateUpdated as string),
        updatedBy: attrs?.updatedBy,
      });
      return chestXray;
    } catch (error) {
      logger.error(error, "Error updating chest xray");
      throw error;
    }
  }
  static async getByApplicationId(applicationId: string) {
    try {
      logger.info("fetching Chest X-ray");

      const params = {
        TableName: ChestXrayDbOps.getTableName(),
        Key: {
          pk: ChestXrayDbOps.getPk(applicationId),
          sk: ChestXrayDbOps.sk,
        },
      };

      const command = new GetCommand(params);
      const data = await docClient.send(command);

      if (!data.Item) {
        logger.info("No chestXray found");
        return;
      }

      logger.info("Chest X Ray fetched successfully");

      const chextXrayDbItem = data.Item as ReturnType<(typeof ChestXrayDbOps)["todbItem"]>;

      const chestXray = new ChestXray({
        ...chextXrayDbItem,
        dateXrayTaken: new Date(chextXrayDbItem.dateXrayTaken),
        dateCreated: new Date(chextXrayDbItem.dateCreated),
      });
      return chestXray;
    } catch (error) {
      logger.error(error, "Error retrieving Chest X-ray");
      throw error;
    }
  }
}
