import { GetCommand, PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";

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

  constructor(details: IApplicant) {
    this.clinicId = details.clinicId;
    this.passportNumber = details.passportNumber;
    this.countryOfIssue = details.countryOfIssue;

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

  static readonly sk = "APPLICANT#DETAILS";

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
      sk: Applicant.sk,
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

  static async getByPassportNumber(countryOfIssue: CountryCode, passportNumber: string) {
    try {
      logger.info("fetching Applicant details");

      const params = {
        TableName: Applicant.getTableName(),
        Key: {
          pk: Applicant.getPk(countryOfIssue, passportNumber),
          sk: Applicant.sk,
        },
      };

      const command = new GetCommand(params);
      const data = await docClient.send(command);
      const applicantData = data.Item;

      if (!applicantData) {
        logger.info("No applicant details found");
        return;
      }

      logger.info("Applicant details fetched successfully");

      const dbItem = data.Item as ReturnType<Applicant["todbItem"]>;

      const applicantDetails = new Applicant({
        ...dbItem,
        dateCreated: new Date(dbItem.dateCreated),
        issueDate: new Date(dbItem.issueDate),
        expiryDate: new Date(dbItem.expiryDate),
        dateOfBirth: new Date(dbItem.dateOfBirth),
      });

      return new Applicant(applicantDetails);
    } catch (error) {
      logger.error(error, "Error retrieving Applicant details");
      throw error;
    }
  }

  toJson() {
    return {
      ...this,
      issueDate: getDateWithoutTime(this.issueDate),
      expiryDate: getDateWithoutTime(this.expiryDate),
      dateOfBirth: getDateWithoutTime(this.dateOfBirth),
    };
  }
}
