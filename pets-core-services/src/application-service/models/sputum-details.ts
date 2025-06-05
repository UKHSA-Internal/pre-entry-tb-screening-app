import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import cleanDeep from "clean-deep";

import awsClients from "../../shared/clients/aws";
import { logger } from "../../shared/logger";
import { Application } from "../../shared/models/application";
import { TaskStatus } from "../../shared/types/enum";
import { PositiveOrNegative, SputumCollectionMethod } from "../types/enums";
import { SputumSampleCompletionCheckSchema } from "../types/zod-schema";

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
  dateUpdated: Date;
  createdBy: string;
  sputumSamples: SputumSamples;
  version?: number;
}
abstract class SputumDetailsBase {
  applicationId: string;
  status: TaskStatus;

  dateCreated: Date;
  dateUpdated: Date;

  createdBy: string;

  constructor(details: SputumDetailsBase) {
    this.applicationId = details.applicationId;
    this.status = details.status;

    // Audit
    this.dateCreated = details.dateCreated;
    this.dateUpdated = details.dateUpdated;

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
      dateUpdated: this.dateUpdated.toISOString(),
      createdBy: this.createdBy,
      version: this.version,
    };
  }
}
// --- Helpers to safely parse Sputum fields ---

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

const mergeSample = (
  existing?: Partial<SputumSample>,
  updates?: Partial<SputumSample>,
): SputumSample | undefined => {
  const merged = { ...existing, ...updates };

  if (merged.dateOfSample && merged.dateUpdated && merged.collectionMethod) {
    return merged as SputumSample;
  }

  return undefined;
};

const parseSputumSamples = (samples?: SputumSamples): SputumSamples => ({
  sample1: samples?.sample1 ? parseSample(samples.sample1) : undefined,
  sample2: samples?.sample2 ? parseSample(samples.sample2) : undefined,
  sample3: samples?.sample3 ? parseSample(samples.sample3) : undefined,
});

const mergeSputumSamples = (
  existing: SputumSamples = {},
  updates: SputumSamples = {},
): SputumSamples => ({
  sample1: mergeSample(existing.sample1, updates.sample1),
  sample2: mergeSample(existing.sample2, updates.sample2),
  sample3: mergeSample(existing.sample3, updates.sample3),
});

const buildSputumUpdateExpressions = (
  sputumSamples: Record<string, Record<string, any>>,
): {
  updateExpressions: string[];
  names: Record<string, string>;
  values: Record<string, any>;
} => {
  const updateExpressions: string[] = [];
  const names: Record<string, string> = {};
  const values: Record<string, any> = {};

  for (const [sampleKey, sampleData] of Object.entries(sputumSamples)) {
    if (!sampleData) continue;

    const sampleAttr = `#s_${sampleKey}`;
    const valueAttr = `:v_${sampleKey}`;

    updateExpressions.push(`sputumSamples.${sampleAttr} = ${valueAttr}`);
    names[sampleAttr] = sampleKey;
    values[valueAttr] = sampleData;
  }
  return { updateExpressions, names, values };
};

