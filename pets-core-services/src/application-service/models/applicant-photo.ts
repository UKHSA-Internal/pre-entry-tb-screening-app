import { logger } from "../../shared/logger";
import { Applicant } from "../../shared/models/applicant";
import { getImageBucket, ImageHelper } from "../helpers/image-helper";
import { generateImageObjectkey } from "../helpers/upload";
import { ImageType } from "../types/enums";
const bucket = getImageBucket();

export abstract class IApplicantPhoto {
  applicantPhotoUrl: string;
  constructor(details: IApplicantPhoto) {
    this.applicantPhotoUrl = details.applicantPhotoUrl;
  }
}
export class ApplicantPhoto extends IApplicantPhoto {
  static async getByApplicationId(applicationId: string, clinicId: string) {
    try {
      logger.info("Fetching presigned photo Url");
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
      const applicantPhotoUrl = await ImageHelper.getPresignedUrlforImage(bucket, objectKey);
      if (!applicantPhotoUrl) {
        logger.info("Applicant Photo not found");
        return;
      }
      logger.info("Applicant Photo Url generated successfully");
      return applicantPhotoUrl;
    } catch (error) {
      logger.error(error, "Error retrieving Applicant Photo Details");
      throw error;
    }
  }
}
