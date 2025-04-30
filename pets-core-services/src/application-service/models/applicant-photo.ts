import { GetObjectCommand } from "@aws-sdk/client-s3";
import { GetCommand, PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";
import { Readable } from "stream";

import awsClients from "../../shared/clients/aws";
import { assertEnvExists } from "../../shared/config";
import { logger } from "../../shared/logger";
import { Application } from "../../shared/models/application";
import { TaskStatus } from "../../shared/types/enum";

const { dynamoDBDocClient: docClient, s3Client: s3Client } = awsClients;
const IMAGE_BUCKET = assertEnvExists(process.env.IMAGE_BUCKET);

export abstract class IApplicantPhoto {
  applicationId: string;
  status: TaskStatus;
  applicantPhotoKey: string;
  applicantPhoto?: string;
  dateCreated: Date;
  createdBy: string;

  constructor(details: IApplicantPhoto) {
    this.applicationId = details.applicationId;
    this.applicantPhotoKey = details.applicantPhotoKey;
    this.applicantPhoto = details.applicantPhoto;
    this.status = details.status;

    // Audit
    this.dateCreated = details.dateCreated;
    this.createdBy = details.createdBy;
  }
}

export class ApplicantPhoto extends IApplicantPhoto {
  static readonly getPk = (applicationId: string) => Application.getPk(applicationId);

  static readonly sk = "APPLICATION#APPLICANT#PHOTO";

  static readonly getTableName = () => process.env.APPLICATION_SERVICE_DATABASE_NAME;

  private constructor(details: IApplicantPhoto) {
    super(details);
  }

  private todbItem() {
    const dbItem = {
      ...this,
      dateCreated: this.dateCreated.toISOString(),
      pk: ApplicantPhoto.getPk(this.applicationId),
      sk: ApplicantPhoto.sk,
    };
    return dbItem;
  }

  static async createApplicantPhotoDetails(
    details: Omit<IApplicantPhoto, "dateCreated" | "status">,
  ) {
    try {
      logger.info("Saving Applicant Photo Key to DB");

      const updatedDetails: IApplicantPhoto = {
        ...details,
        dateCreated: new Date(),
        status: TaskStatus.completed,
        // applicantPhoto: "",
      };

      const applicantPhoto = new ApplicantPhoto(updatedDetails);

      const dbItem = applicantPhoto.todbItem();
      const params: PutCommandInput = {
        TableName: ApplicantPhoto.getTableName(),
        Item: { ...dbItem },
        ConditionExpression: "attribute_not_exists(pk) AND attribute_not_exists(sk)",
      };
      const command = new PutCommand(params);
      const response = await docClient.send(command);

      logger.info({ response }, "Applicant Photo saved successfully");

      return applicantPhoto;
    } catch (error) {
      logger.error(error, "Error saving applicant photo");
      throw error;
    }
  }

  static async getByApplicationId(applicationId: string) {
    try {
      logger.info("fetching photo Details");

      const params = {
        TableName: ApplicantPhoto.getTableName(),
        Key: {
          pk: ApplicantPhoto.getPk(applicationId),
          sk: ApplicantPhoto.sk,
        },
      };

      const command = new GetCommand(params);
      const data = await docClient.send(command);
      const applicantPhoto = data.Item;

      if (!applicantPhoto) {
        logger.info("No Applicant Photo found");
        return;
      }

      logger.info("Applicant Photo details fetched successfully");

      const dbItem = applicantPhoto as ReturnType<ApplicantPhoto["todbItem"]>;

      const base64Image = await ApplicantPhoto.fetchImageAsBase64(
        IMAGE_BUCKET,
        dbItem.applicantPhotoKey,
      );

      const applicantPhotoDetails = new ApplicantPhoto({
        ...dbItem,
        applicantPhoto: base64Image,
        dateCreated: new Date(dbItem.dateCreated),
      });

      return applicantPhotoDetails;
    } catch (error) {
      logger.error(error, "Error retrieving Applicant Photo Details");
      throw error;
    }
  }

  static async streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on("data", (chunk) => chunks.push(chunk as Buffer));
      stream.on("end", () => resolve(Buffer.concat(chunks)));
      stream.on("error", reject);
    });
  }

  static async fetchImageAsBase64(bucket: string, key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    const response = await s3Client.send(command);

    if (!response.Body || !(response.Body instanceof Readable)) {
      throw new Error("Invalid S3 response body");
    }

    const buffer = await ApplicantPhoto.streamToBuffer(response.Body as Readable);
    const base64Image = buffer.toString("base64");
    return `data:${response.ContentType};base64,${base64Image}`;
  }

  toJson() {
    return {
      applicationId: this.applicationId,
      status: this.status,
      applicantPhotoKey: this.applicantPhotoKey,
      applicantPhoto: this.applicantPhoto,
      dateCreated: this.dateCreated,
    };
  }
}
