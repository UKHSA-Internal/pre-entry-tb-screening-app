import { AttributeValue } from "@aws-sdk/client-dynamodb";
import {
  _Object,
  GetObjectCommand,
  NoSuchKey,
  paginateListObjectsV2,
  S3Client,
  S3ServiceException,
} from "@aws-sdk/client-s3";
import { PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { DynamoDBRecord } from "aws-lambda";
import * as zlib from "zlib";

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
    logger.info(`Processing record: ${JSON.stringify(record)}`);

    try {
      if (!record?.dynamodb?.NewImage || !record?.eventSourceARN) {
        logger.info({ record }, "There was no newImage object in the record");

        return;
      }

      const newImage = record.dynamodb?.NewImage;
      const oldImage = record.dynamodb?.OldImage;
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

      if (!email) logger.info("Missing email (updatedBy or createdBy field)");

      let source = SourceType.app;
      source = await getCloudTrailLogs();

      if (source && source === SourceType.api) {
        source = SourceType.api;
      }
      logger.info(`Returned event source: ${source}`);

      const updatedDetails: Audit = {
        applicationId: changeDetails?.applicationId as string,
        // User Email or AWS user for console updates
        updatedBy: email ?? "",
        eventType: record.eventName,
        // Application (App/API) - Application, API (for IOM) or Console
        source: source ? source : SourceType.app,
        // applicant-details / application-details
        sourceTable: tableName,
        changeDetails: oldImage
          ? JSON.stringify({ NewImage: newImage, OldImage: oldImage })
          : JSON.stringify({ NewImage: newImage }),
        dateUpdated: new Date(),
      };

      const newAudit = new Audit(updatedDetails);
      const sk = changeDetails.sk as string;
      const dbItem = this.todbItem(
        newAudit,
        `AUDIT#${Date.now()}`,
        `${changeDetails.pk}${sk.slice(sk.indexOf("#"))}`,
      );

      const params: PutCommandInput = {
        TableName: this.getTableName(),
        Item: { ...dbItem },
        // Check to ensure the pk is truly a unique value
        ConditionExpression: "attribute_not_exists(pk) AND attribute_not_exists(sk)",
      };
      const command = new PutCommand(params);

      logger.info({ dbItem }, "Saving data to DB");
      await docClient.send(command);
      logger.info("New audit created successfully");

      return newAudit as AuditBase;
    } catch (error) {
      logger.error({ error }, "Creating audit failed");
      throw error;
    }
  }
}

const getCloudTrailLogs = async (): Promise<SourceType> => {
  logger.info("Getting CloudTrail logs from S3");
  const client = awsClients.s3Client;
  // const bucketName = process.env.S3_AUDIT_LOGS_BUCKET;
  const bucketName = "audit-logs-aw-pets-euw-dev-s3-managementevents";
  const pageSize = "50";
  const source = SourceType.app;
  const accountId = process.env.AWS_ACCOUNT_ID;
  const region = process.env.AWS_REGION;
  const dateStr = new Date(Date.now()).toISOString();

  try {
    const paginator = paginateListObjectsV2(
      { client, pageSize: Number.parseInt(pageSize) },
      {
        Bucket: bucketName,
        Prefix: `AWSLogs/${accountId}/CloudTrail/${region}/${dateStr.slice(0, 4)}/${dateStr.slice(5, 7)}/${dateStr.slice(8, 10)}/`,
      },
    );

    let theNewest: _Object | undefined = undefined;

    for await (const page of paginator) {
      if (page?.Contents) {
        if (theNewest === undefined) {
          theNewest = page?.Contents[0];
        }
        for (const obj of page.Contents) {
          if (
            obj?.LastModified &&
            theNewest?.LastModified &&
            obj.LastModified > theNewest.LastModified
          ) {
            theNewest = obj;
          }
        }
      } else {
        break;
      }
    }
    if (theNewest !== undefined) {
      logger.info(`The newest element: ${JSON.stringify(theNewest)}`);
    }

    const cloudTrailLog = await getFileFromS3(client, theNewest?.Key as string);

    if (cloudTrailLog) {
      // TODO: return proper value based on logs content
      return source;
    }

    return source;
  } catch (caught) {
    if (caught instanceof S3ServiceException && caught.name === "NoSuchBucket") {
      logger.error(
        `Error from S3 while listing objects for "${bucketName}". The bucket doesn't exist.`,
      );
    } else if (caught instanceof S3ServiceException) {
      logger.error(
        `Error from S3 while listing objects for "${bucketName}".  ${caught.name}: ${caught.message}`,
      );
    } else {
      throw caught;
    }
  }
  logger.info(`Returning 'source' as: ${source}`);

  return source;
};

const getFileFromS3 = async (
  client: S3Client,
  key: string = "",
): Promise<string | undefined | void> => {
  // const bucketName = process.env.S3_AUDIT_LOGS_BUCKET;
  const bucketName = "audit-logs-aw-pets-euw-dev-s3-managementevents";

  if (!key) {
    logger.info("No file was found in S3 logs");

    return;
  }

  try {
    const response = await client.send(
      new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
      }),
    );
    const zipBody = await streamToBuffer(response.Body);
    const jsonString = zlib.gunzipSync(zipBody).toString("utf-8");
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const cloudTrail = JSON.parse(jsonString);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const records: Array<Record<string, string>> = cloudTrail?.Records;
    let count = 0;

    if (!records) return;

    // Loop through CloudTrail event records
    for (const eventRecord of records) {
      if (eventRecord.eventSource === "dynamodb.amazonaws.com") {
        logger.info(eventRecord, "log record");
        count += 1;
      }
    }

    logger.info(`End of log records (${count})`);

    // TODO: return appropriate detail
    return SourceType.app;
  } catch (caught) {
    if (caught instanceof NoSuchKey) {
      logger.error(
        `Error from S3 while getting object "${key}" from "${bucketName}". No such key exists.`,
      );
    } else if (caught instanceof S3ServiceException) {
      logger.error(
        `Error from S3 while getting object from ${bucketName}.  ${caught.name}: ${caught.message}`,
      );
    } else {
      throw caught;
    }
  }
};

// Helper: stream → buffer
async function streamToBuffer(stream: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    stream.on("data", (chunk: Buffer) => chunks.push(chunk));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    stream.on("error", reject);
  });
}
