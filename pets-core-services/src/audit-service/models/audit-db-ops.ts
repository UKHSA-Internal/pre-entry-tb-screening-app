import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
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
  // pk nad sk values have to be created dynamically based on the record data
  static readonly getTableName = () => process.env.AUDIT_SERVICE_DATABASE_NAME;

  static todbItem(audit: AuditBase, pk: string, sk: string) {
    const dbItem = {
      ...audit,
      dateUpdated: audit.dateUpdated.toISOString(),
      pk: pk,
      sk: sk,
    };
    return dbItem;
  }

  static async createNewAuditFromDBRecord(record: DynamoDBRecord): Promise<AuditBase | undefined> {
    try {
      if (!record?.dynamodb?.NewImage || !record?.eventSourceARN) {
        logger.info({ record }, "There was no newImage object in the record");

        return;
      }

      const newImage = record.dynamodb.NewImage;
      const changeDetails = unmarshall(newImage as AttributeValue | Record<string, AttributeValue>);
      logger.info({ changeDetails }, "unmarshalled 'newImage'");

      // Getting table name from eventSourceARN string
      const myRe = /:table\/(\w+-\w+)\//g;
      const table = myRe.exec(record.eventSourceARN);

      if (!table?.length || table.length < 2) {
        logger.error(`Could not get table name from regex: ${JSON.stringify(table)}`);

        return;
      }
      const tableName = table[1];

      // Getting email from updatedBy or createdBy field
      const email = changeDetails?.updatedBy
        ? (changeDetails.updatedBy as string)
        : (changeDetails?.createdBy as string);

      if (!email) {
        logger.error("Missing email (updatedBy or createdBy field)");

        return;
      }

      // TODO: where to get it from (record.source ???);
      const source = undefined;

      const updatedDetails: Audit = {
        applicationId: changeDetails?.applicationId as string,
        // User Email or AWS user for console updates
        updatedBy: email,
        eventType: record.eventName,
        // Application (App/API) - Application, API (for IOM) or Console
        source: source ? (source as SourceType) : SourceType.app,
        // applicant-details / application-details
        sourceTable: tableName,
        // TODO: should unmarshalled version of newImage be used here?
        changeDetails: newImage ? JSON.stringify(newImage) : "",
        dateUpdated: new Date(),
      };

      const newAudit = new Audit(updatedDetails);
      const sk = changeDetails.sk as string;
      const dbItem = this.todbItem(
        newAudit,
        `AUDIT#${new Date().valueOf()}`,
        `${changeDetails.pk}${sk.slice(sk.indexOf("#"))}`,
      );

      logger.info({ dbItem }, "Saving data to DB");
      const params: PutCommandInput = {
        TableName: this.getTableName(),
        Item: { ...dbItem },
        // Check to ensure the pk is truly a unique value
        ConditionExpression: "attribute_not_exists(pk) AND attribute_not_exists(sk)",
      };
      const command = new PutCommand(params);
      await docClient.send(command);

      logger.info("New audit created successfully");

      return newAudit as AuditBase;
    } catch (error) {
      logger.error({ error }, "Creating audit failed");
      throw error;
    }
  }
}
