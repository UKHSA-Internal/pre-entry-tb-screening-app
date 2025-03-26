import {
  GetCommand,
  PutCommand,
  PutCommandInput,
  QueryCommandOutput,
  ScanCommand,
  ScanCommandInput,
  ScanCommandOutput,
} from "@aws-sdk/lib-dynamodb";

import awsClients from "../../shared/clients/aws";
import { CountryCode } from "../../shared/country";
import { logger } from "../../shared/logger";

const { dynamoDBDocClient: docClient } = awsClients;

export abstract class IClinic {
  readonly clinicId: string;

  name: string;
  city: string;
  country: CountryCode;
  startDate: Date;
  endDate: Date | null;
  createdBy: string;

  constructor(details: IClinic) {
    this.clinicId = details.clinicId;
    this.name = details.name;
    this.city = details.city;
    this.country = details.country;
    this.startDate = details.startDate;
    this.endDate = details.endDate;
    this.createdBy = details.createdBy;
  }
}
export type NewClinic = Omit<IClinic, "startDate" | "endDate"> & {
  startDate: Date | string;
  endDate: Date | string | null | undefined;
};

export class Clinic extends IClinic {
  static readonly getPk = (clinicId: string): string => `CLINIC#${clinicId}`;

  static readonly sk = "CLINIC#ROOT";

  static readonly getTableName = () => process.env.CLINIC_SERVICE_DATABASE_NAME;

  private constructor(details: IClinic) {
    super(details);
  }

  private todbItem() {
    const dbItem = {
      ...this,
      startDate: this.startDate.toISOString(),
      endDate: this.endDate ? this.endDate.toISOString() : null,
      pk: Clinic.getPk(this.clinicId),
      sk: Clinic.sk,
    };
    return dbItem;
  }

  static async createNewClinic(details: NewClinic) {
    try {
      logger.info("Saving new clinic Information to DB");

      const updatedDetails: IClinic = {
        ...details,
        startDate: new Date(),
        // TODO: if better validation is needed, then create function to properly check endDate value
        endDate: details.endDate ? new Date(details.endDate) : null,
      };

      const clinic = new Clinic(updatedDetails);

      const dbItem = clinic.todbItem();
      const params: PutCommandInput = {
        TableName: Clinic.getTableName(),
        Item: { ...dbItem },
        ConditionExpression: "attribute_not_exists(pk) AND attribute_not_exists(sk)",
      };
      const command = new PutCommand(params);
      const response = await docClient.send(command);

      logger.info({ response }, "Clinic details saved successfully");

      return clinic;
    } catch (error) {
      logger.error(error, "Error saving new clinic details");
      throw error;
    }
  }

  /**
   * This is not in use yet
   * @param clinicId
   * @returns a Clinic object
   */
  static async getByClinicId(clinicId: string): Promise<Clinic | void> {
    try {
      logger.info("fetching clinic details");

      const params = {
        TableName: Clinic.getTableName(),
        Key: {
          pk: Clinic.getPk(clinicId),
          sk: Clinic.sk,
        },
      };

      const command = new GetCommand(params);
      const data = await docClient.send(command);

      if (!data.Item) {
        logger.info("No clinic details found");
        return;
      }

      logger.info("Clinic Details fetched successfully");

      const dbItem = data.Item as ReturnType<Clinic["todbItem"]>;

      return new Clinic({
        ...dbItem,
        startDate: new Date(dbItem.startDate),
        endDate: dbItem.endDate ? new Date(dbItem.endDate) : null,
      });
    } catch (error) {
      logger.error(error, "Error retrieving clinic details");
      throw error;
    }
  }

  /**
   * It retrieves all Clinic objects which have endDate attribute as null
   * (no endDate indicates the clinic as active)
   * @returns array of Clinic objects
   */
  static async getActiveClinics(): Promise<Clinic[]> {
    try {
      logger.info(`Finding all active clinics in '${process.env.CLINIC_SERVICE_DATABASE_NAME}'`);

      const params: ScanCommandInput = {
        TableName: Clinic.getTableName(),
        // endDate can only be 'null' or 'Date'
        FilterExpression: `attribute_type(endDate, :dateType)`,
        ExpressionAttributeValues: { ":dateType": "NULL" },
      };
      const command = new ScanCommand(params);

      const data: QueryCommandOutput = await docClient.send(command);

      if (!data?.Items) {
        logger.info("No clinics found");
        return [];
      }

      logger.info({ resultCount: data.Items.length }, "Clinics data fetched successfully");

      const results = data.Items as ReturnType<Clinic["todbItem"]>[];

      return results.map(
        (dbItem) =>
          new Clinic({
            ...dbItem,
            startDate: new Date(dbItem.startDate),
            endDate: dbItem.endDate ? new Date(dbItem.endDate) : null,
          }),
      );
    } catch (error) {
      logger.error(error, "Error retrieving active clinics");
      throw error;
    }
  }

  /**
   * This return True for the clinic that endDate is null or grater than current date
   * @returns boolean
   */
  static async isActiveClinic(clinicId: string): Promise<boolean> {
    try {
      logger.info(`Fetching the clinic (${clinicId}) if 'active'`);
      const today = new Date();

      const params: ScanCommandInput = {
        TableName: Clinic.getTableName(),
        // KeyConditionExpression: `clinicId = :ID`,
        FilterExpression: `(clinicId = :ID) AND ((attribute_type(endDate, :dateType)) OR (endDate > :today))`,
        ExpressionAttributeValues: {
          ":dateType": "NULL",
          ":today": today.toString(),
          ":ID": clinicId,
        },
      };
      const command = new ScanCommand(params);

      const data: ScanCommandOutput = await docClient.send(command);

      if (!data?.Items) {
        logger.info("No active clinic found");

        return false;
      } else if (data?.Items.length == 1) {
        logger.info("Clinic is active");

        return true;
      } else {
        logger.info(
          { resultCount: data.Items.length },
          "There was an error retrieving the clinic data",
        );

        return false;
      }
    } catch (error) {
      logger.error(error, `Error retrieving the clinic with 'clinicId': ${clinicId}`);
      throw error;
    }
  }

  toJson() {
    return {
      clinicId: this.clinicId,
      name: this.name,
      city: this.city,
      country: this.country,
      startDate: this.startDate,
      endDate: this.endDate,
      createdBy: this.createdBy,
    };
  }
}
