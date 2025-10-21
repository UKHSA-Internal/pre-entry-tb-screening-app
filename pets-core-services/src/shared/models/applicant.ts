import {
  GetCommand,
  PutCommand,
  PutCommandInput,
  QueryCommand,
  QueryCommandInput,
  UpdateCommand,
  UpdateCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { z } from "zod";

import { AllowedSex } from "../../applicant-service/types/enums";
import {
  ApplicantRequestSchema,
  ApplicantUpdateRequestSchema,
} from "../../applicant-service/types/zod-schema";
import awsClients from "../clients/aws";
import { assertEnvExists } from "../config";
import { CountryCode } from "../country";
import { getDateWithoutTime } from "../date";
import { logger } from "../logger";
import { TaskStatus } from "../types/enum";
import { Application } from "./application";

type AllApplicantTypes = AllowedSex | CountryCode | Date | TaskStatus | string;

const { dynamoDBDocClient: docClient } = awsClients;

type NewApplicantBase = z.infer<typeof ApplicantRequestSchema>;
type ApplicantUpdateBase = z.infer<typeof ApplicantUpdateRequestSchema>;

export abstract class ApplicantBase {
  applicationId!: string;

  fullName: string;
  countryOfNationality: CountryCode;
  issueDate: Date;
  expiryDate: Date;
  dateOfBirth: Date;
  sex: AllowedSex;
  applicantHomeAddress1: string;
  applicantHomeAddress2?: string;
  applicantHomeAddress3?: string;
  townOrCity?: string;
  provinceOrState: string;
  postcode: string;
  country: CountryCode;

  static readonly getPassportId = (countryOfIssue: CountryCode, passportNumber: string) =>
    `COUNTRY#${countryOfIssue}#PASSPORT#${passportNumber}`;

  constructor(details: ApplicantBase) {
    this.applicationId = details.applicationId;
    this.fullName = details.fullName;
    this.countryOfNationality = details.countryOfNationality;
    this.issueDate = details.issueDate;
    this.expiryDate = details.expiryDate;
    this.dateOfBirth = details.dateOfBirth;
    this.sex = details.sex;
    this.applicantHomeAddress1 = details.applicantHomeAddress1;
    this.applicantHomeAddress2 = details.applicantHomeAddress2;
    this.applicantHomeAddress3 = details.applicantHomeAddress3;
    this.provinceOrState = details.provinceOrState;
    this.townOrCity = details.townOrCity;
    this.postcode = details.postcode;
    this.country = details.country;
  }
}

export type UpdatedApplicant = ApplicantUpdateBase & {
  applicationId: string;
  updatedBy: string;
};

export type NewApplicant = NewApplicantBase & {
  applicationId: string;
  createdBy: string;
};

export class Applicant extends ApplicantBase {
  passportNumber: string;
  countryOfIssue: CountryCode;
  dateCreated: Date;
  createdBy: string;
  status?: TaskStatus;

  constructor(details: NewApplicant & { dateCreated: Date | string }) {
    super({
      ...details,
      issueDate: new Date(details.issueDate),
      expiryDate: new Date(details.expiryDate),
      dateOfBirth: new Date(details.dateOfBirth),
    });
    this.passportNumber = details.passportNumber;
    this.countryOfIssue = details.countryOfIssue;
    this.createdBy = details.createdBy;
    this.dateCreated = new Date(details.dateCreated);
  }
  toJson() {
    return {
      applicationId: this.applicationId,

      passportNumber: this.passportNumber,
      countryOfIssue: this.countryOfIssue,

      fullName: this.fullName,
      countryOfNationality: this.countryOfNationality,
      issueDate: getDateWithoutTime(this.issueDate),
      expiryDate: getDateWithoutTime(this.expiryDate),
      dateOfBirth: getDateWithoutTime(this.dateOfBirth),
      sex: this.sex,
      applicantHomeAddress1: this.applicantHomeAddress1,
      applicantHomeAddress2: this.applicantHomeAddress2,
      applicantHomeAddress3: this.applicantHomeAddress3,
      provinceOrState: this.provinceOrState,
      townOrCity: this.townOrCity,
      postcode: this.postcode,
      country: this.country,
    };
  }
}

export type ApplicantUpdateConstructorProps = Omit<
  ApplicantBase,
  "passportNumber" | "countryOfIssue"
> & { dateUpdated: Date; updatedBy: string };

export class ApplicantUpdate extends ApplicantBase {
  dateUpdated: Date;
  updatedBy: string;

  constructor(details: ApplicantUpdateConstructorProps) {
    super(details);
    this.dateUpdated = details.dateUpdated;
    this.updatedBy = details.updatedBy;
  }

  toJson() {
    // Copy everything from this
    const json = { ...this } as unknown as Record<string, AllApplicantTypes>;

    return {
      ...json,
      issueDate: getDateWithoutTime(this.issueDate),
      expiryDate: getDateWithoutTime(this.expiryDate),
      dateOfBirth: getDateWithoutTime(this.dateOfBirth),
    };
  }
}

export class ApplicantDbOps {
  static readonly getPk = (applicationId: string) => Application.getPk(applicationId);
  static readonly sk = "APPLICANT#DETAILS";
  static readonly getTableName = () => process.env.APPLICANT_SERVICE_DATABASE_NAME;

  static todbItem(
    applicant: ApplicantBase & {
      passportNumber: string;
      countryOfIssue: CountryCode;
      status?: TaskStatus;
      dateCreated: Date;
      createdBy: string;
      dateUpdated?: Date;
      updatedBy?: string;
    },
  ) {
    const dbItem = {
      ...applicant,
      dateCreated: applicant.dateCreated.toISOString(),
      issueDate: applicant.issueDate.toISOString(),
      expiryDate: applicant.expiryDate.toISOString(),
      dateOfBirth: applicant.dateOfBirth.toISOString(),
      passportId: ApplicantBase.getPassportId(applicant.countryOfIssue, applicant.passportNumber),
      pk: this.getPk(applicant.applicationId),
      sk: this.sk,
    };
    return dbItem;
  }

  static async createNewApplicant(details: NewApplicant) {
    try {
      logger.info("Saving new applicant Information to DB");

      const updatedDetails: NewApplicant & { dateCreated: Date | string } = {
        ...details,
        dateCreated: new Date(),
      };

      const applicant = new Applicant(updatedDetails);

      const dbItem = ApplicantDbOps.todbItem(applicant);
      const params: PutCommandInput = {
        TableName: this.getTableName(),
        Item: { ...dbItem },
        ConditionExpression: "attribute_not_exists(pk) AND attribute_not_exists(sk)",
      };
      const command = new PutCommand(params);
      const response = await docClient.send(command);

      logger.info({ response }, "Applicant details saved successfully");

      return applicant;
    } catch (error) {
      logger.error(error, "Error saving new applicant details");
      throw error;
    }
  }

  private static createUpdateExpressions(item: { [key: string]: AllApplicantTypes }) {
    const updateExpression: string[] = [];
    const expressionAttribute: Record<string, AllApplicantTypes> = {};
    const expressionAttributeNames: Record<string, string> = {};

    for (const [key, value] of Object.entries(item)) {
      const nameKey = `#${key}`;
      const valueKey = `:${key}`;
      updateExpression.push(`${nameKey} = ${valueKey}`);
      expressionAttribute[valueKey] = value;
      expressionAttributeNames[nameKey] = key;
    }
    return { updateExpression, expressionAttribute, expressionAttributeNames };
  }

  static async updateApplicant(details: UpdatedApplicant) {
    try {
      logger.info("Updating applicant Information to DB");

      const pk = this.getPk(details.applicationId);
      const sk = this.sk;

      // Clean up: remove undefined fields before building update expression
      const fieldsToUpdate = Object.entries(details).reduce(
        (acc, [key, value]) => {
          if (value !== undefined) acc[key] = value;
          return acc;
        },
        {} as Record<string, AllApplicantTypes>,
      );

      fieldsToUpdate.dateUpdated = new Date().toISOString();

      const { updateExpression, expressionAttribute, expressionAttributeNames } =
        this.createUpdateExpressions(fieldsToUpdate);

      const params: UpdateCommandInput = {
        TableName: this.getTableName(),
        Key: { pk, sk },
        UpdateExpression: `SET ${updateExpression.join(", ")}`,
        ExpressionAttributeValues: expressionAttribute,
        ExpressionAttributeNames: expressionAttributeNames,
        ReturnValues: "ALL_NEW", // Return updated item
        ConditionExpression: "attribute_exists(pk) AND attribute_exists(sk)",
      };
      const command = new UpdateCommand(params);
      const response = await docClient.send(command);
      const attrs = response.Attributes;

      if (!attrs) throw new Error("Applicant update failed");

      logger.info({ response }, "Applicant details updated successfully");
      const applicant = new ApplicantUpdate({
        applicationId: attrs?.applicationId as string,

        fullName: attrs?.fullName as string,
        countryOfNationality: attrs?.countryOfNationality as CountryCode,
        issueDate: new Date(attrs?.issueDate as string),
        expiryDate: new Date(attrs?.expiryDate as string),
        dateOfBirth: new Date(attrs?.dateOfBirth as string),
        sex: attrs?.sex as AllowedSex,
        applicantHomeAddress1: attrs?.applicantHomeAddress1 as string,
        applicantHomeAddress2: attrs?.applicantHomeAddress2 as string,
        applicantHomeAddress3: attrs?.applicantHomeAddress3 as string,
        townOrCity: attrs?.townOrCity as string,
        provinceOrState: attrs?.provinceOrState as string,
        postcode: attrs?.postcode as string,
        country: attrs?.country as CountryCode,

        dateUpdated: new Date(attrs?.dateUpdated as string),
        updatedBy: attrs?.updatedBy as string,
      });

      return applicant;
    } catch (error) {
      logger.error(error, "Error updating applicant details");
      throw error;
    }
  }

  static async getByApplicationId(applicationId: string) {
    try {
      logger.info("fetching applicant details");

      const params = {
        TableName: this.getTableName(),
        Key: {
          pk: this.getPk(applicationId),
          sk: this.sk,
        },
      };

      const command = new GetCommand(params);
      const data = await docClient.send(command);

      if (!data.Item) {
        logger.info("No applicant details found");
        return;
      }

      logger.info("Applicant Details fetched successfully");

      const dbItem = data.Item as ReturnType<(typeof ApplicantDbOps)["todbItem"]>;

      return new Applicant({
        ...dbItem,
        townOrCity: dbItem.townOrCity as string,
        dateCreated: new Date(dbItem.dateCreated),
      });
    } catch (error) {
      logger.error(error, "Error retrieving applicant details");
      throw error;
    }
  }

  static async findByPassportId(countryOfIssue: CountryCode, passportNumber: string) {
    try {
      logger.info("Finding all applicant details linked to Passport ID");

      const params: QueryCommandInput = {
        TableName: this.getTableName(),
        IndexName: assertEnvExists(process.env.PASSPORT_ID_INDEX),
        KeyConditionExpression: `passportId = :passportId`,
        ExpressionAttributeValues: {
          ":passportId": ApplicantBase.getPassportId(countryOfIssue, passportNumber),
        },
      };

      const command = new QueryCommand(params);
      const data = await docClient.send(command);

      if (!data.Items || (data.Items && data.Items?.length < 1)) {
        logger.info("No applicants found");
        return [];
      }

      logger.info({ resultCount: data.Items.length }, "Applicant details fetched successfully");

      const results = data.Items as ReturnType<(typeof ApplicantDbOps)["todbItem"]>[];

      return results.map(
        (dbItem) =>
          new Applicant({
            ...dbItem,
            townOrCity: dbItem.townOrCity as string,
            dateCreated: new Date(dbItem.dateCreated),
          }),
      );
    } catch (error) {
      logger.error(error, "Error retrieving Applicants linked to passport id");
      throw error;
    }
  }
}
