import { QueryCommand, QueryCommandOutput } from "@aws-sdk/lib-dynamodb";

import awsClients from "../../shared/clients/aws";
import { assertEnvExists } from "../../shared/config";
import { CountryCode } from "../../shared/country";
import { logger } from "../../shared/logger";
import { Applicant, ApplicantBase } from "../../shared/models/applicant";
import { ApplicationStatus, ApplicationStatusGroup } from "../../shared/types/enum";
import { DynamoBatchLoader } from "../helpers/dynamo-batch-util";

const { dynamoDBDocClient: docClient } = awsClients;

export interface IDashboardApplicationProps {
  applicationId: string;
  applicantId: string;
  applicantName?: string;
  passportNumber: string;
  countryOfIssue: CountryCode;
  clinicId: string;
  dateCreated: Date | string;
  applicationStatus: ApplicationStatus;
  applicationStatusGroup: ApplicationStatusGroup;
}

export abstract class IDashboardApplication {
  readonly applicationId: string;
  applicantId: string;
  passportNumber: string;
  countryOfIssue: CountryCode;
  applicantName?: string;
  clinicId: string;
  dateCreated: Date;
  applicationStatus: ApplicationStatus;
  applicationStatusGroup: ApplicationStatusGroup;

  constructor(details: IDashboardApplicationProps) {
    this.applicationId = details.applicationId;
    this.applicantId = details.applicantId;
    this.applicantName = details.applicantName;
    this.passportNumber = details.passportNumber;
    this.countryOfIssue = details.countryOfIssue;
    this.clinicId = details.clinicId;
    this.dateCreated = new Date(details.dateCreated);
    this.applicationStatus = details.applicationStatus;
    this.applicationStatusGroup = details.applicationStatusGroup;
  }
}

export interface DashboardApplicationsList {
  applications: DashboardApplication[];
  cursor: string | null;
}

export class DashboardApplication extends IDashboardApplication {
  static readonly getTableName = () => process.env.APPLICATION_SERVICE_DATABASE_NAME!;

  static fromDynamo(item: Record<string, any>): DashboardApplication {
    return new DashboardApplication({
      applicationId: item.applicationId,
      applicantId: item.applicantId,
      passportNumber: item.passportNumber,
      countryOfIssue: item.countryOfIssue,
      clinicId: item.clinicId,
      dateCreated: item.dateCreated,
      applicationStatus: item.applicationStatus,
      applicationStatusGroup: item.applicationStatusGroup,
    });
  }

  static async getByClinicId(
    clinicId: string,
    limit = 100,
    cursor?: string,
  ): Promise<DashboardApplicationsList> {
    try {
      logger.info(`Fetching applications by clinicId ${clinicId}`);
      const allItems: any[] = [];
      let lastEvaluatedKey: Record<string, any> | undefined = undefined;
      let result: QueryCommandOutput;
      const lastKey = cursor ? JSON.parse(Buffer.from(cursor, "base64").toString()) : undefined;
      logger.info(lastKey);
      do {
        result = await docClient.send(
          new QueryCommand({
            TableName: this.getTableName(),
            IndexName: assertEnvExists(process.env.CLINIC_ID_INDEX),
            KeyConditionExpression: "clinicId = :clinicId  AND applicationStatusGroup = :status",
            ExpressionAttributeValues: {
              ":clinicId": clinicId,
              ":status": ApplicationStatusGroup.incomplete,
            },
            Limit: limit,
            ExclusiveStartKey: lastEvaluatedKey,
            ScanIndexForward: false,
          }),
        );
        allItems.push(...(result?.Items ?? []));
        lastEvaluatedKey = result?.LastEvaluatedKey;
      } while (lastEvaluatedKey);

      // Convert DB items  to model

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const applications = (allItems || []).map((item) => DashboardApplication.fromDynamo(item));

      // Batch load applicants
      const applicantMap = await DynamoBatchLoader.batchLoad({
        tableName: process.env.APPLICANT_SERVICE_DATABASE_NAME!,
        client: docClient,
        keys: applications.map((app) => ({
          pk: ApplicantBase.getPassportId(app.countryOfIssue, app.passportNumber),
          sk: "APPLICANT#DETAILS",
        })),
        mapItem: (item) => Applicant.fromDb(item),
        mapKey: (item) => ApplicantBase.getPassportId(item.countryOfIssue, item.passportNumber),
      });

      // Add applicantName
      const enriched = applications.map((app) => {
        const applicant = applicantMap.get(
          ApplicantBase.getPassportId(app.countryOfIssue, app.passportNumber),
        ) as Applicant;
        return new DashboardApplication({
          ...app,
          applicantName: applicant.fullName,
        });
      });

      //Encode cursor
      const nextCursor = result.LastEvaluatedKey
        ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString("base64")
        : null;

      return {
        applications: enriched,
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
      applicantName: this.applicantName,
      passportNumber: this.passportNumber,
      countryOfIssue: this.countryOfIssue,
      clinicId: this.clinicId,
      dateCreated: this.dateCreated.toISOString(),
      applicationStatus: this.applicationStatus,
      applicationStatusGroup: this.applicationStatusGroup,
    };
  }
}
