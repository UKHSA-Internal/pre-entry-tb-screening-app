import { GetCommand, PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";

import awsClients from "../clients/aws";
import { logger } from "../logger";
import { ApplicationStatus } from "../types/enum";

const { dynamoDBDocClient: docClient } = awsClients;

export abstract class IApplication {
  readonly applicationId: string;

  clinicId: string;
  dateCreated: Date;
  createdBy: string;
  status: ApplicationStatus;
  cancellationReason?: string;
  expiryDate?: Date;
  dateUpdated?: Date;
  updatedBy?: string;

  constructor(details: IApplication) {
    this.applicationId = details.applicationId;
    this.clinicId = details.clinicId;
    this.dateCreated = details.dateCreated;
    this.createdBy = details.createdBy;
    this.status = details.status;
    this.cancellationReason = details.cancellationReason;
    this.expiryDate = details.expiryDate;
    this.dateUpdated = details.dateUpdated;
    this.updatedBy = details.updatedBy;
  }
}

export type NewApplication = Omit<IApplication, "dateCreated" | "status">;

export class Application extends IApplication {
  static readonly getPk = (applicationId: string) => `APPLICATION#${applicationId}`;

  static readonly sk = "APPLICATION#ROOT";

  static readonly getTableName = () => process.env.APPLICATION_SERVICE_DATABASE_NAME;

  private constructor(details: IApplication) {
    super(details);
  }

  private todbItem() {
    const dbItem = {
      ...this,
      dateCreated: this.dateCreated.toISOString(),
      dateUpdated: this.dateUpdated?.toISOString(),
      expiryDate: this.expiryDate?.toISOString(),
      updatedBy: this.updatedBy,
      pk: Application.getPk(this.applicationId),
      sk: Application.sk,
    };
    return dbItem;
  }

  static async createNewApplication(details: NewApplication) {
    try {
      logger.info("Saving new Applicaton to DB");
      const updatedDetails: IApplication = {
        ...details,
        dateCreated: new Date(),
        status: ApplicationStatus.inProgress,
      };
      const newApplication = new Application(updatedDetails);
      const dbItem = newApplication.todbItem();

      const params: PutCommandInput = {
        TableName: Application.getTableName(),
        Item: { ...dbItem },
        ConditionExpression: "attribute_not_exists(pk) AND attribute_not_exists(sk)", // Check to ensure the pk is truly a unique value
      };
      const command = new PutCommand(params);
      const response = await docClient.send(command);

      logger.info({ response }, "New application created successfully");

      return newApplication;
    } catch (error) {
      logger.error(error, "Error creating application");
      throw error;
    }
  }

  static async updateApplication(details: Partial<IApplication>) {
    try {
      logger.info("Updating Applicaton details");
      const application = await this.getByApplicationId(details.applicationId!);

      if (!application) {
        throw new Error("Could not fetch the application with the given applicationId");
      }

      const updatedDetails = Object.assign(application, {
        ...details,
        updatedBy: details.updatedBy,
        dateUpdated: new Date(),
      });

      // Create Application class instance to have access to toJson() function
      const updatedApplication = new Application(updatedDetails);

      const params: PutCommandInput = {
        TableName: Application.getTableName(),
        Item: { ...updatedApplication.todbItem() },
        ConditionExpression: "attribute_exists(pk) AND attribute_exists(sk)",
      };
      const command = new PutCommand(params);
      const response = await docClient.send(command);

      logger.info({ response }, "Application updated successfully");

      return updatedApplication;
    } catch (error) {
      logger.error(error, "Error updating application");
      throw error;
    }
  }

  static async getByApplicationId(applicationId: string) {
    try {
      logger.info("fetching Application Details");

      const params = {
        TableName: Application.getTableName(),
        Key: {
          pk: Application.getPk(applicationId),
          sk: Application.sk,
        },
      };

      const command = new GetCommand(params);
      const data = await docClient.send(command);
      const applicationDbItem = data.Item;

      if (!applicationDbItem) {
        logger.info("No application found");
        return;
      }

      logger.info("Application fetched successfully");

      const dbItem = applicationDbItem as ReturnType<Application["todbItem"]>;

      const application = new Application({
        ...dbItem,
        dateCreated: new Date(dbItem.dateCreated),
      });
      return application;
    } catch (error) {
      logger.error(error, "Error retrieving application");
      throw error;
    }
  }

  toJson() {
    return {
      applicationId: this.applicationId,
      dateCreated: this.dateCreated.toISOString(),
      status: this.status,
      cancellationReason: this.cancellationReason,
      expiryDate: this.expiryDate?.toISOString(),
      dateUpdated: this.dateUpdated?.toISOString(),
      updatedBy: this.updatedBy,
    };
  }
}
