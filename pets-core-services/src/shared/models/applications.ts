import { QueryCommand, QueryCommandOutput } from "@aws-sdk/lib-dynamodb";

import awsClients from "../clients/aws";
import { assertEnvExists } from "../config";
import { CountryCode } from "../country";
import { DynamoBatchLoader } from "../helpers/batch-util";
import { logger } from "../logger";
import { ApplicationStatus, ApplicationStatusGroup } from "../types/enum";
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
  applicationStatusGroup: ApplicationStatusGroup;
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
  applicationStatusGroup: ApplicationStatusGroup;

  constructor(details: IApplicationRootProps) {
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

export interface ApplicationListResult {
  applications: ApplicationRoot[];
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
      applicationStatusGroup: item.applicationStatusGroup,
    });
  }

  static async getByClinicId(
    clinicId: string,
    limit = 100,
    cursor?: string,
  ): Promise<ApplicationListResult> {
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

      // Convert DB items → models
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const applications = (allItems || []).map((item) => ApplicationRoot.fromDynamo(item));

      // Batch load applicants
      const applicantMap = await DynamoBatchLoader.batchLoad({
        tableName: process.env.APPLICANT_SERVICE_DATABASE_NAME!,
        client: docClient,
        keys: applications.map((app) => ({
          pk: app.applicantId,
          sk: "APPLICANT#DETAILS",
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
