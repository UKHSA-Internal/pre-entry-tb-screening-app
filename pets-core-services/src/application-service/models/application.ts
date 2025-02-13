import {
  GetCommand,
  PutCommand,
  PutCommandInput,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";
import crypto from "crypto";

import awsClients from "../../shared/clients/aws";
import { assertEnvExists } from "../../shared/config";
import { CountryCode } from "../../shared/country";
import { logger } from "../../shared/logger";

const { dynamoDBDocClient: docClient } = awsClients;

export abstract class IApplication {
  applicationId: string;
  passportNumber: string;
  countryOfIssue: CountryCode;

  clinicId: string;
  dateCreated: Date;
  createdBy: string;

  constructor(details: IApplication) {
    this.applicationId = details.applicationId;
    this.passportNumber = details.passportNumber;
    this.countryOfIssue = details.countryOfIssue;

    this.clinicId = details.clinicId;
    this.dateCreated = details.dateCreated;
    this.createdBy = details.createdBy;
  }
}
type NewApplication = Omit<IApplication, "dateCreated" | "applicationId" | "passportId">;

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

      const newApplicationId = crypto.randomUUID();
      const updatedDetails: IApplication = {
        ...details,
        applicationId: newApplicationId,
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

  static async findByPassportDetails(countryOfIssue: CountryCode, passportNumber: string) {
    try {
      logger.info("Finding applications linked to Passport number");

      const params: QueryCommandInput = {
        TableName: Application.getTableName(),
        IndexName: assertEnvExists(process.env.APPLICANT_SERVICE_DB_PASSPORT_DETAILS_INDEX),
        KeyConditionExpression:
          "passportNumber = :passportNumber AND countryOfIssue = :countryOfIssue",
        ExpressionAttributeValues: {
          ":passportNumber": passportNumber,
          ":countryOfIssue": countryOfIssue,
        },
      };

      const command = new QueryCommand(params);
      const data = await docClient.send(command);

      if (!data.Items) {
        logger.info("No application found");
        return [];
      }
      logger.info({ resultCount: data.Items.length }, "Applications fetched successfully");

      const results = data.Items as ReturnType<Application["todbItem"]>[];

      return results.map(
        (dbItem) => new Application({ ...dbItem, dateCreated: new Date(dbItem.dateCreated) }),
      );
    } catch (error) {
      logger.error(error, "Error finding applications linked to passport number");
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
      passportNumber: this.passportNumber,
      countryOfIssue: this.countryOfIssue,
      dateCreated: this.dateCreated,
    };
  }
}
