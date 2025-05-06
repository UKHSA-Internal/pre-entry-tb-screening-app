import { logger } from "../../shared/logger";
import { Applicant } from "../../shared/models/applicant";
import { getImageBucket, ImageHelper } from "../helpers/image-helper";
import { generateImageObjectkey } from "../helpers/upload";
import { ImageType } from "../types/enums";
const bucket = getImageBucket();

export abstract class IApplicantPhoto {
  applicantPhoto: string;
  constructor(details: IApplicantPhoto) {
    this.applicantPhoto = details.applicantPhoto;
  }
}
export class ApplicantPhoto extends IApplicantPhoto {
  static async getByApplicationId(applicationId: string, clinicId: string) {
    try {
      logger.info("fetching photo Details");
      const applicant = await Applicant.getByApplicationId(applicationId);
      if (!applicant) {
        logger.error("Application does not have an applicant");
        return;
      }
      const objectKey = generateImageObjectkey({
        applicant,
        clinicId,
        fileName: "applicant-photo",
        imageType: ImageType.Photo,
        applicationId,
      });
      const applicantPhoto = await ImageHelper.fetchImageAsBase64(bucket, objectKey);
      if (!applicantPhoto) {
        logger.info("Applicant Photo not found");
        return;
      }
      logger.info("Applicant Photo fetched successfully");
      return applicantPhoto;
    } catch (error) {
      logger.error(error, "Error retrieving Applicant Photo Details");
      throw error;
    }
  }
  // static async streamToBuffer(stream: Readable): Promise<Buffer> {
  //   return new Promise((resolve, reject) => {
  //     const chunks: Buffer[] = [];
  //     stream.on("data", (chunk) => chunks.push(chunk as Buffer));
  //     stream.on("end", () => resolve(Buffer.concat(chunks)));
  //     stream.on("error", reject);
  //   });
  // }
  // static async fetchImageAsBase64(bucket: string, key: string): Promise<string | null> {
  //   try {
  //     const listCommand = new ListObjectsV2Command({
  //       Bucket: bucket,
  //       Prefix: key,
  //       MaxKeys: 1,
  //     });
  //     const listResult = await s3Client.send(listCommand);
  //     const object = listResult.Contents?.[0];
  //     if (!object || !object.Key) {
  //       logger.error("No image found under the specified prefix.");
  //       return null;
  //     }
  //     const getCommand = new GetObjectCommand({
  //       Bucket: bucket,
  //       Key: object.Key,
  //     });
  //     const result = await s3Client.send(getCommand);
  //     const stream = result.Body as Readable;
  //     const buffer = await ApplicantPhoto.streamToBuffer(stream);
  //     return buffer.toString("base64");
  //   } catch (error) {
  //     logger.error("Error fetching image:", error);
  //     throw error;
  //   }
  // }
}
