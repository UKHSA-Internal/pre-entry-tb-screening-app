import {
  GetCommand,
  PutCommand,
  PutCommandInput,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";

import awsClients from "../clients/aws";
import { assertEnvExists } from "../config";
import { CountryCode } from "../country";
import { logger } from "../logger";
import { ApplicationStatus } from "../types/enum";
import { ApplicantBase } from "./applicant";

const { dynamoDBDocClient: docClient } = awsClients;

export abstract class IApplication {
  readonly applicationId: string;
  passportNumber: string;
  countryOfIssue: CountryCode;
  clinicId: string;
  dateCreated: Date;
  createdBy: string;
  applicationStatus: ApplicationStatus;
  cancellationReason?: string;
  cancellationFurthurInfo?: string;
  expiryDate?: Date;
  dateUpdated?: Date;
  updatedBy?: string;

  constructor(details: IApplication) {
    this.applicationId = details.applicationId;
    this.passportNumber = details.passportNumber;
    this.countryOfIssue = details.countryOfIssue;
    this.clinicId = details.clinicId;
    this.dateCreated = details.dateCreated;
    this.createdBy = details.createdBy;
    this.applicationStatus = details.applicationStatus;
    this.cancellationReason = details.cancellationReason;
    this.cancellationFurthurInfo = details.cancellationFurthurInfo;
    this.expiryDate = details.expiryDate;
    this.dateUpdated = details.dateUpdated;
    this.updatedBy = details.updatedBy;
  }
}

export type NewApplication = Omit<IApplication, "dateCreated" | "applicationStatus">;

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
      applicantId: ApplicantBase.getPassportId(this.countryOfIssue, this.passportNumber),
    };
    return dbItem;
  }

  static async createNewApplication(details: NewApplication) {
    try {
      logger.info("Saving new Applicaton to DB");
      const updatedDetails: IApplication = {
        ...details,
        dateCreated: new Date(),
        applicationStatus: ApplicationStatus.inProgress,
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

  static async getByApplicationId(applicationId: string): Promise<Application | null> {
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
        return null;
      }

      logger.info("Application fetched successfully");

      const dbItem = applicationDbItem as ReturnType<Application["todbItem"]>;
      const { countryOfIssue, passportNumber } = ApplicantBase.parsePassportId(dbItem.applicantId);

      const application = new Application({
        ...dbItem,
        passportNumber: passportNumber,
        countryOfIssue: countryOfIssue,
        dateCreated: new Date(dbItem.dateCreated),
        dateUpdated: dbItem.dateUpdated ? new Date(dbItem.dateUpdated) : undefined,
        expiryDate: dbItem.expiryDate ? new Date(dbItem.expiryDate) : undefined,
      });
      return application;
    } catch (error) {
      logger.error(error, "Error retrieving application");
      throw error;
    }
  }

  static async getByApplicantId(
    passportNumber: string,
    countryOfIssue: CountryCode,
  ): Promise<Application[]> {
    try {
      logger.info("fetching All Applications of the applicant");

      const params: QueryCommandInput = {
        TableName: this.getTableName(),
        IndexName: assertEnvExists(process.env.APPLICANT_ID_INDEX),
        KeyConditionExpression: `applicantId = :applicantId`,
        ExpressionAttributeValues: {
          ":applicantId": ApplicantBase.getPassportId(countryOfIssue, passportNumber),
        },
      };

      const command = new QueryCommand(params);
      const data = await docClient.send(command);

      if (!data.Items || (data.Items && data.Items?.length < 1)) {
        logger.info("No applications found");
        return [];
      }

      logger.info({ resultCount: data.Items.length }, "Applicaton details fetched successfully");

      const results = data.Items as ReturnType<Application["todbItem"]>[];

      return results.map((dbItem) => {
        const { countryOfIssue, passportNumber } = ApplicantBase.parsePassportId(
          dbItem.applicantId,
        );
        return new Application({
          ...dbItem,
          passportNumber: passportNumber,
          countryOfIssue: countryOfIssue,
          dateCreated: new Date(dbItem.dateCreated),
        });
      });
    } catch (error) {
      logger.error(error, "Error retrieving application");
      throw error;
    }
  }

  toJson() {
    return {
      applicationId: this.applicationId,
      dateCreated: this.dateCreated.toISOString(),
      applicationStatus: this.applicationStatus,
      cancellationReason: this.cancellationReason,
      cancellationFurthurInfo: this.cancellationFurthurInfo,
      expiryDate: this.expiryDate ? this.expiryDate.toISOString() : undefined,
      dateUpdated: this.dateUpdated ? this.dateUpdated?.toISOString() : undefined,
      updatedBy: this.updatedBy,
    };
  }
}
