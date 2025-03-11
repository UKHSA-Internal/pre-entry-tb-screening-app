import { GetCommand, PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";

import awsClients from "../../shared/clients/aws";
import { getDateWithoutTime } from "../../shared/date";
import { logger } from "../../shared/logger";
import { Application } from "../../shared/models/application";
import { TaskStatus } from "../../shared/types/enum";
import { YesOrNo } from "../types/enums";

const { dynamoDBDocClient: docClient } = awsClients;

export abstract class ITbCertificate {
  applicationId: string;
  status: TaskStatus;

  certificateIssued: YesOrNo;
  certificateComments: string;
  certificateIssueDate: Date;
  certificateNumber: string;

  dateCreated: Date;
  createdBy: string;

  constructor(details: ITbCertificate) {
    this.applicationId = details.applicationId;
    this.certificateIssued = details.certificateIssued;
    this.certificateComments = details.certificateComments;
    this.certificateIssueDate = details.certificateIssueDate;
    this.certificateNumber = details.certificateNumber;
    this.status = details.status;

    // Audit
    this.dateCreated = details.dateCreated;
    this.createdBy = details.createdBy;
  }
}

export type NewTbCertificateDetails = Omit<
  ITbCertificate,
  "dateCreated" | "certificateIssueDate" | "status"
> & {
  certificateIssueDate: Date | string;
};

export class TbCertificate extends ITbCertificate {
  static readonly getPk = (applicationId: string) => Application.getPk(applicationId);

  static readonly sk = "APPLICATION#TB#CERTIFICATE";

  static readonly getTableName = () => process.env.APPLICATION_SERVICE_DATABASE_NAME;

  private constructor(details: ITbCertificate) {
    super(details);
  }

  private todbItem() {
    const dbItem = {
      ...this,
      dateCreated: this.dateCreated.toISOString(),
      certificateIssueDate: this.certificateIssueDate.toISOString(),
      pk: TbCertificate.getPk(this.applicationId),
      sk: TbCertificate.sk,
    };
    return dbItem;
  }

  static async createTbCertificate(details: NewTbCertificateDetails) {
    try {
      logger.info("Saving TB Certificate information to DB");

      const updatedDetails: ITbCertificate = {
        ...details,
        dateCreated: new Date(),
        status: TaskStatus.completed,
        certificateIssueDate: new Date(details.certificateIssueDate),
      };

      const tbCertificate = new TbCertificate(updatedDetails);

      const dbItem = tbCertificate.todbItem();
      const params: PutCommandInput = {
        TableName: TbCertificate.getTableName(),
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
        TableName: TbCertificate.getTableName(),
        Key: {
          pk: TbCertificate.getPk(applicationId),
          sk: TbCertificate.sk,
        },
      };

      const command = new GetCommand(params);
      const data = await docClient.send(command);

      if (!data.Item) {
        logger.info("No TB Certificate info found");
        return;
      }

      logger.info("TB Certificate information fetched successfully");

      const dbItem = data.Item as ReturnType<TbCertificate["todbItem"]>;

      const tbCertificate = new TbCertificate({
        ...dbItem,
        dateCreated: new Date(dbItem.dateCreated),
        certificateIssueDate: new Date(dbItem.certificateIssueDate),
      });
      return tbCertificate;
    } catch (error) {
      logger.error(error, "Error retrieving TB Certificate information");
      throw error;
    }
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
