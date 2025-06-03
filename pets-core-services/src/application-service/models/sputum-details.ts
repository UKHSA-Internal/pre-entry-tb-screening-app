import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

import awsClients from "../../shared/clients/aws";
import { logger } from "../../shared/logger";
import { Application } from "../../shared/models/application";
import { TaskStatus } from "../../shared/types/enum";
import { PositiveOrNegative, SputumCollectionMethod } from "../types/enums";
import { SputumSampleCompletionCheckSchema, SputumSampleUpdateInput } from "../types/zod-schema";

const { dynamoDBDocClient: docClient } = awsClients;

export type SputumSample = {
  dateOfSample: Date | string;
  collectionMethod: SputumCollectionMethod;
  smearResult?: PositiveOrNegative;
  cultureResult?: PositiveOrNegative;
  dateUpdated: Date | string;
};

export type SputumSamples = {
  sample1?: SputumSample;
  sample2?: SputumSample;
  sample3?: SputumSample;
};

export interface ISputumDetails {
  applicationId: string;
  status: TaskStatus;
  dateCreated: Date;
  createdBy: string;
  sputumSamples: SputumSamples;
  version?: number;
}
abstract class SputumDetailsBase {
  applicationId: string;
  status: TaskStatus;

  dateCreated: Date;
  createdBy: string;

  constructor(details: SputumDetailsBase) {
    this.applicationId = details.applicationId;
    this.status = details.status;

    // Audit
    this.dateCreated = details.dateCreated;
    this.createdBy = details.createdBy;
  }
}

export class SputumDetails extends SputumDetailsBase {
  sputumSamples: SputumSamples;
  version?: number;

  constructor(details: ISputumDetails) {
    super(details);
    this.sputumSamples = details.sputumSamples;
    this.version = details.version;
  }

  toJson() {
    return {
      applicationId: this.applicationId,
      status: this.status,
      sputumSamples: this.sputumSamples,
      dateCreated: this.dateCreated.toISOString(),
      createdBy: this.createdBy,
      version: this.version,
    };
  }
}
// --- Helper to safely parse sample fields ---

const parseSample = (sample: any): SputumSample | undefined => {
  if (!sample || typeof sample !== "object" || Array.isArray(sample)) {
    throw new Error("Invalid sample object");
  }

  const parsedSample = sample as SputumSample;

  const { dateOfSample, collectionMethod, dateUpdated } = parsedSample;

  if (!dateOfSample || !collectionMethod || !dateUpdated) {
    throw new Error(
      "Missing required fields in sputum sample: dateOfSample, collectionMethod, or dateUpdated",
    );
  }

  return {
    dateOfSample: new Date(parsedSample.dateOfSample),
    collectionMethod: parsedSample.collectionMethod,
    smearResult: parsedSample.smearResult as PositiveOrNegative,
    cultureResult: parsedSample.cultureResult as PositiveOrNegative,
    dateUpdated: new Date(parsedSample.dateUpdated),
  };
};

const mergeSamples = (
  existing?: Partial<SputumSample>,
  updates?: Partial<SputumSample>,
): SputumSample | undefined => {
  const merged = { ...existing, ...updates };

  if (merged.dateOfSample && merged.dateUpdated && merged.collectionMethod) {
    return merged as SputumSample;
  }

  return undefined;
};

export class SputumDetailsDbOps {
  static readonly getPk = (applicationId: string) => Application.getPk(applicationId);
  static readonly sk = "APPLICATION#SPUTUM#DETAILS";
  static readonly getTableName = () => process.env.APPLICATION_SERVICE_DATABASE_NAME;

