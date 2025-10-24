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
import { VisaOptions } from "../types/enums";

const { dynamoDBDocClient: docClient } = awsClients;
abstract class TravelInformationBase {
  applicationId!: string;
  ukAddressLine1?: string;
  ukAddressLine2?: string;
  ukAddressTownOrCity?: string;
  ukAddressPostcode?: string;
  ukMobileNumber?: string;
  ukEmailAddress?: string;

  constructor(details: Partial<TravelInformationBase>) {
    Object.assign(this, details); // copies all matching props
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
export type ITravelInformation = {
  applicationId: string;
  status: TaskStatus;

  visaCategory: VisaOptions;
  ukAddressLine1?: string;
  ukAddressLine2?: string;
  ukAddressTownOrCity?: string;
  ukAddressPostcode?: string;
  ukMobileNumber?: string;
  ukEmailAddress?: string;

  dateCreated: Date;
  createdBy: string;
};

export type ITravelInformationUpdate = {
  applicationId: string;

  visaCategory?: VisaOptions;
  ukAddressLine1?: string;
  ukAddressLine2?: string;
  ukAddressTownOrCity?: string;
  ukAddressPostcode?: string;
  ukMobileNumber?: string;
  ukEmailAddress?: string;

  dateUpdated: Date;
  updatedBy: string;
};

export class TravelInformation extends TravelInformationBase {
  status: TaskStatus;
  visaCategory: VisaOptions;

  dateCreated: Date;
  createdBy: string;

  constructor(details: ITravelInformation) {
    super(details);
    this.visaCategory = details.visaCategory;
    this.status = details.status;

    // Audit
    this.dateCreated = details.dateCreated;
    this.createdBy = details.createdBy;
  }
}

export type NewTravelInformation = Omit<ITravelInformation, "dateCreated" | "status">;

export class TravelInformationUpdate extends TravelInformationBase {
  visaCategory?: VisaOptions;
  dateUpdated: Date;
  updatedBy: string;
  constructor(details: ITravelInformationUpdate) {
    super(details);
    this.visaCategory = details.visaCategory;

    // Audit
    this.dateUpdated = details.dateUpdated;
    this.updatedBy = details.updatedBy;
  }
}

export type NewTravelInformationUpdate = Omit<ITravelInformationUpdate, "dateUpdated">;

export class TravelInformationDbOps {
  static readonly getPk = (applicationId: string) => Application.getPk(applicationId);

  static readonly sk = "APPLICATION#TRAVEL#INFORMATION";

  static readonly getTableName = () => process.env.APPLICATION_SERVICE_DATABASE_NAME;

  static todbItem(travelInformation: TravelInformation) {
    const dbItem = {
      ...travelInformation,
      dateCreated: travelInformation.dateCreated.toISOString(),
      pk: TravelInformationDbOps.getPk(travelInformation.applicationId),
      sk: TravelInformationDbOps.sk,
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

      const dbItem = TravelInformationDbOps.todbItem(travelInformation);
      const params: PutCommandInput = {
        TableName: TravelInformationDbOps.getTableName(),
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

  static async updateTravelInformation(
    details: Omit<ITravelInformationUpdate, "dateUpdated" | "status">,
  ): Promise<TravelInformationUpdate> {
    try {
      logger.info("Update Travel Information to DB");
      const pk = TravelInformationDbOps.getPk(details.applicationId);
      const sk = TravelInformationDbOps.sk;

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
        TableName: TravelInformationDbOps.getTableName(),
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

      logger.info({ response }, "Travel Information created/updated successfully");
      const travelInformation = new TravelInformationUpdate({
        applicationId: attrs?.applicationId,
        visaCategory: attrs?.visaCategory,
        ukAddressLine1: attrs?.ukAddressLine1,
        ukAddressLine2: attrs?.ukAddressLine2,
        ukAddressTownOrCity: attrs?.ukAddressTownOrCity,
        ukAddressPostcode: attrs?.ukAddressPostcode,
        ukMobileNumber: attrs?.ukMobileNumber,
        ukEmailAddress: attrs?.ukEmailAddress,
        dateUpdated: new Date(attrs?.dateUpdated as string),
        updatedBy: attrs?.updatedBy,
      });
      return travelInformation;
    } catch (error) {
      logger.error(error, "Error updating travel information");
      throw error;
    }
  }
  static async getByApplicationId(applicationId: string) {
    try {
      logger.info("fetching Travel Details");

      const params = {
        TableName: TravelInformationDbOps.getTableName(),
        Key: {
          pk: TravelInformationDbOps.getPk(applicationId),
          sk: TravelInformationDbOps.sk,
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

      const travelInformationDbItem = data.Item as ReturnType<
        (typeof TravelInformationDbOps)["todbItem"]
      >;

      const travelInformation = new TravelInformation({
        ...travelInformationDbItem,
        dateCreated: new Date(travelInformationDbItem.dateCreated),
      });
      return travelInformation;
    } catch (error) {
      logger.error(error, "Error retrieving travel details");
      throw error;
    }
  }
}
