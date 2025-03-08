import { GetCommand, PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";

import awsClients from "../../shared/clients/aws";
import { logger } from "../../shared/logger";
import { Application } from "../../shared/models/application";
import { TaskStatus } from "../../shared/types/enum";
import { ChestXRayNotTakenReason, YesOrNo } from "../types/enums";

const { dynamoDBDocClient: docClient } = awsClients;

abstract class ChestXRayBase {
  applicationId: string;
  status: TaskStatus;

  dateCreated: Date;
  createdBy: string;

  constructor(details: ChestXRayBase) {
    this.applicationId = details.applicationId;
    this.status = details.status;

    // Audit
    this.dateCreated = details.dateCreated;
    this.createdBy = details.createdBy;
  }
}

type IChestXRayTaken = {
  applicationId: string;
  status: TaskStatus;
  dateCreated: Date;
  createdBy: string;

  chestXrayTaken: YesOrNo.Yes;
  posteroAnteriorXray: string;
  apicalLordoticXray?: string;
  lateralDecubitusXray?: string;
};

type NewChestXRayTaken = Omit<IChestXRayTaken, "dateCreated" | "status">;

export class ChestXRayTaken extends ChestXRayBase {
  chestXrayTaken: YesOrNo.Yes;
  posteroAnteriorXray: string;
  apicalLordoticXray?: string;
  lateralDecubitusXray?: string;

  constructor(details: IChestXRayTaken) {
    super(details);

    this.chestXrayTaken = details.chestXrayTaken;
    this.chestXrayTaken = details.chestXrayTaken;
    this.posteroAnteriorXray = details.posteroAnteriorXray;
    this.apicalLordoticXray = details.apicalLordoticXray;
    this.lateralDecubitusXray = details.lateralDecubitusXray;
  }

  toJson() {
    return {
      applicationId: this.applicationId,
      status: this.status,
      chestXrayTaken: this.chestXrayTaken,
      posteroAnteriorXray: this.posteroAnteriorXray,
      apicalLordoticXray: this.apicalLordoticXray,
      lateralDecubitusXray: this.lateralDecubitusXray,
      dateCreated: this.dateCreated,
    };
  }
}

type IChestXRayNotTaken = {
  applicationId: string;
  status: TaskStatus;
  dateCreated: Date;
  createdBy: string;

  chestXrayTaken: YesOrNo.No;
  reasonXrayWasNotTaken: ChestXRayNotTakenReason;
  xrayWasNotTakenFurtherDetails?: string;
};

type NewChestXRayNotTaken = Omit<IChestXRayNotTaken, "dateCreated" | "status">;

export class ChestXRayNotTaken extends ChestXRayBase {
  chestXrayTaken: YesOrNo.No;
  reasonXrayWasNotTaken: ChestXRayNotTakenReason;
  xrayWasNotTakenFurtherDetails?: string;

  constructor(details: IChestXRayNotTaken) {
    super(details);

    this.chestXrayTaken = details.chestXrayTaken;
    this.reasonXrayWasNotTaken = details.reasonXrayWasNotTaken;
    this.xrayWasNotTakenFurtherDetails = details.xrayWasNotTakenFurtherDetails;
  }

  toJson() {
    return {
      applicationId: this.applicationId,
      status: this.status,
      chestXrayTaken: this.chestXrayTaken,
      reasonXrayWasNotTaken: this.reasonXrayWasNotTaken,
      xrayWasNotTakenFurtherDetails: this.xrayWasNotTakenFurtherDetails,
      dateCreated: this.dateCreated,
    };
  }
}

export class ChestXRayDbOps {
  static readonly getPk = (applicationId: string) => Application.getPk(applicationId);
  static readonly sk = "APPLICATION#CHEST#XRAY";
  static readonly getTableName = () => process.env.APPLICATION_SERVICE_DATABASE_NAME;

  static async createChestXray(details: NewChestXRayTaken | NewChestXRayNotTaken) {
    try {
      logger.info("Saving Chest X-Ray Information to DB");
      const updatedDetails = {
        ...details,
        dateCreated: new Date(),
        status: TaskStatus.completed,
      };

      const chestXray =
        details.chestXrayTaken === YesOrNo.Yes
          ? new ChestXRayTaken(updatedDetails as IChestXRayTaken)
          : new ChestXRayNotTaken(updatedDetails as IChestXRayNotTaken);

      const dbItem = ChestXRayDbOps.todbItem(chestXray);
      const params: PutCommandInput = {
        TableName: ChestXRayDbOps.getTableName(),
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

  static todbItem(chestXray: ChestXRayTaken | ChestXRayNotTaken) {
    const dbItem = {
      ...chestXray,
      dateCreated: chestXray.dateCreated.toISOString(),
      pk: ChestXRayDbOps.getPk(chestXray.applicationId),
      sk: ChestXRayDbOps.sk,
    };
    return dbItem;
  }

  static async getByApplicationId(applicationId: string) {
    try {
      logger.info("fetching Chest X-ray");

      const params = {
        TableName: ChestXRayDbOps.getTableName(),
        Key: {
          pk: ChestXRayDbOps.getPk(applicationId),
          sk: ChestXRayDbOps.sk,
        },
      };

      const command = new GetCommand(params);
      const data = await docClient.send(command);

      if (!data.Item) {
        logger.info("No chestXray found");
        return;
      }

      logger.info("Chest X Ray fetched successfully");

      const dbItem = data.Item as ReturnType<(typeof ChestXRayDbOps)["todbItem"]>;

      const chestXrayProp = {
        ...dbItem,
        dateCreated: new Date(dbItem.dateCreated),
      };
      return dbItem.chestXrayTaken === YesOrNo.Yes
        ? new ChestXRayTaken(chestXrayProp as IChestXRayTaken)
        : new ChestXRayNotTaken(chestXrayProp as IChestXRayNotTaken);
    } catch (error) {
      logger.error(error, "Error retrieving Chest X-ray");
      throw error;
    }
  }
}
