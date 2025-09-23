import { GetCommand, PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";

import awsClients from "../../shared/clients/aws";
import { logger } from "../../shared/logger";
import { Application } from "../../shared/models/application";
import { TaskStatus } from "../../shared/types/enum";

const { dynamoDBDocClient: docClient } = awsClients;

export abstract class IRadiologicalOutcome {
  applicationId: string;
  status: TaskStatus;

  xrayResult: string;
  xrayResultDetail: string;
  xrayMinorFindings: string[];
  xrayAssociatedMinorFindings: string[];
  xrayActiveTbFindings: string[];
  dateCreated: Date;

  constructor(details: IRadiologicalOutcome) {
    this.applicationId = details.applicationId;
    this.status = details.status;

    this.xrayResult = details.xrayResult;
    this.xrayResultDetail = details.xrayResultDetail;
    this.xrayMinorFindings = details.xrayMinorFindings;
    this.xrayAssociatedMinorFindings = details.xrayAssociatedMinorFindings;
    this.xrayActiveTbFindings = details.xrayActiveTbFindings;
    // Audit
    this.dateCreated = details.dateCreated;
  }
}

export class RadiologicalOutcome extends IRadiologicalOutcome {
  static readonly getPk = (applicationId: string) => Application.getPk(applicationId);

  static readonly sk = "APPLICATION#RADIOLOGICAL#OUTCOME";

  static readonly getTableName = () => process.env.APPLICATION_SERVICE_DATABASE_NAME;

  private constructor(details: IRadiologicalOutcome) {
    super(details);
  }

  private todbItem() {
    const dbItem = {
      ...this,
      dateCreated: this.dateCreated.toISOString(),
      pk: RadiologicalOutcome.getPk(this.applicationId),
      sk: RadiologicalOutcome.sk,
    };
    return dbItem;
  }

  static async createRadiologicalOutcome(
    details: Omit<IRadiologicalOutcome, "dateCreated" | "status">,
  ) {
    try {
      logger.info("Saving Radiological Outcome to DB");

      const updatedDetails: IRadiologicalOutcome = {
        ...details,
        dateCreated: new Date(),
        status: TaskStatus.completed,
      };

      const radiologicalOutcome = new RadiologicalOutcome(updatedDetails);

      const dbItem = radiologicalOutcome.todbItem();
      const params: PutCommandInput = {
        TableName: RadiologicalOutcome.getTableName(),
        Item: { ...dbItem },
        ConditionExpression: "attribute_not_exists(pk) AND attribute_not_exists(sk)",
      };
      const command = new PutCommand(params);
      const response = await docClient.send(command);

      logger.info({ response }, "Radiological Outcome saved successfully");

      return radiologicalOutcome;
    } catch (error) {
      logger.error(error, "Error saving radiological outcome");
      throw error;
    }
  }

  static async getByApplicationId(applicationId: string) {
    try {
      logger.info("fetching radiological outcome");

      const params = {
        TableName: RadiologicalOutcome.getTableName(),
        Key: {
          pk: RadiologicalOutcome.getPk(applicationId),
          sk: RadiologicalOutcome.sk,
        },
      };

      const command = new GetCommand(params);
      const data = await docClient.send(command);

      if (!data.Item) {
        logger.info("No radiological outcome found");
        return;
      }

      logger.info("Radiological Outcome fetched successfully");

      const dbItem = data.Item as ReturnType<RadiologicalOutcome["todbItem"]>;

      const radiologicalOutcome = new RadiologicalOutcome({
        ...dbItem,
        dateCreated: new Date(dbItem.dateCreated),
      });
      return radiologicalOutcome;
    } catch (error) {
      logger.error(error, "Error retrieving radiological outcome details");
      throw error;
    }
  }

  toJson() {
    return {
      applicationId: this.applicationId,
      status: this.status,
      xrayResult: this.xrayResult,
      xrayResultDetail: this.xrayResultDetail,
      xrayMinorFindings: this.xrayMinorFindings,
      xrayAssociatedMinorFindings: this.xrayAssociatedMinorFindings,
      xrayActiveTbFindings: this.xrayActiveTbFindings,
      // Audit
      dateCreated: this.dateCreated,
    };
  }
}
