import { GetCommand, PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";

import awsClients from "../../shared/clients/aws";
import { logger } from "../../shared/logger";
import { Application } from "../../shared/models/application";
import { TaskStatus } from "../../shared/types/enum";
import { YesOrNo } from "../types/enums";

const { dynamoDBDocClient: docClient } = awsClients;

export abstract class ISputumDecision {
  applicationId: string;
  status: TaskStatus;

  sputumRequired: YesOrNo;

  dateCreated: Date;

  constructor(details: ISputumDecision) {
    this.applicationId = details.applicationId;
    this.status = details.status;

    this.sputumRequired = details.sputumRequired;
    // Audit
    this.dateCreated = details.dateCreated;
  }
}

export class SputumDecision extends ISputumDecision {
  static readonly getPk = (applicationId: string) => Application.getPk(applicationId);

  static readonly sk = "APPLICATION#SPUTUM#DECISION";

  static readonly getTableName = () => process.env.APPLICATION_SERVICE_DATABASE_NAME;

  private constructor(details: ISputumDecision) {
    super(details);
  }

  private todbItem() {
    const dbItem = {
      ...this,
      dateCreated: this.dateCreated.toISOString(),
      pk: SputumDecision.getPk(this.applicationId),
      sk: SputumDecision.sk,
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

      const dbItem = sputumDecision.todbItem();
      const params: PutCommandInput = {
        TableName: SputumDecision.getTableName(),
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

  static async getByApplicationId(applicationId: string) {
    try {
      logger.info("Fetching Sputum Decision");

      const params = {
        TableName: SputumDecision.getTableName(),
        Key: {
          pk: SputumDecision.getPk(applicationId),
          sk: SputumDecision.sk,
        },
      };

      const command = new GetCommand(params);
      const data = await docClient.send(command);

      if (!data.Item) {
        logger.info("No Sputum Decision found");
        return;
      }

      logger.info("Sputum Decision fetched successfully");

      const dbItem = data.Item as ReturnType<SputumDecision["todbItem"]>;

      const sputumDecision = new SputumDecision({
        ...dbItem,
        dateCreated: new Date(dbItem.dateCreated),
      });
      return sputumDecision;
    } catch (error) {
      logger.error(error, "Error retrieving Sputum Decision details");
      throw error;
    }
  }

  toJson() {
    return {
      applicationId: this.applicationId,
      status: this.status,
      sputumRequired: this.sputumRequired,
      // Audit
      dateCreated: this.dateCreated,
    };
  }
}
