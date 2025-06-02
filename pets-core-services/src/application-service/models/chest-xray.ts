import { GetCommand, PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";

import awsClients from "../../shared/clients/aws";
import { logger } from "../../shared/logger";
import { Application } from "../../shared/models/application";
import { TaskStatus } from "../../shared/types/enum";
import { ChestXRayNotTakenReason, ChestXRayResult, YesOrNo } from "../types/enums";

const { dynamoDBDocClient: docClient } = awsClients;

abstract class ChestXRayBase {
  applicationId: string;
  status: TaskStatus;

  dateCreated: Date;
  createdBy: string;

  isSputumRequired: YesOrNo;

  constructor(details: ChestXRayBase) {
    this.applicationId = details.applicationId;
    this.status = details.status;

    // Audit
    this.dateCreated = details.dateCreated;
    this.createdBy = details.createdBy;
    this.isSputumRequired = details.isSputumRequired;
  }
}

type IChestXRayTaken = {
  applicationId: string;
  status: TaskStatus;
  dateCreated: Date;
  createdBy: string;
  isSputumRequired: YesOrNo;

  chestXrayTaken: YesOrNo.Yes;
  posteroAnteriorXrayFileName: string;
  posteroAnteriorXray: string;
  apicalLordoticXrayFileName?: string;
  apicalLordoticXray?: string;
  lateralDecubitusXrayFileName?: string;
  lateralDecubitusXray?: string;

  xrayResult: ChestXRayResult;
  xrayResultDetail?: string;
  xrayMinorFindings: string[];
  xrayAssociatedMinorFindings: string[];
  xrayActiveTbFindings: string[];
};

export type NewChestXRayTaken = Omit<IChestXRayTaken, "dateCreated" | "status">;

export class ChestXRayTaken extends ChestXRayBase {
  chestXrayTaken: YesOrNo.Yes;
  posteroAnteriorXrayFileName: string;
  posteroAnteriorXray: string;
  apicalLordoticXrayFileName?: string;
  apicalLordoticXray?: string;
  lateralDecubitusXrayFileName?: string;
  lateralDecubitusXray?: string;
  xrayResult: ChestXRayResult;
  xrayResultDetail?: string;
  xrayMinorFindings: string[];
  xrayAssociatedMinorFindings: string[];
  xrayActiveTbFindings: string[];

  constructor(details: IChestXRayTaken) {
    super(details);

    this.chestXrayTaken = details.chestXrayTaken;
    this.posteroAnteriorXrayFileName = details.posteroAnteriorXrayFileName;
    this.posteroAnteriorXray = details.posteroAnteriorXray;
    this.apicalLordoticXrayFileName = details.apicalLordoticXrayFileName;
    this.apicalLordoticXray = details.apicalLordoticXray;
    this.lateralDecubitusXrayFileName = details.lateralDecubitusXrayFileName;
    this.lateralDecubitusXray = details.lateralDecubitusXray;

    this.xrayResult = details.xrayResult;
    this.xrayResultDetail = details.xrayResultDetail;
    this.xrayMinorFindings = details.xrayMinorFindings;
    this.xrayAssociatedMinorFindings = details.xrayAssociatedMinorFindings;
    this.xrayActiveTbFindings = details.xrayActiveTbFindings;
  }

  toJson() {
    return {
      applicationId: this.applicationId,
      status: this.status,
      chestXrayTaken: this.chestXrayTaken,
      posteroAnteriorXrayFileName: this.posteroAnteriorXrayFileName,
      posteroAnteriorXray: this.posteroAnteriorXray,
      apicalLordoticXrayFileName: this.apicalLordoticXrayFileName,
      apicalLordoticXray: this.apicalLordoticXray,
      lateralDecubitusXrayFileName: this.lateralDecubitusXrayFileName,
      lateralDecubitusXray: this.lateralDecubitusXray,
      xrayResult: this.xrayResult,
      xrayResultDetail: this.xrayResultDetail,
      xrayMinorFindings: this.xrayMinorFindings,
      xrayAssociatedMinorFindings: this.xrayAssociatedMinorFindings,
      xrayActiveTbFindings: this.xrayActiveTbFindings,
      dateCreated: this.dateCreated,
      isSputumRequired: this.isSputumRequired,
    };
  }
}

type IChestXRayNotTaken = {
  applicationId: string;
  status: TaskStatus;
  dateCreated: Date;
  createdBy: string;
  isSputumRequired: YesOrNo;

  chestXrayTaken: YesOrNo.No;
  reasonXrayWasNotTaken: ChestXRayNotTakenReason;
  xrayWasNotTakenFurtherDetails?: string;
};

export type NewChestXRayNotTaken = Omit<IChestXRayNotTaken, "dateCreated" | "status">;

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
        status: TaskStatus.COMPLETE,
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
