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

export abstract class MedicalScreeningBase {
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

  dateCreated: Date;
  createdBy: string;

  constructor(details: MedicalScreeningBase) {
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
    // Audit
    this.dateCreated = details.dateCreated;
    this.createdBy = details.createdBy;
  }
}
type IMedicalScreeningChestXray = {
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
  isXrayRequired: YesOrNo.Yes;

  dateCreated: Date;
  createdBy: string;
};

export type NewMedicalScreeningChestXray = Omit<
  IMedicalScreeningChestXray,
  "dateCreated" | "status" | "dateOfMedicalScreening"
> & {
  dateOfMedicalScreening: Date | string;
};

export class MedicalScreeningChestXray extends MedicalScreeningBase {
  isXrayRequired: YesOrNo.Yes;

  constructor(details: IMedicalScreeningChestXray) {
    super(details);
    this.isXrayRequired = details.isXrayRequired;
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
      // Audit
      dateCreated: this.dateCreated,
    };
  }
}

type IMedicalScreeningNoChestXray = {
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
  isXrayRequired: YesOrNo.No;
  reasonXrayNotRequired: ChestXRayNotTakenReason;
  reasonXrayNotRequiredFurthurDetails?: string;

  dateCreated: Date;
  createdBy: string;
};

export type NewMedicalScreeningNoChestXray = Omit<
  IMedicalScreeningNoChestXray,
  "dateCreated" | "status" | "dateOfMedicalScreening"
> & {
  dateOfMedicalScreening: Date | string;
};

export class MedicalScreeningNoChestXray extends MedicalScreeningBase {
  isXrayRequired: YesOrNo.No;
  reasonXrayNotRequired: ChestXRayNotTakenReason;
  reasonXrayNotRequiredFurthurDetails?: string;

  constructor(details: IMedicalScreeningNoChestXray) {
    super(details);
    this.isXrayRequired = details.isXrayRequired;
    this.reasonXrayNotRequired = details.reasonXrayNotRequired;
    this.reasonXrayNotRequiredFurthurDetails = details.reasonXrayNotRequiredFurthurDetails;
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
      reasonXrayNotRequiredFurthurDetails: this.reasonXrayNotRequiredFurthurDetails,
      // Audit
      dateCreated: this.dateCreated,
    };
  }
}

export class MedicalScreeningDbOps {
  static readonly getPk = (applicationId: string) => Application.getPk(applicationId);

  static readonly sk = "APPLICATION#MEDICAL#SCREENING";

  static readonly getTableName = () => process.env.APPLICATION_SERVICE_DATABASE_NAME;

  static async createMedicalScreening(
    details: NewMedicalScreeningChestXray | NewMedicalScreeningNoChestXray,
  ) {
    try {
      logger.info("Saving Medical Screening to DB");

      const updatedDetails = {
        ...details,
        dateOfMedicalScreening: new Date(details.dateOfMedicalScreening),
        dateCreated: new Date(),
        status: TaskStatus.completed,
      };

      const medicalScreening =
        details.isXrayRequired === YesOrNo.Yes
          ? new MedicalScreeningChestXray(updatedDetails as IMedicalScreeningChestXray)
          : new MedicalScreeningNoChestXray(updatedDetails as IMedicalScreeningNoChestXray);

      // new MedicalScreening(updatedDetails);

      const dbItem = MedicalScreeningDbOps.todbItem(medicalScreening);
      const params: PutCommandInput = {
        TableName: MedicalScreeningDbOps.getTableName(),
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

  static todbItem(medicalScreening: MedicalScreeningChestXray | MedicalScreeningNoChestXray) {
    const dbItem = {
      ...medicalScreening,
      dateOfMedicalScreening: medicalScreening.dateOfMedicalScreening.toISOString(),
      dateCreated: medicalScreening.dateCreated.toISOString(),
      pk: MedicalScreeningDbOps.getPk(medicalScreening.applicationId),
      sk: MedicalScreeningDbOps.sk,
    };
    return dbItem;
  }

  static async getByApplicationId(applicationId: string) {
    try {
      logger.info("fetching medical screening");

      const params = {
        TableName: MedicalScreeningDbOps.getTableName(),
        Key: {
          pk: MedicalScreeningDbOps.getPk(applicationId),
          sk: MedicalScreeningDbOps.sk,
        },
      };

      const command = new GetCommand(params);
      const data = await docClient.send(command);

      if (!data.Item) {
        logger.info("No medical screening found");
        return;
      }

      logger.info("Medical Screening fetched successfully");

      const medicalScreeningDbItem = data.Item as ReturnType<
        (typeof MedicalScreeningDbOps)["todbItem"]
      >;

      const medicalScreening =
        medicalScreeningDbItem.isXrayRequired === YesOrNo.Yes
          ? new MedicalScreeningChestXray({
              ...medicalScreeningDbItem,
              dateOfMedicalScreening: new Date(medicalScreeningDbItem.dateOfMedicalScreening),
              dateCreated: new Date(medicalScreeningDbItem.dateCreated),
            })
          : new MedicalScreeningNoChestXray({
              ...medicalScreeningDbItem,
              dateOfMedicalScreening: new Date(medicalScreeningDbItem.dateOfMedicalScreening),
              dateCreated: new Date(medicalScreeningDbItem.dateCreated),
            });
      return medicalScreeningDbItem.isXrayRequired === YesOrNo.Yes
        ? new MedicalScreeningChestXray(medicalScreening as IMedicalScreeningChestXray)
        : new MedicalScreeningNoChestXray(medicalScreening as IMedicalScreeningNoChestXray);
    } catch (error) {
      logger.error(error, "Error retrieving medical screening details");
      throw error;
    }
  }
}
