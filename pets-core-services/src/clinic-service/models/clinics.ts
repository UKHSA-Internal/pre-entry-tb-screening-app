import {
  GetCommand,
  GetCommandInput,
  GetCommandOutput,
  PutCommand,
  PutCommandInput,
  QueryCommand,
  QueryCommandInput,
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
  endDate?: Date | null;
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
  endDate?: Date | string | null;
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
        startDate:
          details.startDate && typeof details.startDate == "string"
            ? new Date(details.startDate)
            : new Date(),
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
      await docClient.send(command);

      logger.info("Clinic details saved successfully");

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
  static async getClinicById(clinicId: string): Promise<Clinic | void> {
    try {
      logger.info("fetching clinic details");

      const params: GetCommandInput = {
        TableName: Clinic.getTableName(),
        Key: {
          pk: Clinic.getPk(clinicId),
          sk: Clinic.sk,
        },
      };

      const command = new GetCommand(params);
      const data: GetCommandOutput = await docClient.send(command);

      if (!data?.Item?.name) {
        logger.info("No clinic details found");
        return;
      }

      logger.info("Clinic Details fetched successfully");

      const dbItem = data.Item as ReturnType<Clinic["todbItem"]>;

      return new Clinic({
        ...dbItem,
        startDate: dbItem.startDate,
        endDate: dbItem.endDate ? new Date(dbItem.endDate) : null,
      });
    } catch (error) {
      logger.error(error, `Error retrieving  clinic with 'clinicId': ${clinicId}`);
      throw error;
    }
  }

  /**
   * Returns true using the same rule as isActiveClinic(): a null endDate, or an
   * endDate that lexically sorts after now. startDate is deliberately not
   * considered, as in isActiveClinic(). Must be evaluated on the raw DynamoDB
   * attribute before any Date coercion, since that mapping turns an
   * empty-string endDate into null and would silently change the result.
   */
  static computeIsActive(rawEndDate: unknown): boolean {
    if (rawEndDate === null) return true;
    if (typeof rawEndDate !== "string") return false;
    return rawEndDate > new Date().toISOString();
  }

  /**
   * It gets all Clinics, paginating across every DynamoDB page so the result
   * is never silently truncated.
   * @returns array of Clinic objects with an isActive flag
   */
  static async getAllClinics(
    country: string | undefined,
  ): Promise<(Clinic & { isActive: boolean })[]> {
    try {
      logger.info(`Finding all clinics in '${process.env.CLINIC_SERVICE_DATABASE_NAME}'`);

      const items: Record<string, unknown>[] = [];
      let receivedItems = false;
      let exclusiveStartKey: Record<string, unknown> | undefined;

      do {
        const params: ScanCommandInput = {
          TableName: Clinic.getTableName(),
          ExclusiveStartKey: exclusiveStartKey,
        };
        if (country) {
          params.FilterExpression = "#cv = :countryVal";
          params.ExpressionAttributeNames = { "#cv": "country" };
          params.ExpressionAttributeValues = { ":countryVal": country };
        }
        const command = new ScanCommand(params);
        // eslint-disable-next-line no-await-in-loop
        const data: ScanCommandOutput = await docClient.send(command);

        receivedItems ||= !!data?.Items;
        items.push(...(data?.Items ?? []));
        exclusiveStartKey = data?.LastEvaluatedKey;
      } while (exclusiveStartKey);

      if (!receivedItems) {
        logger.info("No clinics found");
        return [];
      }

      logger.info({ resultCount: items.length }, "Clinics data fetched successfully");
      const results = items as unknown as ReturnType<Clinic["todbItem"]>[];

      return results.map((dbItem) => {
        const isActive = Clinic.computeIsActive(dbItem.endDate);
        const clinic = new Clinic({
          ...dbItem,
          startDate: new Date(dbItem.startDate),
          endDate: dbItem.endDate ? new Date(dbItem.endDate) : null,
        });
        return Object.assign(clinic, { isActive });
      });
    } catch (error) {
      logger.error(error, "Error retrieving clinics");
      throw error;
    }
  }

  /**
   * This return True for the clinic that endDate is null or grater than current date
   * @returns boolean
   */
  static async isActiveClinic(clinicId: string): Promise<boolean> {
    try {
      logger.info(`Fetching the clinic (${clinicId})`);
      const params: QueryCommandInput = {
        TableName: Clinic.getTableName(),
        KeyConditionExpression: `pk = :pk AND sk = :sk`,
        FilterExpression: `(attribute_type(endDate, :dateType)) OR (endDate > :today)`,
        ExpressionAttributeValues: {
          ":pk": Clinic.getPk(clinicId),
          ":sk": Clinic.sk,
          ":dateType": "NULL",
          ":today": new Date().toISOString(),
        },
      };
      const command = new QueryCommand(params);
      const data: QueryCommandOutput = await docClient.send(command);

      if (!data?.Items?.length) {
        logger.error(`No active clinic found with 'clinicId': ${clinicId}`);
        return false;
      }

      if (data?.Items?.length > 1) {
        logger.error(`Retrieved more than 1 clinic with the same 'clinicId': ${clinicId}`);
        return false;
      }

      logger.info(`The clinic with 'clinicId': ${clinicId} is active`);
      return true;
    } catch (error) {
      logger.error(error, `Error retrieving the active clinic with 'clinicId': ${clinicId}`);
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
