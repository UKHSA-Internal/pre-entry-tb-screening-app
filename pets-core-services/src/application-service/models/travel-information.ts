import { GetCommand, UpdateCommand, UpdateCommandInput } from "@aws-sdk/lib-dynamodb";

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
  ukAddressLine1?: string;
  ukAddressLine2?: string;
  ukAddressTownOrCity?: string;
  ukAddressPostcode?: string;
  ukMobileNumber: string;
  ukEmailAddress: string;

  dateCreated: Date;
  dateUpdated: Date;
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
    this.dateUpdated = details.dateUpdated;
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
      dateUpdated: this.dateUpdated.toISOString(),
      pk: TravelInformation.getPk(this.applicationId),
      sk: TravelInformation.sk,
    };
    return dbItem;
  }

  static async createorUpdateTravelInformation(
    details: Omit<ITravelInformation, "dateCreated" | "dateUpdated" | "status">,
  ) {
    try {
      logger.info("Saving Travel Information to DB");
      const pk = TravelInformation.getPk(details.applicationId);
      const sk = TravelInformation.sk;

      // Clean up: remove undefined fields before building update expression
      const fieldsToUpdate = Object.entries(details).reduce(
        (acc, [key, value]) => {
          if (value !== undefined) acc[key] = value;
          return acc;
        },
        {} as Record<string, any>,
      );

      // Set status = "completed"
      if (
        fieldsToUpdate.visaCategory &&
        fieldsToUpdate.ukMobileNumber &&
        fieldsToUpdate.ukEmailAddress
      ) {
        fieldsToUpdate.status = TaskStatus.completed;
      }
      // Add audit fields
      fieldsToUpdate["dateUpdated"] = new Date().toISOString();
      if (!fieldsToUpdate["dateCreated"]) fieldsToUpdate["dateCreated"] = new Date().toISOString();

      // Build the UpdateExpression dynamically
      const updateParts: string[] = [];
      const ExpressionAttributeNames: Record<string, string> = {};
      const ExpressionAttributeValues: Record<string, any> = {};

      Object.entries(fieldsToUpdate).forEach(([key, value]) => {
        const nameKey = `#${key}`;
        const valueKey = `:${key}`;
        updateParts.push(`${nameKey} = ${valueKey}`);
        ExpressionAttributeNames[nameKey] = key;
        ExpressionAttributeValues[valueKey] = value;
      });

      const updateExpression = "SET " + updateParts.join(", ");

      const params: UpdateCommandInput = {
        TableName: TravelInformation.getTableName(),
        Key: { pk, sk },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
        ReturnValues: "ALL_NEW", // Return updated item
      };

      const command = new UpdateCommand(params);
      const response = await docClient.send(command);
      const attrs = response.Attributes!;

      logger.info({ response }, "Travel Information created/updated successfully");
      const travelInformationDetails: Omit<ITravelInformation, "createdBy"> = {
        applicationId: attrs?.applicationId,
        visaCategory: attrs?.visaCategory,
        ukAddressLine1: attrs?.ukAddressLine1,
        ukAddressLine2: attrs?.ukAddressLine2,
        ukAddressTownOrCity: attrs?.ukAddressTownOrCity,
        ukAddressPostcode: attrs?.ukAddressPostcode,
        ukMobileNumber: attrs?.ukMobileNumber,
        ukEmailAddress: attrs?.ukEmailAddress,
        status: attrs.status as TaskStatus,
        dateCreated: new Date(attrs.dateCreated as string),
        dateUpdated: new Date(attrs.dateUpdated as string),
      };
      return travelInformationDetails;
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
