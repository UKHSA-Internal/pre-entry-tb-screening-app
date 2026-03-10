import { AttributeValue } from "@aws-sdk/client-dynamodb";
import {
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

export type EventType = "INSERT" | "MODIFY" | "REMOVE" | undefined;

const { dynamoDBDocClient: docClient } = awsClients;
const s3client = awsClients.s3Client;
// const bucketName = process.env.S3_AUDIT_LOGS_BUCKET;
const accountId = process.env.AWS_ACCOUNT_ID;
const region = process.env.AWS_REGION;

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
      if (
        !record?.dynamodb?.NewImage ||
        !record?.eventSourceARN ||
        !record.dynamodb?.ApproximateCreationDateTime
      ) {
        logger.info(
          { record },
          "There are some important attributes (NewImage/eventSourceARN/ApproximateCreationDateTime) missing in the record",
        );

        return;
      }

      const newImage = record.dynamodb?.NewImage;
      const oldImage = record.dynamodb?.OldImage;
      const approximateCreationDateTime = record.dynamodb.ApproximateCreationDateTime;
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
      if (approximateCreationDateTime) {
        source = await findSourceInCTLogs(record);
        logger.info(`The 'source' returned from findSourceInCTLogs(): ${source}`);
      }

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

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const findSourceInCTLogs = async (record: DynamoDBRecord): Promise<SourceType> => {
  logger.info("Getting CloudTrail logs from S3");

  const approximateCreationDateTime = record.dynamodb!.ApproximateCreationDateTime as number;
  let source: SourceType | undefined = undefined;
  const alreadyScanned: Array<string> = [];
  const delay = 5 * 1000; // 5 second
  const maxTimeAwaiting = 10 * 60 * 1000; // 10 minutes in milliseconds
  const startTime = Date.now();

  while (!source) {
    source = await scanFiles(new Date(approximateCreationDateTime * 1000), alreadyScanned, record);
    // to avoid delay, check for 'source' now
    if (source || Date.now() - startTime > maxTimeAwaiting) break;
    await sleep(delay);
  }

  // source = await scanFiles(new Date(approximateCreationDateTime * 1000), alreadyScanned, record);

  // if (!source) {
  //   await new Promise((resolve) => {
  //     const checkInterval = setInterval(() => {
  //       scanFiles(new Date(approximateCreationDateTime * 1000), alreadyScanned, record)
  //         .then((result) => {
  //           source = result;
  //           if (source || Date.now() - startTime >= maxTimeAwaiting) {
  //             clearInterval(checkInterval);
  //             resolve(undefined);
  //           }
  //         })
  //         .catch((error) => {
  //           logger.error({ error }, "Error scanning CloudTrail files");
  //         });
  //     }, delay);
  //   });
  // }

  logger.info(`Returning 'source': ${source ?? ""}`);

  return source ? source : SourceType.app;
};

const scanFiles = async (
  approximateCreationDateTime: Date,
  alreadyScanned: Array<string>,
  record: DynamoDBRecord,
): Promise<SourceType | undefined> => {
  logger.info("Scanning log files");
  // TODO: Get the bucket name from env vars
  const bucketName = "audit-logs-aw-pets-euw-dev-s3-managementevents";
  const pageSize = "50";
  const dateStr = new Date(Date.now()).toISOString();
  const id = record.eventID;
  const timeStarted = Date.now();
  let source: SourceType | undefined = undefined;
  let readFiles = 0;
  let scannedFiles = 0;
  let ignoredFiles = 0;

  try {
    const paginator = paginateListObjectsV2(
      { client: s3client, pageSize: Number.parseInt(pageSize) },
      {
        Bucket: bucketName,
        Prefix: `AWSLogs/${accountId}/CloudTrail/${region}/${dateStr.slice(0, 4)}/${dateStr.slice(5, 7)}/${dateStr.slice(8, 10)}/`,
        StartAfter:
          alreadyScanned.length > 0 ? alreadyScanned[alreadyScanned.length - 1] : undefined,
      },
    );

    logger.info(`---------- (${id}) reading files started ----------`);
    for await (const page of paginator) {
      if (page?.Contents) {
        for (const obj of page.Contents) {
          readFiles += 1;
          if (
            obj.Key &&
            obj?.LastModified &&
            obj.LastModified >= approximateCreationDateTime &&
            !alreadyScanned.includes(obj.Key)
          ) {
            const cloudTrailLog = await getFileFromS3(s3client, obj.Key);

            if (cloudTrailLog && cloudTrailLog["0"]) {
              if (cloudTrailLog["0"]) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                const logRecord: Record<string, unknown> = cloudTrailLog["0"];
                // If the logs category is not 'Data', then probably all the messages in this file
                if (logRecord?.eventCategory && logRecord.eventCategory !== "Data") {
                  ignoredFiles += 1;
                  continue;
                }
              } else {
                logger.info({ cloudTrailLog });
              }

              source = analyseLogs(cloudTrailLog, record);
              scannedFiles += 1;

              if (source) return source;
            }
            alreadyScanned.push(obj.Key);
          }
        }
        // logger.info(`Read ${pageSize} files`);
      } else {
        break;
      }
    }
    logger.info(`---------- (${id}) finished reading files  ----------`);
    logger.info(`All files: ${readFiles}, scanned: ${scannedFiles}, ignored: ${ignoredFiles}`);
    logger.info(`It was running for: ${(Date.now() - timeStarted) / 1000} seconds`);

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
};

const analyseLogs = (
  cloudTrailLog: Record<string, any>,
  record: DynamoDBRecord,
): SourceType | undefined => {
  // logger.info("Analysing logs");

  // Again check to prevent some linter issues, but the values should be present (checked in previous function)
  if (
    !record?.dynamodb?.NewImage ||
    !record?.eventSourceARN ||
    !record.dynamodb?.ApproximateCreationDateTime
  ) {
    logger.info({ record }, "The record missing some important attributes");

    return;
  }

  const source: SourceType | undefined = undefined;
  // Extract just the table name from ARN
  const tableArn = record.eventSourceARN;
  const tableName = tableArn.split("/")[1];
  const approximateCreationDateTime = record.dynamodb.ApproximateCreationDateTime;
  const changeDetails = unmarshall(
    record.dynamodb.NewImage as AttributeValue | Record<string, AttributeValue>,
  );
  const appIdentities = [
    "applicant-service-lambda",
    "application-service-lambda",
    "clinic-service-lambda",
    "qa-service-lambda",
  ];

  for (const logObject of Object.values(cloudTrailLog)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const logRecord: Record<string, any> = logObject;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const userIdentity = logRecord?.userIdentity;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const principalId = (userIdentity as Record<string, any>)?.principalId;
    let userIdParts: Array<string> = [];

    if (principalId) {
      userIdParts = (principalId as string).split(":");
    }
    const user = userIdParts.length >= 2 ? userIdParts[1] : "";
    const creationDateTimeString = `${new Date(approximateCreationDateTime * 1000).toISOString().substring(0, 19)}Z`;
    let tableNameReqParams = "";
    let pk = "";
    let sk = "";

    if (logRecord?.requestParameters) {
      const requestParameters: Record<string, any> = logRecord.requestParameters as Record<
        string,
        any
      >;
      tableNameReqParams = requestParameters?.tableName as string;
      const key = requestParameters?.key as Record<string, string>;
      pk = key?.pk;
      sk = key?.sk;
    } else {
      // If no requestParameters, then return from the function, as the details can't be found
      return source;
    }

    if (
      logRecord.eventSource === "dynamodb.amazonaws.com" &&
      logRecord?.eventCategory === "Data" &&
      tableNameReqParams === tableName
    ) {
      if (pk === changeDetails?.pk && sk === changeDetails?.sk) {
        if (logRecord?.eventTime === creationDateTimeString) {
          // eventRecord.eventType is always AwsApiCall for data changes triggered by app and console.
          if (user && appIdentities.includes(user)) return SourceType.app;
          if (user && user.endsWith("ukhsa.gok.uk")) return SourceType.console;
        } else {
          // If all the above conditions are true, but only time is not right,
          // log both date time values (the one from audit service event, and the one from logs)
          logger.info(
            `Time difference: enventTime = ${logRecord?.eventTime}, approximateCreationDateTime = ${creationDateTimeString}`,
          );
        }
      }
    }
  }

  if (source) {
    logger.info(`'source' ==> ${source as string}`);
  }

  return source;
};

const getFileFromS3 = async (
  client: S3Client,
  key: string = "",
): Promise<Record<string, any> | undefined | void> => {
  // logger.info(`Getting log file: ${key}`);
  // TODO: Get bucket name from env vars
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
    const records: Array<Record<string, any>> = cloudTrail?.Records;

    return records;
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
