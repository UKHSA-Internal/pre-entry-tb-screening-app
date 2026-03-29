import { QueryCommand } from "@aws-sdk/lib-dynamodb";

import awsClients from "../clients/aws";
import { CountryCode } from "../country";
import { DynamoBatchLoader } from "../helpers/batch-util";
import { logger } from "../logger";
import { ApplicationStatus } from "../types/enum";
import { Applicant, ApplicantBase } from "./applicant";

const { dynamoDBDocClient: docClient } = awsClients;

export interface IApplicationRootProps {
  applicationId: string;
  applicantId: string;
  applicantName?: string;
  passportNumber: string;
  countryOfIssue: CountryCode;
  clinicId: string;
  dateCreated: Date | string;
  applicationStatus: ApplicationStatus;
}

export abstract class IApplicationRoot {
  readonly applicationId: string;
  applicantId: string;
  passportNumber: string;
  countryOfIssue: CountryCode;
  applicantName?: string;
  clinicId: string;
  dateCreated: Date;
  applicationStatus: ApplicationStatus;

  constructor(details: IApplicationRootProps) {
    this.applicationId = details.applicationId;
    this.applicantId = details.applicantId;
    this.applicantName = details.applicantName;
    this.passportNumber = details.passportNumber;
    this.countryOfIssue = details.countryOfIssue;
    this.clinicId = details.clinicId;
    this.dateCreated = new Date(details.dateCreated);
    this.applicationStatus = details.applicationStatus;
  }
}

export interface ApplicationListResult {
  items: ApplicationRoot[];
  cursor: string | null;
}

export class ApplicationRoot extends IApplicationRoot {
  static readonly getTableName = () => process.env.APPLICATION_SERVICE_DATABASE_NAME!;

  constructor(details: IApplicationRootProps) {
    super(details);
  }

  static fromDynamo(item: Record<string, any>): ApplicationRoot {
    return new ApplicationRoot({
      applicationId: item.applicationId,
      applicantId: item.applicantId,
      passportNumber: item.passportNumber,
      countryOfIssue: item.countryOfIssue,
      clinicId: item.clinicId,
      dateCreated: item.dateCreated,
      applicationStatus: item.applicationStatus,
    });
  }

  static async getByClinicId(
    clinicId: string,
    limit = 100,
    cursor?: string,
  ): Promise<ApplicationListResult> {
    try {
      logger.info(`Fetching applications by clinicId ${clinicId}`);

      const lastKey = cursor ? JSON.parse(Buffer.from(cursor, "base64").toString()) : undefined;

      const result = await docClient.send(
        new QueryCommand({
          TableName: this.getTableName(),
          IndexName: "CLINIC_ID_INDEX",
          KeyConditionExpression: "clinicId = :clinicId  AND applicationStatus = :status",
          ExpressionAttributeValues: {
            ":clinicId": clinicId,
            ":status": ApplicationStatus.inProgress,
          },
          Limit: limit,
          ExclusiveStartKey: lastKey,
          ScanIndexForward: false,
        }),
      );

      // Convert DB items → models
      const applications = (result.Items || []).map((item) => ApplicationRoot.fromDynamo(item));

      // Batch load applicants
      const applicantMap = await DynamoBatchLoader.batchLoad({
        tableName: process.env.APPLICANT_SERVICE_DATABASE_NAME!,
        client: docClient,
        keys: applications.map((app) => ({
          applicantId: app.applicantId,
        })),
        mapItem: (item) => Applicant.fromDb(item),
        mapKey: (item) => ApplicantBase.getPassportId(item.countryOfIssue, item.passportNumber),
      });

      // Add applicantName

      const enriched = applications.map((app) => {
        const applicant = applicantMap.get(app.applicantId) as Applicant;
        return new ApplicationRoot({
          ...app,
          applicantName: applicant.fullName,
        });
      });
      //Encode cursor
      const nextCursor = result.LastEvaluatedKey
        ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString("base64")
        : null;

      return {
        items: enriched,
        cursor: nextCursor,
      };
    } catch (error) {
      logger.error(error, "Error retrieving applications by clinicId");
      throw error;
    }
  }

  toJson() {
    return {
      applicationId: this.applicationId,
      applicantId: this.applicantId,
      applicantName: this.applicantName,
      passportNumber: this.passportNumber,
      countryOfIssue: this.countryOfIssue,
      clinicId: this.clinicId,
      dateCreated: this.dateCreated.toISOString(),
      applicationStatus: this.applicationStatus,
    };
  }
}
