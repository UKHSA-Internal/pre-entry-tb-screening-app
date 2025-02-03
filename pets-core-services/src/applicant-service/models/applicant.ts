import { GetCommand, PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";

import awsClients from "../../shared/clients/aws";

interface IApplicantData {
  clinicId: string; // TODO: Account for this
  passportNumber: string;
  countryOfIssue: string;

  fullName: string;
  countryOfNationality: string;
  issueDate: string;
  expiryDate: string;
  dateOfBirth: string;
  sex: string;
  applicantHomeAddress1: string;
  applicantHomeAddress2?: string;
  townOrCity?: string;
  postcode: string;
}

const { dynamoDBDocClient: docClient } = awsClients;

export class Applicant {
  static getPk = (country: string, passportNumber: string) =>
    `COUNTRY#${country}#PASSPORT#${passportNumber}`;

  static readonly sk = "APPLICANT#DETAILS";

  static readonly TABLENAME = process.env.APPLICANT_SERVICE_DATABASE_NAME;

  constructor(public data: IApplicantData) {}

  async save() {
    // logger.info("Saving Applicant Information to DB");

    const { data } = this;

    const params: PutCommandInput = {
      TableName: Applicant.TABLENAME,
      Item: {
        ...data,
        pk: Applicant.getPk(data.countryOfIssue, data.passportNumber),
        sk: Applicant.sk,
      },
      ConditionExpression: "attribute_not_exists(pk) AND attribute_not_exists(sk)",
    };

    const command = new PutCommand(params);
    const response = await docClient.send(command);

    // logger.info("Applicant details saved successfully");
    return response;
  }

  static async getByPassportNumber(countryOfIssue: string, passportNumber: string) {
    try {
      // logger.info("fetching Applicant details");

      const params = {
        TableName: Applicant.TABLENAME,
        Key: {
          pk: Applicant.getPk(countryOfIssue, passportNumber),
          sk: Applicant.sk,
        },
      };

      const command = new GetCommand(params);
      const data = await docClient.send(command);
      const applicantData = data.Item;

      if (!applicantData) return;

      // logger.info("Applicant details fetched successfully");
      return new Applicant(data.Item as IApplicantData);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error, "Skipping logging ");
      // logger.error(error, "Error retrieving Applicant details");
      throw error;
    }
  }
}
