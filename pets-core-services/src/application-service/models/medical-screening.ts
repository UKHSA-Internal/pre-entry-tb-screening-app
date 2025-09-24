import { GetCommand, PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";

import awsClients from "../../shared/clients/aws";
import { logger } from "../../shared/logger";
import { Application } from "../../shared/models/application";
import { TaskStatus } from "../../shared/types/enum";
import {
  ChestXRayNotTakenReason,
  HistoryOfConditionsUnder11,
  MenstrualPeriods,
  PregnancyStatus,
  TbSymptomsOptions,
  YesOrNo,
} from "../types/enums";

const { dynamoDBDocClient: docClient } = awsClients;

export abstract class IMedicalScreening {
  applicationId: string;
  status: TaskStatus;

  dateOfMedicalScreening: Date;
  age: number;
  symptomsOfTb: YesOrNo;
  symptoms: TbSymptomsOptions[];
  symptomsOther?: string;
  historyOfConditionsUnder11: HistoryOfConditionsUnder11[];
  historyOfConditionsUnder11Details?: string;
  historyOfPreviousTb: YesOrNo;
  previousTbDetails?: string;
  contactWithPersonWithTb: YesOrNo;
  contactWithTbDetails?: string;
  pregnant: PregnancyStatus;
  haveMenstralPeriod: MenstrualPeriods;
  physicalExaminationNotes: string;
  isXrayRequired: YesOrNo;
  reasonXrayNotRequired?: ChestXRayNotTakenReason;

  dateCreated: Date;
  createdBy: string;

  constructor(details: IMedicalScreening) {
    this.applicationId = details.applicationId;
    this.status = details.status;

    this.dateOfMedicalScreening = details.dateOfMedicalScreening;
    this.age = details.age;
    this.symptomsOfTb = details.symptomsOfTb;
    this.symptoms = details.symptoms;
    this.symptomsOther = details.symptomsOther;
    this.historyOfConditionsUnder11 = details.historyOfConditionsUnder11;
    this.historyOfConditionsUnder11Details = details.historyOfConditionsUnder11Details;
    this.historyOfPreviousTb = details.historyOfPreviousTb;
    this.previousTbDetails = details.previousTbDetails;
    this.contactWithPersonWithTb = details.contactWithPersonWithTb;
    this.contactWithTbDetails = details.contactWithTbDetails;
    this.pregnant = details.pregnant;
    this.haveMenstralPeriod = details.haveMenstralPeriod;
    this.physicalExaminationNotes = details.physicalExaminationNotes;
    this.isXrayRequired = details.isXrayRequired;
    this.reasonXrayNotRequired = details.reasonXrayNotRequired;
    // Audit
    this.dateCreated = details.dateCreated;
    this.createdBy = details.createdBy;
  }
}

export type NewMedicalScreening = Omit<
  IMedicalScreening,
  "dateCreated" | "status" | "dateOfMedicalScreening"
> & {
  dateOfMedicalScreening: Date | string;
};

export class MedicalScreening extends IMedicalScreening {
  static readonly getPk = (applicationId: string) => Application.getPk(applicationId);

  static readonly sk = "APPLICATION#MEDICAL#SCREENING";

  static readonly getTableName = () => process.env.APPLICATION_SERVICE_DATABASE_NAME;

  private constructor(details: IMedicalScreening) {
    super(details);
  }

  private todbItem() {
    const dbItem = {
      ...this,
      dateOfMedicalScreening: this.dateOfMedicalScreening.toISOString(),
      dateCreated: this.dateCreated.toISOString(),
      pk: MedicalScreening.getPk(this.applicationId),
      sk: MedicalScreening.sk,
    };
    return dbItem;
  }

  static async createMedicalScreening(details: NewMedicalScreening) {
    try {
      logger.info("Saving Medical Screening to DB");

      const updatedDetails: IMedicalScreening = {
        ...details,
        dateOfMedicalScreening: new Date(details.dateOfMedicalScreening),
        dateCreated: new Date(),
        status: TaskStatus.completed,
      };

      const medicalScreening = new MedicalScreening(updatedDetails);

      const dbItem = medicalScreening.todbItem();
      const params: PutCommandInput = {
        TableName: MedicalScreening.getTableName(),
        Item: { ...dbItem },
        ConditionExpression: "attribute_not_exists(pk) AND attribute_not_exists(sk)",
      };
      const command = new PutCommand(params);
      const response = await docClient.send(command);

      logger.info({ response }, "Medical Screening saved successfully");

      return medicalScreening;
    } catch (error) {
      logger.error(error, "Error saving medical Screening");
      throw error;
    }
  }

  static async getByApplicationId(applicationId: string) {
    try {
      logger.info("fetching medical screening");

      const params = {
        TableName: MedicalScreening.getTableName(),
        Key: {
          pk: MedicalScreening.getPk(applicationId),
          sk: MedicalScreening.sk,
        },
      };

      const command = new GetCommand(params);
      const data = await docClient.send(command);

      if (!data.Item) {
        logger.info("No medical screening found");
        return;
      }

      logger.info("Medical Screening fetched successfully");

      const dbItem = data.Item as ReturnType<MedicalScreening["todbItem"]>;

      const medicalScreening = new MedicalScreening({
        ...dbItem,
        dateOfMedicalScreening: new Date(dbItem.dateOfMedicalScreening),
        dateCreated: new Date(dbItem.dateCreated),
      });
      return medicalScreening;
    } catch (error) {
      logger.error(error, "Error retrieving medical screening details");
      throw error;
    }
  }

  toJson() {
    return {
      applicationId: this.applicationId,
      status: this.status,
      dateOfMedicalScreening: this.dateOfMedicalScreening,
      age: this.age,
      symptomsOfTb: this.symptomsOfTb,
      symptoms: this.symptoms,
      symptomsOther: this.symptomsOther,
      historyOfConditionsUnder11: this.historyOfConditionsUnder11,
      historyOfConditionsUnder11Details: this.historyOfConditionsUnder11Details,
      historyOfPreviousTb: this.historyOfPreviousTb,
      previousTbDetails: this.previousTbDetails,
      contactWithPersonWithTb: this.contactWithPersonWithTb,
      contactWithTbDetails: this.contactWithTbDetails,
      pregnant: this.pregnant,
      haveMenstralPeriod: this.haveMenstralPeriod,
      physicalExaminationNotes: this.physicalExaminationNotes,
      isXrayRequired: this.isXrayRequired,
      reasonXrayNotRequired: this.reasonXrayNotRequired,
      // Audit
      dateCreated: this.dateCreated,
    };
  }
}
