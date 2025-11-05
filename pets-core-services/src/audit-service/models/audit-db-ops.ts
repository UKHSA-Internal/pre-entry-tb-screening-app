import { PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";
// import { unmarshall } from "@aws-sdk/util-dynamodb";
import { DynamoDBRecord } from "aws-lambda";

import awsClients from "../../shared/clients/aws";
import { logger } from "../../shared/logger";
import { SourceType } from "../types/enums";

const { dynamoDBDocClient: docClient } = awsClients;
export type EventType = "INSERT" | "MODIFY" | "REMOVE" | undefined;

export abstract class AuditBase {
  applicationId: string;
  dateUpdated: Date;
  updatedBy: string;
  eventType: EventType;
  source: SourceType;
  sourceTable: string;
  changeDetails: string;

  constructor(details: AuditBase) {
    this.applicationId = details.applicationId;
    this.dateUpdated = details.dateUpdated;
    this.updatedBy = details.updatedBy;
    this.eventType = details.eventType;
    this.source = details.source;
    this.sourceTable = details.sourceTable;
    this.changeDetails = details.changeDetails;
  }
}
export type NewAudit = Omit<AuditBase, "dateUpdated"> & { dateUpdated: Date | string };

// Accepts dateUpdated as date and string, converting to date type
export class Audit extends AuditBase {
  constructor(details: NewAudit) {
    super({ ...details, dateUpdated: new Date(details.dateUpdated) });
    // this.dateUpdated = new Date(details.dateUpdated);
  }
}

export class AuditDbOps {
  static readonly getPk = (applicationId: string) => `AUDIT#${applicationId}`;
  static readonly sk = "AUDIT#DETAILS";
  static readonly getTableName = () => process.env.AUDIT_SERVICE_DATABASE_NAME;

  static todbItem(audit: AuditBase) {
    const dbItem = {
      ...audit,
      dateUpdated: audit.dateUpdated.toISOString(),
      pk: this.getPk(audit.applicationId),
      sk: this.sk,
    };
    return dbItem;
  }

  static async createNewAuditFromDBRecord(record: DynamoDBRecord): Promise<AuditBase | undefined> {
    try {
      logger.info("Started saving new Audit to DB");

      if (record?.dynamodb?.NewImage && record?.eventSourceARN) {
        const newImage = record.dynamodb.NewImage;
        // const changeDetails = unmarshall(newImage);

        const table = record.eventSourceARN.match(/:table\/(\w+-\w+)\//gm);
        logger.info(`table = ${JSON.stringify(table)}`);

        const source = undefined; // record?.source;
        const email = record?.dynamodb?.NewImage?.updatedBy
          ? record.dynamodb.NewImage.updatedBy
          : record?.dynamodb?.NewImage?.createdBy;

        logger.info(`email = ${email}`);

        // TODO: Where to get those values from and are they mandatory fields?
        if (!table || !email) {
          logger.info("Missing data (table, source, email)");

          return;
        }

        const updatedDetails: Audit = {
          applicationId: newImage?.applicationId?.S as string,
          // User Email or AWS user for console updates
          updatedBy: email as string,
          eventType: record.eventName,
          // Application (App/API) - Application, API (for IOM) or Console
          source: source ? (source as SourceType) : SourceType.app,
          // applicant-details / application-details
          sourceTable: table[1],
          changeDetails: newImage ? JSON.stringify(newImage) : "",
          dateUpdated: new Date(),
        };
        logger.info("Creating <Audit> object.");
        const newAudit = new Audit(updatedDetails);
        logger.info({ updatedDetails }, "<Audit> object created");
        const dbItem = this.todbItem(newAudit);
        logger.info({ dbItem }, "Creted dbItem");

        const params: PutCommandInput = {
          TableName: this.getTableName(),
          Item: { ...dbItem },
          // Check to ensure the pk is truly a unique value
          ConditionExpression: "attribute_not_exists(pk) AND attribute_not_exists(sk)",
        };
        const command = new PutCommand(params);
        await docClient.send(command);
        logger.info("dbItem saved in DB");

        logger.info("New audit created successfully");

        return newAudit as AuditBase;
      } else {
        logger.info({ record }, "There was no newImage object in the record");

        return;
      }
    } catch (error) {
      logger.error({ error }, "Error creating audit");
      throw error;
    }
  }
}
