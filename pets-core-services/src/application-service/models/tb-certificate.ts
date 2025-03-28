import { GetCommand, PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";

import awsClients from "../../shared/clients/aws";
import { getDateWithoutTime } from "../../shared/date";
import { logger } from "../../shared/logger";
import { Application } from "../../shared/models/application";
import { TaskStatus } from "../../shared/types/enum";
import { YesOrNo } from "../types/enums";

const { dynamoDBDocClient: docClient } = awsClients;

abstract class TbCertificateBase {
  applicationId: string;
  status: TaskStatus;

  dateCreated: Date;
  createdBy: string;

  constructor(details: TbCertificateBase) {
    this.applicationId = details.applicationId;
    this.status = details.status;

    // Audit
    this.dateCreated = details.dateCreated;
    this.createdBy = details.createdBy;
  }
}

type ITbCertificateIssued = {
  applicationId: string;
  status: TaskStatus;
  dateCreated: Date;
  createdBy: string;

  isIssued: YesOrNo.Yes;
  comments?: string;
  issueDate: Date;
  certificateNumber: string;
};

export type NewTbCertificateIssuedDetails = Omit<
  ITbCertificateIssued,
  "dateCreated" | "issueDate" | "status"
> & {
  issueDate: Date | string;
};

export class TbCertificateIssued extends TbCertificateBase {
  isIssued: YesOrNo.Yes;
  comments?: string;
  issueDate: Date;
  certificateNumber: string;

  constructor(details: ITbCertificateIssued) {
    super(details);

    this.isIssued = details.isIssued;
    this.comments = details.comments;
    this.issueDate = details.issueDate;
    this.certificateNumber = details.certificateNumber;
  }

  toJson() {
    return {
      applicationId: this.applicationId,
      status: this.status,
      isIssued: this.isIssued,
      comments: this.comments,
      issueDate: getDateWithoutTime(this.issueDate),
      certificateNumber: this.certificateNumber,
      dateCreated: this.dateCreated,
    };
  }
}

type ITbCertificateNotIssued = {
  applicationId: string;
  status: TaskStatus;
  dateCreated: Date;
  createdBy: string;

  isIssued: YesOrNo.No;
  comments?: string;
};

export type NewTbCertificateNotIssuedDetails = Omit<
  ITbCertificateNotIssued,
  "dateCreated" | "status"
>;

export class TbCertificateNotIssued extends TbCertificateBase {
  isIssued: YesOrNo.No;
  comments?: string;

  constructor(details: ITbCertificateNotIssued) {
    super(details);

    this.isIssued = details.isIssued;
    this.comments = details.comments;
  }

  toJson() {
    return {
      applicationId: this.applicationId,
      status: this.status,
      isIssued: this.isIssued,
      comments: this.comments,
      dateCreated: this.dateCreated,
    };
  }
}

export class TbCertificateDbOps {
  static readonly getPk = (applicationId: string) => Application.getPk(applicationId);
  static readonly sk = "APPLICATION#TB#CERTIFICATE";
  static readonly getTableName = () => process.env.APPLICATION_SERVICE_DATABASE_NAME;

  static todbItem(tbCertificate: TbCertificateIssued | TbCertificateNotIssued) {
    const dbItem =
      tbCertificate.isIssued === YesOrNo.Yes
        ? {
            ...tbCertificate,
            dateCreated: tbCertificate.dateCreated.toISOString(),
            issueDate: tbCertificate.issueDate.toISOString(),
            pk: TbCertificateDbOps.getPk(tbCertificate.applicationId),
            sk: TbCertificateDbOps.sk,
          }
        : {
            ...tbCertificate,
            dateCreated: tbCertificate.dateCreated.toISOString(),
            pk: TbCertificateDbOps.getPk(tbCertificate.applicationId),
            sk: TbCertificateDbOps.sk,
          };
    return dbItem;
  }

  static async createTbCertificate(
    details: NewTbCertificateIssuedDetails | NewTbCertificateNotIssuedDetails,
  ) {
    try {
      logger.info("Saving TB Certificate information to DB");
      const updatedDetails =
        details.isIssued === YesOrNo.Yes
          ? {
              ...details,
              dateCreated: new Date(),
              status: TaskStatus.completed,
              issueDate: new Date(details.issueDate),
            }
          : {
              ...details,
              dateCreated: new Date(),
              status: TaskStatus.completed,
            };

      const tbCertificate =
        details.isIssued === YesOrNo.Yes
          ? new TbCertificateIssued(updatedDetails as ITbCertificateIssued)
          : new TbCertificateNotIssued(updatedDetails as ITbCertificateNotIssued);

      const dbItem = TbCertificateDbOps.todbItem(tbCertificate);
      const params: PutCommandInput = {
        TableName: TbCertificateDbOps.getTableName(),
        Item: { ...dbItem },
        ConditionExpression: "attribute_not_exists(pk) AND attribute_not_exists(sk)",
      };
      const command = new PutCommand(params);
      const response = await docClient.send(command);

      logger.info({ response }, "TB Certificate information saved successfully");

      return tbCertificate;
    } catch (error) {
      logger.error(error, "Error saving TB Certificate information");
      throw error;
    }
  }

  static async getByApplicationId(applicationId: string) {
    try {
      logger.info("fetching TB Certificate information");

      const params = {
        TableName: TbCertificateDbOps.getTableName(),
        Key: {
          pk: TbCertificateDbOps.getPk(applicationId),
          sk: TbCertificateDbOps.sk,
        },
      };

      const command = new GetCommand(params);
      const data = await docClient.send(command);

      if (!data.Item) {
        logger.info("No TB Certificate info found");
        return;
      }

      logger.info("TB Certificate information fetched successfully");

      const dbItem = data.Item as ReturnType<(typeof TbCertificateDbOps)["todbItem"]>;

      const tbCertificate =
        dbItem.isIssued === YesOrNo.Yes
          ? new TbCertificateIssued({
              ...dbItem,
              dateCreated: new Date(dbItem.dateCreated),
              issueDate: new Date(dbItem.issueDate),
            })
          : new TbCertificateNotIssued({
              ...dbItem,
              dateCreated: new Date(dbItem.dateCreated),
            });

      return dbItem.isIssued === YesOrNo.Yes
        ? new TbCertificateIssued(tbCertificate as ITbCertificateIssued)
        : new TbCertificateNotIssued(tbCertificate as ITbCertificateNotIssued);
    } catch (error) {
      logger.error(error, "Error retrieving TB Certificate information");
      throw error;
    }
  }
}