const buildUpdateExpressionsForSputumDetails = (
  details: Omit<ISputumDetails, "dateCreated" | "dateUpdated" | "status">,
  mergedSamples: SputumSamples,
  isFirstInsert: boolean,
  completionCheckSuccess: boolean,
  currentVersion: number,
): {
  UpdateExpression: string;
  ExpressionAttributeNames?: Record<string, string>;
  ExpressionAttributeValues: Record<string, any>;
  ConditionExpression?: string;
} => {
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, any> = {
    ":dateUpdated": new Date().toISOString(),
    ":dateCreated": new Date().toISOString(),
    ":newVersion": currentVersion + 1,
  };

  let updateExpressions: string[] = [];

  if (isFirstInsert) {
    updateExpressions.push("sputumSamples = :samples");
    expressionAttributeValues[":samples"] = cleanDeep(mergedSamples, { emptyStrings: false });
  } else {
    const {
      updateExpressions: sputumExpr,
      names,
      values,
    } = buildSputumUpdateExpressions(details.sputumSamples || {});
    updateExpressions = sputumExpr;
    Object.assign(expressionAttributeNames, names);
    Object.assign(expressionAttributeValues, values);
  }

  updateExpressions.push("version = :newVersion");
  updateExpressions.push("dateUpdated = :dateUpdated");
  updateExpressions.push("dateCreated = :dateCreated");
  updateExpressions.push("#status = :status");
  expressionAttributeNames["#status"] = "status";

  if (completionCheckSuccess) {
    expressionAttributeValues[":status"] = TaskStatus.completed;
  } else {
    expressionAttributeValues[":status"] = TaskStatus.incompleted;
  }

  const conditionExpression = isFirstInsert
    ? "attribute_not_exists(version)"
    : "version = :expectedVersion";

  if (!isFirstInsert) {
    expressionAttributeValues[":expectedVersion"] = currentVersion;
  }

  const updateCommandInput: {
    UpdateExpression: string;
    ExpressionAttributeValues: Record<string, any>;
    ConditionExpression: string;
    ExpressionAttributeNames?: Record<string, string>;
  } = {
    UpdateExpression: "SET " + updateExpressions.join(", "),
    ExpressionAttributeValues: expressionAttributeValues,
    ConditionExpression: conditionExpression,
  };

  // Only add ExpressionAttributeNames if it’s not empty
  if (Object.keys(expressionAttributeNames).length > 0) {
    updateCommandInput.ExpressionAttributeNames = expressionAttributeNames;
  }

  return updateCommandInput;
};
export class SputumDetailsDbOps {
  static readonly getPk = (applicationId: string) => Application.getPk(applicationId);
  static readonly sk = "APPLICATION#SPUTUM#DETAILS";
  static readonly getTableName = () => process.env.APPLICATION_SERVICE_DATABASE_NAME;

  static async createOrUpdateSputumDetails(
    applicationId: string,
    details: Omit<ISputumDetails, "dateCreated" | "dateUpdated" | "status">,
  ): Promise<SputumDetails> {
    try {
      logger.info("Saving Sputum Details Information to DB");

      const pk = this.getPk(applicationId);
      const sk = this.sk;
      const TableName = this.getTableName();

      const { Item: existingItemRaw } = await docClient.send(
        new GetCommand({ TableName, Key: { pk, sk } }),
      );

      const existingSamples = existingItemRaw?.sputumSamples
        ? parseSputumSamples(existingItemRaw.sputumSamples as SputumSamples)
        : undefined;

      const mergedSamples = mergeSputumSamples(existingSamples, details.sputumSamples);
      const merged = { ...existingItemRaw, ...details, SputumSamples: mergedSamples };

      const completionCheck = SputumSampleCompletionCheckSchema.safeParse({
        samples: merged.SputumSamples,
      });

      if (!completionCheck.success) {
        logger.info("Sputum sample completion check failed", completionCheck.error.flatten());
      }

      const isFirstInsert = !existingItemRaw || existingItemRaw.version === undefined;
      const currentVersion = (existingItemRaw?.version as number) ?? 0;

      const updateParams = buildUpdateExpressionsForSputumDetails(
        details,
        mergedSamples,
        isFirstInsert,
        completionCheck.success,
        currentVersion,
      );
      const commandInput = {
        TableName,
        Key: { pk, sk },
        ...updateParams,
        ReturnValues: "ALL_NEW" as const,
      };
      const updateCommand = new UpdateCommand(commandInput);

      logger.info(updateCommand);
      const { Attributes } = await docClient.send(updateCommand);
      logger.info(Attributes);
      if (!Attributes) throw new Error("Update failed");

      logger.info(`Created/Updated sputum sample details for ${applicationId}`);
      const samples = Attributes.sputumSamples as SputumSamples | undefined;

      const updatedSputumDetails = new SputumDetails({
        applicationId,
        status: Attributes.status as TaskStatus,
        createdBy: Attributes.createdBy as string,
        dateCreated: new Date(Attributes.dateCreated as string),
        dateUpdated: new Date(Attributes.dateUpdated as string),
        sputumSamples: {
          sample1: samples?.sample1,
          sample2: samples?.sample2,
          sample3: samples?.sample3,
        },
        version: Attributes.version as number,
      });

      return updatedSputumDetails;
    } catch (error) {
      logger.error("Update failed", { error });
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
        dateUpdated: new Date(sputumRecord.dateUpdated as string),

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
