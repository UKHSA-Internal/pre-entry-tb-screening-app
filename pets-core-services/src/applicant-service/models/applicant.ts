import {
  PutCommand,
  PutCommandInput,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";

import awsClients from "../../shared/clients/aws";
import { CountryCode } from "../../shared/country";
import { getDateWithoutTime } from "../../shared/date";
import { logger } from "../../shared/logger";
import { AllowedSex } from "../types/enums";

const { dynamoDBDocClient: docClient } = awsClients;
export abstract class IApplicant {
  clinicId: string;
  passportNumber: string;
  countryOfIssue: CountryCode;

  applicationId: string;
  fullName: string;
  countryOfNationality: CountryCode;
  issueDate: Date;
  expiryDate: Date;
  dateOfBirth: Date;
  sex: AllowedSex;
  applicantHomeAddress1: string;
  applicantHomeAddress2?: string;
  townOrCity?: string;
  provinceOrState: string;
  postcode: string;
  country: CountryCode;
  dateCreated: Date;
  // TODO: Createdby
  constructor(details: IApplicant) {
    this.clinicId = details.clinicId;
    this.passportNumber = details.passportNumber;
    this.countryOfIssue = details.countryOfIssue;

    this.applicationId = details.applicationId;
    this.fullName = details.fullName;
    this.countryOfNationality = details.countryOfNationality;
    this.issueDate = details.issueDate;
    this.expiryDate = details.expiryDate;
    this.dateOfBirth = details.dateOfBirth;
    this.sex = details.sex;
    this.applicantHomeAddress1 = details.applicantHomeAddress1;
    this.applicantHomeAddress2 = details.applicantHomeAddress2;
    this.provinceOrState = details.provinceOrState;
    this.townOrCity = details.townOrCity;
    this.postcode = details.postcode;
    this.country = details.country;
    this.dateCreated = details.dateCreated;
  }
}

export type NewApplicant = Omit<
  IApplicant,
  "dateCreated" | "issueDate" | "expiryDate" | "dateOfBirth"
> & {
  issueDate: Date | string;
  expiryDate: Date | string;
  dateOfBirth: Date | string;
};

export class Applicant extends IApplicant {
  static readonly getPk = (country: string, passportNumber: string) =>
    `COUNTRY#${country}#PASSPORT#${passportNumber}`;

  static readonly skPrefix = "APPLICANT#DETAILS";
  static readonly getSk = (applicationId: string) => `${Applicant.skPrefix}#${applicationId}`;

  static readonly getTableName = () => process.env.APPLICANT_SERVICE_DATABASE_NAME;

  private constructor(details: IApplicant) {
    super(details);
  }

  private todbItem() {
    const dbItem = {
      ...this,
      dateCreated: this.dateCreated.toISOString(),
      issueDate: this.issueDate.toISOString(),
      expiryDate: this.expiryDate.toISOString(),
      dateOfBirth: this.dateOfBirth.toISOString(),
      pk: Applicant.getPk(this.countryOfIssue, this.passportNumber),
      sk: Applicant.getSk(this.applicationId),
    };
    return dbItem;
  }

  static async createNewApplicant(details: NewApplicant) {
    try {
      logger.info("Saving new applicant Information to DB");

      const updatedDetails: IApplicant = {
        ...details,
        dateCreated: new Date(),
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

  static async findByPassportNumber(countryOfIssue: CountryCode, passportNumber: string) {
    try {
      logger.info("Finding all applicant details linked to Passport number");

      const params: QueryCommandInput = {
        TableName: Applicant.getTableName(),
        KeyConditionExpression: `pk = :pk AND begins_with(sk, :skPrefix)`,
        ExpressionAttributeValues: {
          ":pk": Applicant.getPk(countryOfIssue, passportNumber),
          ":skPrefix": Applicant.skPrefix,
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
      logger.error(error, "Error retrieving Applicants linked to passport number");
      throw error;
    }
  }

  toJson() {
    return {
      clinicId: this.clinicId,
      passportNumber: this.passportNumber,
      countryOfIssue: this.countryOfIssue,
      applicationId: this.applicationId,
      fullName: this.fullName,
      countryOfNationality: this.countryOfNationality,
      issueDate: getDateWithoutTime(this.issueDate),
      expiryDate: getDateWithoutTime(this.expiryDate),
      dateOfBirth: getDateWithoutTime(this.dateOfBirth),
      sex: this.sex,
      applicantHomeAddress1: this.applicantHomeAddress1,
      applicantHomeAddress2: this.applicantHomeAddress2,
      provinceOrState: this.provinceOrState,
      townOrCity: this.townOrCity,
      postcode: this.postcode,
      country: this.country,
      dateCreated: this.dateCreated,
    };
  }
}
