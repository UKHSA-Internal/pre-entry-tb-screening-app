import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

import awsClients from "../../shared/clients/aws";
import { logger } from "../../shared/logger";
import { Application } from "../../shared/models/application";
import { TaskStatus } from "../../shared/types/enum";
import {
  SputumRequestSchema,
  SputumSampleCompletionCheckSchema,
  SputumSampleUpdateInput,
} from "../types/zod-schema";

const { dynamoDBDocClient: docClient } = awsClients;

export type SputumSample = {
  dateOfSputumSample?: Date | string;
  sputumCollectionMethod?: string;
  smearResult?: string;
  cultureResult?: string;
  dateUpdated?: Date | string;
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
  if (!sample || typeof sample !== "object" || Array.isArray(sample)) return undefined;

  const parsedSample = sample as SputumSample;

  return {
    dateOfSputumSample: parsedSample.dateOfSputumSample
      ? new Date(parsedSample.dateOfSputumSample as string)
      : undefined,
    sputumCollectionMethod: parsedSample.sputumCollectionMethod as string,
    smearResult: parsedSample.smearResult as string,
    cultureResult: parsedSample.cultureResult as string,
    dateUpdated: parsedSample.dateUpdated
      ? new Date(parsedSample.dateUpdated as string)
      : undefined,
  };
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
      // Step 1: Validate
      const parsed = SputumRequestSchema.safeParse(details);
      if (!parsed.success) {
        logger.error("Validation failed", parsed.error.flatten());
        throw new Error("Invalid Sputum Details");
      }
      const updates: SputumSampleUpdateInput = parsed.data;

      const pk = this.getPk(applicationId);
      const sk = this.sk;
      const TableName = this.getTableName();

      const { Item: existingItemRaw } = await docClient.send(
        new GetCommand({ TableName, Key: { pk, sk } }),
      );

      if (!existingItemRaw) throw new Error("Sputum details not found");
      if (!("version" in existingItemRaw)) {
        existingItemRaw.version = 0;
      }
      // Parse existing sample dates
      const samplesRaw = existingItemRaw.sputumSamples as Record<string, unknown> | undefined;

      const existingItem = {
        ...existingItemRaw,
        sputumSamples: {
          sample1: parseSample(samplesRaw?.sample1),
          sample2: parseSample(samplesRaw?.sample2),
          sample3: parseSample(samplesRaw?.sample3),
        },
      };

      // Merge sampleDetails
      const mergedSamples = {
        ...((existingItem.sputumSamples as SputumSamples) || {}),
        ...(updates.sputumSamples || {}),
      };

      // Merge full item
      const merged = {
        ...existingItem,
        ...updates,
        sputumSamples: mergedSamples,
      };

      // Determine if all required fields are complete using Zod
      let shouldSetStatusCompleted = false;
      try {
        SputumSampleCompletionCheckSchema.parse({
          samples: merged.sputumSamples,
        });
        shouldSetStatusCompleted = true;
      } catch {
        shouldSetStatusCompleted = false;
      }
      // Start update

      const updateExpressions: string[] = [];
      const expressionAttributeNames: Record<string, string> = {};
      const expressionAttributeValues: Record<string, any> = {
        ":dateUpdated": new Date().toISOString(),
      };

      let conditionExpression: string | undefined;

      // Sputum Samples
      if (updates.sputumSamples) {
        let idx = 0;
        for (const [sampleKey, sampleData] of Object.entries(updates.sputumSamples)) {
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
      if (updates.version !== undefined) {
        conditionExpression = "version = :expectedVersion";
        expressionAttributeValues[":expectedVersion"] = updates.version;
        updateExpressions.push("version = :newVersion");
        expressionAttributeValues[":newVersion"] = updates.version + 1;
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
      const samples = Attributes.sputumSamples as Record<string, unknown> | undefined;

      const updatedSputumDetails = new SputumDetails({
        applicationId,
        status: Attributes.status as TaskStatus,
        createdBy: Attributes.createdBy as string,
        dateCreated: new Date(Attributes.dateCreated as string),
        sputumSamples: {
          sample1: parseSample(samples?.sample1),
          sample2: parseSample(samples?.sample2),
          sample3: parseSample(samples?.sample3),
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
      const samplesRetreived = sputumRecord.sputumSamples as Record<string, unknown> | undefined;

      const sputumDetails = new SputumDetails({
        applicationId,
        status: sputumRecord.status as TaskStatus,
        createdBy: sputumRecord.createdBy as string,
        dateCreated: new Date(sputumRecord.dateCreated as string),
        sputumSamples: {
          sample1: parseSample(samplesRetreived?.sample1),
          sample2: parseSample(samplesRetreived?.sample2),
          sample3: parseSample(samplesRetreived?.sample3),
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
