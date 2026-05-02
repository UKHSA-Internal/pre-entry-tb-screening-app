import {
  GetCommand,
  PutCommand,
  PutCommandInput,
  UpdateCommand,
  UpdateCommandInput,
} from "@aws-sdk/lib-dynamodb";

import awsClients from "../../shared/clients/aws";
import { logger } from "../../shared/logger";
import { Application } from "../../shared/models/application";
import { TaskStatus } from "../../shared/types/enum";
import { YesOrNo } from "../types/enums";

const { dynamoDBDocClient: docClient } = awsClients;

export type ISputumDecision = {
  applicationId: string;
  status: TaskStatus;

  sputumRequired: YesOrNo;

  dateCreated: Date;
  createdBy: string;
};
export class SputumDecision {
  applicationId: string;
  status: TaskStatus;

  sputumRequired: YesOrNo;

  dateCreated: Date;
  createdBy: string;

  constructor(details: ISputumDecision) {
    this.applicationId = details.applicationId;
    this.status = details.status;

    this.sputumRequired = details.sputumRequired;
    // Audit
    this.dateCreated = details.dateCreated;
    this.createdBy = details.createdBy;
  }
  toJson() {
    // Copy everything from this
    const json = { ...this } as Record<string, unknown>;

    // Exclude internal fields
    delete json.createdBy;
    delete json.updatedBy;
    delete json.pk;
    delete json.sk;

    return json;
  }
}

export type ISputumDecisionUpdate = {
  applicationId: string;

  sputumRequired?: YesOrNo;

  dateUpdated: Date;
  updatedBy: string;
};

export class SputumDecisionUpdate {
  applicationId: string;

  sputumRequired?: YesOrNo;

  dateUpdated: Date;
  updatedBy: string;

  constructor(details: ISputumDecisionUpdate) {
    this.applicationId = details.applicationId;

    this.sputumRequired = details.sputumRequired;
    // Audit
    this.dateUpdated = details.dateUpdated;
    this.updatedBy = details.updatedBy;
  }
  toJson() {
    // Copy everything from this
    const json = { ...this } as Record<string, unknown>;

    // Exclude internal fields
    delete json.updatedBy;
    delete json.pk;
    delete json.sk;

    return json;
  }
}
export class SputumDecisionDbOps {
  static readonly getPk = (applicationId: string) => Application.getPk(applicationId);

  static readonly sk = "APPLICATION#SPUTUM#DECISION";

  static readonly getTableName = () => process.env.APPLICATION_SERVICE_DATABASE_NAME;

  // private constructor(details: ISputumDecision) {
  //   super(details);
  // }

  static todbItem(sputumDecision: SputumDecision) {
    const dbItem = {
      ...sputumDecision,
      dateCreated: sputumDecision.dateCreated.toISOString(),
      pk: SputumDecisionDbOps.getPk(sputumDecision.applicationId),
      sk: SputumDecisionDbOps.sk,
    };
    return dbItem;
  }

  static async createSputumDecision(details: Omit<ISputumDecision, "dateCreated" | "status">) {
    try {
      logger.info("Saving Sputum Decision to DB");

      const updatedDetails: ISputumDecision = {
        ...details,
        dateCreated: new Date(),
        status: TaskStatus.completed,
      };

      const sputumDecision = new SputumDecision(updatedDetails);

      const dbItem = SputumDecisionDbOps.todbItem(sputumDecision);

      const params: PutCommandInput = {
        TableName: SputumDecisionDbOps.getTableName(),
        Item: { ...dbItem },
        ConditionExpression: "attribute_not_exists(pk) AND attribute_not_exists(sk)",
      };
      const command = new PutCommand(params);
      const response = await docClient.send(command);

      logger.info({ response }, "Sputum Decision saved successfully");

      return sputumDecision;
    } catch (error) {
      logger.error(error, "Error saving Sputum Decision");
      throw error;
    }
  }

  static async updateSputumDecision(
    details: Omit<ISputumDecisionUpdate, "dateUpdated" | "status">,
  ): Promise<SputumDecisionUpdate> {
    try {
      logger.info("Update Travel Information to DB");
      const pk = SputumDecisionDbOps.getPk(details.applicationId);
      const sk = SputumDecisionDbOps.sk;

      // Clean up: remove undefined fields before building update expression
      const fieldsToUpdate = Object.entries(details).reduce(
        (acc, [key, value]) => {
          if (value !== undefined) acc[key] = value;
          return acc;
        },
        {} as Record<string, any>,
      );

      // Add audit fields
      fieldsToUpdate["dateUpdated"] = new Date().toISOString();

      // Build the UpdateExpression dynamically
      const updateParts: string[] = [];
      const ExpressionAttributeNames: Record<string, string> = {};
      const ExpressionAttributeValues: Record<string, any> = {};

      for (const [key, value] of Object.entries(fieldsToUpdate)) {
        const nameKey = `#${key}`;
        const valueKey = `:${key}`;
        updateParts.push(`${nameKey} = ${valueKey}`);
        ExpressionAttributeNames[nameKey] = key;
        ExpressionAttributeValues[valueKey] = value;
      }
      const updateExpression = "SET " + updateParts.join(", ");

      const params: UpdateCommandInput = {
        TableName: SputumDecisionDbOps.getTableName(),
        Key: { pk, sk },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
        ReturnValues: "ALL_NEW", // Return updated item
      };

      const command = new UpdateCommand(params);
      const response = await docClient.send(command);
      const attrs = response.Attributes!;
      if (!attrs) throw new Error("Update failed");

      logger.info({ response }, "Sputum Decision updated successfully");

      const updatedSputumDecision = new SputumDecisionUpdate({
        applicationId: attrs?.applicationId,
        sputumRequired: attrs?.sputumRequired,
        dateUpdated: new Date(attrs?.dateUpdated as string),
        updatedBy: attrs?.updatedBy,
      });

      return updatedSputumDecision;
    } catch (error) {
      logger.error(error, "Error updating travel information");
      throw error;
    }
  }
  static async getByApplicationId(applicationId: string) {
    try {
      logger.info("Fetching Sputum Decision");

      const params = {
        TableName: SputumDecisionDbOps.getTableName(),
        Key: {
          pk: SputumDecisionDbOps.getPk(applicationId),
          sk: SputumDecisionDbOps.sk,
        },
      };

      const command = new GetCommand(params);
      const data = await docClient.send(command);

      if (!data.Item) {
        logger.info("No Sputum Decision found");
        return;
      }

      logger.info("Sputum Decision fetched successfully");

      const sputumDecisionDbItem = data.Item as ReturnType<
        (typeof SputumDecisionDbOps)["todbItem"]
      >;

      const sputumDecision = new SputumDecision({
        ...sputumDecisionDbItem,
        dateCreated: new Date(sputumDecisionDbItem.dateCreated),
      });
      return sputumDecision;
    } catch (error) {
      logger.error(error, "Error retrieving Sputum Decision details");
      throw error;
    }
  }
}
