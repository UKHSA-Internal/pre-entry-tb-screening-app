import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

import awsClients from "../../shared/clients/aws";
import { logger } from "../../shared/logger";
import { Application } from "../../shared/models/application";
import { TaskStatus } from "../../shared/types/enum";
import {
  CompletionCheckSchema,
  SputumRequestSchema,
  SputumSampleUpdateInput,
} from "../types/zod-schema";

const { dynamoDBDocClient: docClient } = awsClients;

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

type SputumSample = {
  dateSputumSample: Date;
  sputumCollectionMethod: string;
  smearResult?: string;
  cultureResult?: string;
};

type SputumSamples = {
  sample1?: SputumSample;
  sample2?: SputumSample;
  sample3?: SputumSample;
};

type ISputumDetails = {
  applicationId: string;
  status: TaskStatus;
  dateCreated: Date;
  createdBy: string;

  sampleDetails: SputumSamples;
  dstConducted: boolean;
  dstSputumSample: string;
  drugTested: string;
  drugResistance: string;
  drugResistanceDetails: string;
};

export class SputumDetails extends SputumDetailsBase {
  sampleDetails: SputumSamples;
  dstConducted: boolean;
  dstSputumSample: string;
  drugTested: string;
  drugResistance: string;
  drugResistanceDetails: string;

  constructor(details: ISputumDetails) {
    super(details);
    this.dstConducted = details.dstConducted;
    this.sampleDetails = details.sampleDetails;
    this.dstSputumSample = details.dstSputumSample;
    this.drugTested = details.drugTested;
    this.drugResistance = details.drugResistance;
    this.drugResistanceDetails = details.drugResistanceDetails;
  }

  toJson() {
    return {
      applicationId: this.applicationId,
      status: this.status,
      sampleDetails: this.sampleDetails,
      dstSputumSample: this.dstSputumSample,
      drugTested: this.drugTested,
      drugResistance: this.drugResistance,
      drugResistanceDetails: this.drugResistanceDetails,
      dateCreated: this.dateCreated,
      createdBy: this.createdBy,
    };
  }
}

export class SputumDetailsDbOps {
  static readonly getPk = (applicationId: string) => Application.getPk(applicationId);
  static readonly sk = "APPLICATION#SPUTUM#DETAILS";
  static readonly getTableName = () => process.env.APPLICATION_SERVICE_DATABASE_NAME;

  static async createOrUpdateSputumDetails(applicationId: string, details: SputumDetails) {
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

      const { Item: existingItem } = await docClient.send(
        new GetCommand({ TableName, Key: { pk, sk } }),
      );

      if (!existingItem) throw new Error("Item not found");
      // Merge sampleDetails
      const mergedSamples = {
        ...(existingItem.sampleDetails || {}),
        ...(updates.sputumSamples || {}),
      };

      // Merge full item
      const merged = {
        ...existingItem,
        ...updates,
        sampleDetails: mergedSamples,
      };

      // Determine if all required fields are complete using Zod
      let shouldSetStatusCompleted = false;
      try {
        CompletionCheckSchema.parse({
          samples: merged.sampleDetails,
          drugTested: merged.drugTested,
          // dstSputumSample: merged.dstSputumSample,
          drugResistance: merged.drugResistance,
          drugResistanceDetails: merged.drugResistanceDetails,
        });
        shouldSetStatusCompleted = true;
      } catch {
        shouldSetStatusCompleted = false;
      }
      // Start update

      const updateExpressions: string[] = [];
      const expressionAttributeNames: Record<string, string> = {};
      const expressionAttributeValues: Record<string, any> = {
        ":updatedAt": new Date().toISOString(),
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

            updateExpressions.push(`sampleDetails.${sampleAttr}.${fieldAttr} = ${valueAttr}`);
            expressionAttributeNames[sampleAttr] = sampleKey;
            expressionAttributeNames[fieldAttr] = fieldKey;
            expressionAttributeValues[valueAttr] = value;
            idx++;
          }
        }
      }

      // Top-level drug test fields
      const topFields: (keyof SputumSampleUpdateInput)[] = [
        "dstConducted",
        "drugTested",
        "dstSputumSampleTested",
        "drugResistance",
        "drugResistanceDetails",
      ];
      for (const field of topFields) {
        const value = updates[field];
        if (value !== undefined) {
          const nameKey = `#${field}`;
          const valueKey = `:${field}`;
          updateExpressions.push(`${nameKey} = ${valueKey}`);
          expressionAttributeNames[nameKey] = field;
          expressionAttributeValues[valueKey] = value;
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
        expressionAttributeValues[":status"] = "completed";
      }

      updateExpressions.push("updatedAt = :updatedAt");

      const UpdateExpression = "SET " + updateExpressions.join(", ");

      await docClient.send(
        new UpdateCommand({
          TableName,
          Key: { pk, sk },
          UpdateExpression,
          ExpressionAttributeNames: expressionAttributeNames,
          ExpressionAttributeValues: expressionAttributeValues,
          ...(conditionExpression ? { ConditionExpression: conditionExpression } : {}),
        }),
      );

      logger.info(`Created/Updated sputum sample details for ${applicationId}`);
    } catch (error) {
      logger.error("Update failed", error);
      throw error;
    }
  }
  static todbItem(sputumDetails: SputumDetails) {
    const dbItem = {
      ...sputumDetails,
      dateCreated: sputumDetails.dateCreated.toISOString(),
      pk: SputumDetailsDbOps.getPk(sputumDetails.applicationId),
      sk: SputumDetailsDbOps.sk,
    };
    return dbItem;
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

      if (!data.Item) {
        logger.info("No Sputum Details found");
        return;
      }

      logger.info("Sputum Details fetched successfully");

      const dbItem = data.Item as ReturnType<(typeof SputumDetailsDbOps)["todbItem"]>;

      const sputumDetails = new SputumDetails({
        ...dbItem,
        dateCreated: new Date(dbItem.dateCreated),
      });
      return sputumDetails;
    } catch (error) {
      logger.error(error, "Error retrieving Sputum Details");
      throw error;
    }
  }
}
