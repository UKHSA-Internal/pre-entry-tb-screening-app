import { GetCommand, PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";

import awsClients from "../clients/aws";
import { logger } from "../logger";

const { dynamoDBDocClient: docClient } = awsClients;

export abstract class IApplication {
  readonly applicationId: string;

  clinicId: string;
  dateCreated: Date;
  createdBy: string;

  constructor(details: IApplication) {
    this.applicationId = details.applicationId;
    this.clinicId = details.clinicId;
    this.dateCreated = details.dateCreated;
    this.createdBy = details.createdBy;
  }
}
export type NewApplication = Omit<IApplication, "dateCreated">;

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
      };
      const newApplication = new Application(updatedDetails);
      const dbItem = newApplication.todbItem();

      const params: PutCommandInput = {
        TableName: Application.getTableName(),
        Item: { ...dbItem },
        ConditionExpression: "attribute_not_exists(pk) AND attribute_not_exists(sk)", // Check to ensure crypto.randomUUID has generated a truly unique value
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
      dateCreated: this.dateCreated,
    };
  }
}
