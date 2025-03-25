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

  certificateIssued: YesOrNo.Yes;
  certificateComments: string;
  certificateIssueDate: Date;
  certificateNumber: string;
};

export type NewTbCertificateIssuedDetails = Omit<
  ITbCertificateIssued,
  "dateCreated" | "certificateIssueDate" | "status"
> & {
  certificateIssueDate: Date | string;
};

export class TbCertificateIssued extends TbCertificateBase {
  certificateIssued: YesOrNo.Yes;
  certificateComments: string;
  certificateIssueDate: Date;
  certificateNumber: string;

  constructor(details: ITbCertificateIssued) {
    super(details);

    this.certificateIssued = details.certificateIssued;
    this.certificateComments = details.certificateComments;
    this.certificateIssueDate = details.certificateIssueDate;
    this.certificateNumber = details.certificateNumber;
  }

  toJson() {
    return {
      applicationId: this.applicationId,
      status: this.status,
      certificateIssued: this.certificateIssued,
      certificateComments: this.certificateComments,
      certificateIssueDate: getDateWithoutTime(this.certificateIssueDate),
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

  certificateIssued: YesOrNo.No;
  certificateComments: string;
};

export type NewTbCertificateNotIssuedDetails = Omit<
  ITbCertificateNotIssued,
  "dateCreated" | "status"
>;

export class TbCertificateNotIssued extends TbCertificateBase {
  certificateIssued: YesOrNo.No;
  certificateComments: string;

  constructor(details: ITbCertificateNotIssued) {
    super(details);

    this.certificateIssued = details.certificateIssued;
    this.certificateComments = details.certificateComments;
  }

  toJson() {
    return {
      applicationId: this.applicationId,
      status: this.status,
      certificateIssued: this.certificateIssued,
      certificateComments: this.certificateComments,
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
      tbCertificate.certificateIssued === YesOrNo.Yes
        ? {
            ...tbCertificate,
            dateCreated: tbCertificate.dateCreated.toISOString(),
            certificateIssueDate: tbCertificate.certificateIssueDate.toISOString(),
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
        details.certificateIssued === YesOrNo.Yes
          ? {
              ...details,
              dateCreated: new Date(),
              status: TaskStatus.completed,
              certificateIssueDate: new Date(details.certificateIssueDate),
            }
          : {
              ...details,
              dateCreated: new Date(),
              status: TaskStatus.completed,
            };

      const tbCertificate =
        details.certificateIssued === YesOrNo.Yes
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
        dbItem.certificateIssued === YesOrNo.Yes
          ? new TbCertificateIssued({
              ...dbItem,
              dateCreated: new Date(dbItem.dateCreated),
              certificateIssueDate: new Date(dbItem.certificateIssueDate),
            })
          : new TbCertificateNotIssued({
              ...dbItem,
              dateCreated: new Date(dbItem.dateCreated),
            });

      return dbItem.certificateIssued === YesOrNo.Yes
        ? new TbCertificateIssued(tbCertificate as ITbCertificateIssued)
        : new TbCertificateNotIssued(tbCertificate as ITbCertificateNotIssued);
    } catch (error) {
      logger.error(error, "Error retrieving TB Certificate information");
      throw error;
    }
  }
}