  static async createOrUpdateSputumDetails(
    applicationId: string,
    details: Omit<ISputumDetails, "dateCreated" | "status">,
  ): Promise<SputumDetails> {
    try {
      logger.info("Saving Sputum Details Information to DB");
      const newSputumDetails: SputumSampleUpdateInput = details;

      const pk = this.getPk(applicationId);
      const sk = this.sk;
      const TableName = this.getTableName();

      const { Item: existingItemRaw } = await docClient.send(
        new GetCommand({ TableName, Key: { pk, sk } }),
      );
      let existingSputumDetails = undefined;

      if (!existingItemRaw) {
        logger.info("Sputum details not found in database");
      } else {
        // Parse existing sputum samples
        const samplesRaw = existingItemRaw.sputumSamples as SputumSamples;

        existingSputumDetails = {
          ...(existingItemRaw as SputumSample),
          sputumSamples: {
            sample1: samplesRaw?.sample1 != null ? parseSample(samplesRaw?.sample1) : undefined,
            sample2: samplesRaw?.sample2 != null ? parseSample(samplesRaw?.sample2) : undefined,
            sample3: samplesRaw?.sample3 != null ? parseSample(samplesRaw?.sample3) : undefined,
          },
        };
      }

      // Merge sampleDetails
      const mergedSamples: SputumSamples = {
        sample1: mergeSamples(
          existingSputumDetails?.sputumSamples?.sample1,
          newSputumDetails.sputumSamples?.sample1,
        ),
        sample2: mergeSamples(
          existingSputumDetails?.sputumSamples?.sample2,
          newSputumDetails.sputumSamples?.sample2,
        ),
        sample3: mergeSamples(
          existingSputumDetails?.sputumSamples?.sample3,
          newSputumDetails.sputumSamples?.sample3,
        ),
      };

      // Merge full item
      const merged = {
        ...existingSputumDetails,
        ...newSputumDetails,
        sputumSamples: mergedSamples,
      };

      // Determine if all required fields are complete using Zod

      const completionCheck = SputumSampleCompletionCheckSchema.safeParse({
        samples: merged.sputumSamples,
      });

      const shouldSetStatusCompleted = completionCheck.success;

      if (!shouldSetStatusCompleted) {
        logger.info("Sputum sample completion check failed", completionCheck.error.flatten());
      }

      // Start update

      const updateExpressions: string[] = [];
      const expressionAttributeNames: Record<string, string> = {};
      const expressionAttributeValues: Record<string, any> = {
        ":dateUpdated": new Date().toISOString(),
      };

      let conditionExpression: string | undefined;

      // Sputum Samples
      if (newSputumDetails.sputumSamples) {
        let idx = 0;
        for (const [sampleKey, sampleData] of Object.entries(newSputumDetails.sputumSamples)) {
          if (!sampleData) continue;
          for (const [fieldKey, value] of Object.entries(sampleData)) {
            const sampleAttr = `#s${idx}`;
            const fieldAttr = `#f${idx}`;
            const valueAttr = `:v${idx}`;

            updateExpressions.push(`sputumSamples.${sampleAttr}.${fieldAttr} = ${valueAttr}`);
            expressionAttributeNames[sampleAttr] = sampleKey;
            expressionAttributeNames[fieldAttr] = fieldKey;
            expressionAttributeValues[valueAttr] = value;
            idx++;
          }
        }
      }

      // Optimistic concurrency control
      if (newSputumDetails.version !== undefined) {
        conditionExpression = "version = :expectedVersion";
        expressionAttributeValues[":expectedVersion"] = newSputumDetails.version;
        updateExpressions.push("version = :newVersion");
        expressionAttributeValues[":newVersion"] = newSputumDetails.version + 1;
      }

      // Final conditional status update
      if (shouldSetStatusCompleted) {
        updateExpressions.push("#status = :status");
        expressionAttributeNames["#status"] = "status";
        expressionAttributeValues[":status"] = TaskStatus.completed;
      }

      updateExpressions.push("dateUpdated = :dateUpdated");

      const UpdateExpression = "SET " + updateExpressions.join(", ");

      const updateCommand = new UpdateCommand({
        TableName,
        Key: { pk, sk },
        UpdateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ...(conditionExpression ? { ConditionExpression: conditionExpression } : {}),
        ReturnValues: "ALL_NEW",
      });

      const { Attributes } = await docClient.send(updateCommand);
      if (!Attributes) throw new Error("Update failed");

      logger.info(`Created/Updated sputum sample details for ${applicationId}`);
      const samples = Attributes.sputumSamples as SputumSamples | undefined;

      const updatedSputumDetails = new SputumDetails({
        applicationId,
        status: Attributes.status as TaskStatus,
        createdBy: Attributes.createdBy as string,
        dateCreated: new Date(Attributes.dateCreated as string),
        sputumSamples: {
          sample1: samples?.sample1,
          sample2: samples?.sample2,
          sample3: samples?.sample3,
        },
        version: Attributes.version as number,
      });

      return updatedSputumDetails;
    } catch (error) {
      logger.error("Update failed", error);
      throw error;
    }
  }

  static async getByApplicationId(applicationId: string) {
    try {
      logger.info("fetching Sputum Details");

      const params = {
        TableName: SputumDetailsDbOps.getTableName(),
        Key: {
          pk: SputumDetailsDbOps.getPk(applicationId),
          sk: SputumDetailsDbOps.sk,
        },
      };

      const command = new GetCommand(params);
      const data = await docClient.send(command);
      const sputumRecord = data.Item;

      if (!sputumRecord) {
        logger.info("No Sputum Details found");
        return;
      }

      logger.info("Sputum Details fetched successfully");
      const samplesRetreived = sputumRecord.sputumSamples as SputumSamples | undefined;

      const sputumDetails = new SputumDetails({
        applicationId,
        status: sputumRecord.status as TaskStatus,
        createdBy: sputumRecord.createdBy as string,
        dateCreated: new Date(sputumRecord.dateCreated as string),
        sputumSamples: {
          sample1:
            samplesRetreived?.sample1 != null ? parseSample(samplesRetreived.sample1) : undefined,
          sample2:
            samplesRetreived?.sample2 != null ? parseSample(samplesRetreived.sample2) : undefined,
          sample3:
            samplesRetreived?.sample3 != null ? parseSample(samplesRetreived.sample3) : undefined,
        },
        version: sputumRecord.version as number,
      });
      return sputumDetails;
    } catch (error) {
      logger.error(error, "Error retrieving Sputum Details");
      throw error;
    }
  }
}
