import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { HeadBucketCommandOutput, HeadObjectCommand, S3ServiceException } from "@aws-sdk/client-s3";
import { z } from "zod";

import awsClients from "../../shared/clients/aws";
import { assertEnvExists } from "../../shared/config";
import { createHttpResponse } from "../../shared/http";
import { logger } from "../../shared/logger";
import { Applicant } from "../../shared/models/applicant";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { generateImageObjectkey, KeyParameters } from "../helpers/upload";
import { ApplicantPhoto } from "../models/applicant-photo";
import { ImageType } from "../types/enums";
import { ApplicantNotFound, InvalidObjectKey, ObjectNotFound } from "../types/errors";
import { ApplicantPhotoRequestSchema } from "../types/zod-schema";

export type ApplicantPhotoRequestSchema = z.infer<typeof ApplicantPhotoRequestSchema>;
export type UploadApplicantPhotoEvent = PetsAPIGatewayProxyEvent & {
  parsedBody?: ApplicantPhotoRequestSchema;
};
const IMAGE_BUCKET = assertEnvExists(process.env.IMAGE_BUCKET);

export const saveApplicantPhotoHandler = async (event: UploadApplicantPhotoEvent) => {
  try {
    const applicationId = decodeURIComponent(event.pathParameters?.["applicationId"] ?? "").trim();

    logger.info({ applicationId }, "Save Applicant Photo handler triggered");

    const { parsedBody } = event;

    if (!parsedBody) {
      logger.error("Event missing parsed body");

      return createHttpResponse(500, {
        message: "Internal Server Error: Upload Applicant Photo Request not parsed correctly",
      });
    }

    const { clinicId, createdBy } = event.requestContext.authorizer;

    const validationError = await validateImages(parsedBody, applicationId, clinicId);
    if (validationError) {
      return createHttpResponse(400, { message: validationError });
    }

    let applicantPhoto;
    try {
      applicantPhoto = await ApplicantPhoto.createApplicantPhotoDetails({
        ...parsedBody,
        createdBy,
        applicationId,
      });
    } catch (error) {
      if (error instanceof ConditionalCheckFailedException)
        return createHttpResponse(400, { message: "Applicant Photo already saved" });
      throw error;
    }

    return createHttpResponse(200, {
      ...applicantPhoto.toJson(),
    });
  } catch (error) {
    logger.error(error, "Error saving Applicant Photo");
    return createHttpResponse(500, { message: "Something went wrong" });
  }
};

async function validateImages(images: Photo, applicationId: string, clinicId: string) {
  try {
    await validateApplicantPhoto(images, { applicationId, clinicId });
    return null;
  } catch (error) {
    if (error instanceof ApplicantNotFound) {
      logger.error(error, "Applicant not found");
      return "Invalid Application - No Applicant";
    }
    if (error instanceof InvalidObjectKey) {
      logger.error(error, "Object key does not match expected");
      return error.message;
    }
    if (error instanceof ObjectNotFound) {
      logger.error(error, "Object not found in S3");
      return error.message;
    }
    throw error;
  }
}

type Photo = {
  applicantPhotoKey: string;
};

const checkIfExists = async (objectKey: string) => {
  const client = awsClients.s3Client;
  logger.info("Checking if object exists");

  const command = new HeadObjectCommand({
    Bucket: IMAGE_BUCKET,
    Key: objectKey,
  });

  let data: HeadBucketCommandOutput;

  try {
    data = await client.send(command);
  } catch (error) {
    if (error instanceof S3ServiceException && error.$metadata?.httpStatusCode === 404) {
      logger.error("Object does not exist");
      return false;
    }
    throw error;
  }

  const exists = data.$metadata.httpStatusCode === 200;
  logger.info({ exists }, "Check Result");

  return exists;
};

const validateObjectKey = async (value: string, expectedKeyParameters: KeyParameters) => {
  const { applicant, clinicId, applicationId, imageType, fileName } = expectedKeyParameters;
  logger.info({ applicationId, clinicId, fileName }, "Validating object key");

  const expectedObjectKey = generateImageObjectkey({
    applicant,
    clinicId,
    applicationId,
    imageType,
    fileName,
  });

  logger.info("Comparing Object Key with expected");
  if (value !== expectedObjectKey) {
    logger.error(`${fileName} object key is invalid`);
    throw new InvalidObjectKey(`${fileName} object key is invalid`);
  }

  const exist = await checkIfExists(value);
  if (!exist) {
    logger.error(`${fileName} image does not exist`);
    throw new ObjectNotFound(`${fileName} image does not exist`);
  }
  logger.info("Validation check completed successfully");
};

type ApplicationInfo = {
  applicationId: string;
  clinicId: string;
};
const validateApplicantPhoto = async (images: Photo, applicationInfo: ApplicationInfo) => {
  logger.info({ applicationInfo }, "Validating Uploaded Applicant photo");
  const { applicationId } = applicationInfo;
  const applicant = await Applicant.getByApplicationId(applicationId);
  if (!applicant) {
    logger.error("Application does not have an applicant");
    throw new ApplicantNotFound("Invalid Application - No Applicant");
  }

  const { clinicId } = applicationInfo;
  const imageType = ImageType.Photo;
  await validateObjectKey(images.applicantPhotoKey, {
    applicant,
    applicationId,
    clinicId,
    imageType,
    fileName: "applicant-photo.jpg",
  });

  logger.info({ applicationInfo }, "Validation Completed");
};
