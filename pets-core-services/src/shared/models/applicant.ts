import {
  GetCommand,
  PutCommand,
  PutCommandInput,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";

import { AllowedSex } from "../../applicant-service/types/enums";
import awsClients from "../clients/aws";
import { assertEnvExists } from "../config";
import { CountryCode } from "../country";
import { getDateWithoutTime } from "../date";
import { logger } from "../logger";
import { TaskStatus } from "../types/enum";
import { Application } from "./application";

const { dynamoDBDocClient: docClient } = awsClients;
export abstract class IApplicant {
  applicationId: string;

  passportNumber: string;
  countryOfIssue: CountryCode;
  passportId: string;

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
  dateCreated: Date;
  createdBy: string;
  status: TaskStatus;

  static readonly getPassportId = (countryOfIssue: CountryCode, passportNumber: string) =>
    `COUNTRY#${countryOfIssue}#PASSPORT#${passportNumber}`;

  constructor(details: ApplicantConstructorProps) {
    this.passportNumber = details.passportNumber;
    this.countryOfIssue = details.countryOfIssue;
    this.passportId = IApplicant.getPassportId(details.countryOfIssue, details.passportNumber);

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
    this.status = details.status;

    // Audit
    this.dateCreated = details.dateCreated;
    this.createdBy = details.createdBy;
  }
}

export type NewApplicant = Omit<
  IApplicant,
  "dateCreated" | "issueDate" | "expiryDate" | "dateOfBirth" | "passportId" | "status"
> & {
  issueDate: Date | string;
  expiryDate: Date | string;
  dateOfBirth: Date | string;
};

export type ApplicantConstructorProps = Omit<IApplicant, "passportId">;

export class Applicant extends IApplicant {
  static readonly getPk = (applicationId: string) => Application.getPk(applicationId);

  static readonly sk = "APPLICANT#DETAILS";

  static readonly getTableName = () => process.env.APPLICANT_SERVICE_DATABASE_NAME;

  private constructor(details: ApplicantConstructorProps) {
    super(details);
  }

  private todbItem() {
    const dbItem = {
      ...this,
      dateCreated: this.dateCreated.toISOString(),
      issueDate: this.issueDate.toISOString(),
      expiryDate: this.expiryDate.toISOString(),
      dateOfBirth: this.dateOfBirth.toISOString(),
      pk: Applicant.getPk(this.applicationId),
      sk: Applicant.sk,
    };
    return dbItem;
  }

  static async createNewApplicant(details: NewApplicant) {
    try {
      logger.info("Saving new applicant Information to DB");

      const updatedDetails: ApplicantConstructorProps = {
        ...details,
        dateCreated: new Date(),
        status: TaskStatus.completed,
        issueDate: new Date(details.issueDate),
        expiryDate: new Date(details.expiryDate),
        dateOfBirth: new Date(details.dateOfBirth),
      };

      const applicant = new Applicant(updatedDetails);

      const dbItem = applicant.todbItem();
      const params: PutCommandInput = {
        TableName: Applicant.getTableName(),
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

  static async getByApplicationId(applicationId: string) {
    try {
      logger.info("fetching applicant details");

      const params = {
        TableName: Applicant.getTableName(),
        Key: {
          pk: Applicant.getPk(applicationId),
          sk: Applicant.sk,
        },
      };

      const command = new GetCommand(params);
      const data = await docClient.send(command);

      if (!data.Item) {
        logger.info("No applicant details found");
        return;
      }

      logger.info("Applicant Details fetched successfully");

      const dbItem = data.Item as ReturnType<Applicant["todbItem"]>;

      return new Applicant({
        ...dbItem,
        dateCreated: new Date(dbItem.dateCreated),
        issueDate: new Date(dbItem.issueDate),
        expiryDate: new Date(dbItem.expiryDate),
        dateOfBirth: new Date(dbItem.dateOfBirth),
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
        TableName: Applicant.getTableName(),
        IndexName: assertEnvExists(process.env.PASSPORT_ID_INDEX),
        KeyConditionExpression: `passportId = :passportId`,
        ExpressionAttributeValues: {
          ":passportId": Applicant.getPassportId(countryOfIssue, passportNumber),
        },
      };

      const command = new QueryCommand(params);
      const data = await docClient.send(command);

      if (!data.Items) {
        logger.info("No applicants found");
        return [];
      }

      logger.info({ resultCount: data.Items.length }, "Applicant details fetched successfully");

      const results = data.Items as ReturnType<Applicant["todbItem"]>[];

      return results.map(
        (dbItem) =>
          new Applicant({
            ...dbItem,
            dateCreated: new Date(dbItem.dateCreated),
            issueDate: new Date(dbItem.issueDate),
            expiryDate: new Date(dbItem.expiryDate),
            dateOfBirth: new Date(dbItem.dateOfBirth),
          }),
      );
    } catch (error) {
      logger.error(error, "Error retrieving Applicants linked to passport id");
      throw error;
    }
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
      dateCreated: this.dateCreated,
      status: this.status,
    };
  }
}
