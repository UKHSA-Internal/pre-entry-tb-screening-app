import { GetCommand, PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";

import awsClients from "../../shared/clients/aws";
import { logger } from "../../shared/logger";
import { Application } from "../../shared/models/application";
import { TaskStatus } from "../../shared/types/enum";
import { VisaOptions } from "../types/enums";

const { dynamoDBDocClient: docClient } = awsClients;

export abstract class ITravelInformation {
  applicationId: string;
  status: TaskStatus;

  visaCategory: VisaOptions;
  ukAddressLine1: string;
  ukAddressLine2?: string;
  ukAddressTownOrCity: string;
  ukAddressPostcode: string;
  ukMobileNumber: string;
  ukEmailAddress: string;

  dateCreated: Date;
  createdBy: string;

  constructor(details: ITravelInformation) {
    this.applicationId = details.applicationId;
    this.visaCategory = details.visaCategory;
    this.ukAddressLine1 = details.ukAddressLine1;
    this.ukAddressLine2 = details.ukAddressLine2;
    this.ukAddressTownOrCity = details.ukAddressTownOrCity;
    this.ukAddressPostcode = details.ukAddressPostcode;
    this.ukMobileNumber = details.ukMobileNumber;
    this.ukEmailAddress = details.ukEmailAddress;
    this.status = details.status;

    // Audit
    this.dateCreated = details.dateCreated;
    this.createdBy = details.createdBy;
  }
}

export class TravelInformation extends ITravelInformation {
  static readonly getPk = (applicationId: string) => Application.getPk(applicationId);

  static readonly sk = "APPLICATION#TRAVEL#INFORMATION";

  static readonly getTableName = () => process.env.APPLICATION_SERVICE_DATABASE_NAME;

  private constructor(details: ITravelInformation) {
    super(details);
  }

  private todbItem() {
    const dbItem = {
      ...this,
      dateCreated: this.dateCreated.toISOString(),
      pk: TravelInformation.getPk(this.applicationId),
      sk: TravelInformation.sk,
    };
    return dbItem;
  }

  static async createTravelInformation(
    details: Omit<ITravelInformation, "dateCreated" | "status">,
  ) {
    try {
      logger.info("Saving Travel Information to DB");

      const updatedDetails: ITravelInformation = {
        ...details,
        dateCreated: new Date(),
        status: TaskStatus.completed,
      };

      const travelInformation = new TravelInformation(updatedDetails);

      const dbItem = travelInformation.todbItem();
      const params: PutCommandInput = {
        TableName: TravelInformation.getTableName(),
        Item: { ...dbItem },
        ConditionExpression: "attribute_not_exists(pk) AND attribute_not_exists(sk)",
      };
      const command = new PutCommand(params);
      const response = await docClient.send(command);

      logger.info({ response }, "Travel Information saved successfully");

      return travelInformation;
    } catch (error) {
      logger.error(error, "Error saving travel information");
      throw error;
    }
  }

  static async getByApplicationId(applicationId: string) {
    try {
      logger.info("fetching Travel Details");

      const params = {
        TableName: TravelInformation.getTableName(),
        Key: {
          pk: TravelInformation.getPk(applicationId),
          sk: TravelInformation.sk,
        },
      };

      const command = new GetCommand(params);
      const data = await docClient.send(command);
      const travelInfo = data.Item;

      if (!travelInfo) {
        logger.info("No travel info found");
        return;
      }

      logger.info("Travel details fetched successfully");

      const dbItem = travelInfo as ReturnType<TravelInformation["todbItem"]>;

      const travelInformation = new TravelInformation({
        ...dbItem,
        dateCreated: new Date(dbItem.dateCreated),
      });
      return travelInformation;
    } catch (error) {
      logger.error(error, "Error retrieving travel details");
      throw error;
    }
  }

  toJson() {
    return {
      applicationId: this.applicationId,
      status: this.status,

      visaCategory: this.visaCategory,
      ukAddressLine1: this.ukAddressLine1,
      ukAddressLine2: this.ukAddressLine2,
      ukAddressTownOrCity: this.ukAddressTownOrCity,
      ukAddressPostcode: this.ukAddressPostcode,
      ukMobileNumber: this.ukMobileNumber,
      ukEmailAddress: this.ukEmailAddress,
      dateCreated: this.dateCreated,
    };
  }
}
