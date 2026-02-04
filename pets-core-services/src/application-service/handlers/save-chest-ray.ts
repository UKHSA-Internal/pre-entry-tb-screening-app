import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { HeadBucketCommandOutput, HeadObjectCommand, S3ServiceException } from "@aws-sdk/client-s3";
import { z } from "zod";

import awsClients from "../../shared/clients/aws";
import { assertEnvExists } from "../../shared/config";
import { createHttpResponse } from "../../shared/http";
import { logger } from "../../shared/logger";
import { Application } from "../../shared/models/application";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { generateImageObjectkey, KeyParameters } from "../helpers/upload";
import { ChestXRay } from "../models/chest-xray";
import { ImageType } from "../types/enums";
import { ApplicationNotFound, InvalidObjectKey, ObjectNotFound } from "../types/errors";
import { ChestXRayRequestSchema } from "../types/zod-schema";

export type ChestXRayRequestSchema = z.infer<typeof ChestXRayRequestSchema>;
export type SaveChestXrayEvent = PetsAPIGatewayProxyEvent & {
  parsedBody?: ChestXRayRequestSchema;
};
const IMAGE_BUCKET = assertEnvExists(process.env.IMAGE_BUCKET);

export const saveChestXRayHandler = async (event: SaveChestXrayEvent) => {
  try {
    const applicationId = decodeURIComponent(event.pathParameters?.["applicationId"] ?? "").trim();

    logger.info({ applicationId }, "Save Chest X-ray Information handler triggered");

    const { parsedBody } = event;

    if (!parsedBody) {
      logger.error("Event missing parsed body");

      return createHttpResponse(500, {
        message: "Internal Server Error: Chest X-Ray Request not parsed correctly",
      });
    }

    const { clinicId, createdBy } = event.requestContext.authorizer;
    //validate xray images
    const validationError = await validateImages(parsedBody, applicationId, clinicId);
    if (validationError) {
      return createHttpResponse(400, { message: validationError });
    }

    let chestXray: ChestXRay;
    try {
      chestXray = await ChestXRay.createChestXray({
        ...parsedBody,
        createdBy,
        applicationId,
      });
    } catch (error) {
      if (error instanceof ConditionalCheckFailedException)
        return createHttpResponse(400, { message: "Chest X-ray already saved" });
      throw error;
    }

    return createHttpResponse(200, {
      ...chestXray.toJson(),
    });
  } catch (error) {
    logger.error(error, "Error saving Chest X-ray");
    return createHttpResponse(500, { message: "Something went wrong" });
  }
};

async function validateImages(images: ChestXRayImages, applicationId: string, clinicId: string) {
  try {
    await validateChestXRayImages(images, { applicationId, clinicId });
    return null;
  } catch (error) {
    if (error instanceof ApplicationNotFound) {
      logger.error(error, "Application not found");
      return "Invalid Application: Application does not exist";
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

type ChestXRayImages = {
  posteroAnteriorXray: string;
  apicalLordoticXray?: string;
  lateralDecubitusXray?: string;
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
  const { passportNumber, countryOfIssue, clinicId, applicationId, fileName, imageType } =
    expectedKeyParameters;
  logger.info({ applicationId, clinicId, fileName }, "Validating object key");

  const expectedObjectKey = generateImageObjectkey({
    passportNumber,
    countryOfIssue,
    clinicId,
    applicationId,
    fileName,
    imageType,
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

const validateChestXRayImages = async (
  images: ChestXRayImages,
  applicationInfo: ApplicationInfo,
) => {
  logger.info({ applicationInfo }, "Validating Uploaded Chest X-Ray Images");
  const { applicationId } = applicationInfo;
  const application = await Application.getByApplicationId(applicationId);
  if (!application) {
    logger.error("Application does not exist");
    throw new ApplicationNotFound("Application not found");
  }
  const { clinicId } = applicationInfo;
  await validateObjectKey(images.posteroAnteriorXray, {
    passportNumber: application.passportNumber,
    countryOfIssue: application.countryOfIssue,
    applicationId,
    clinicId,
    fileName: "postero-anterior.dcm",
    imageType: ImageType.Dicom,
  });

  if (images.apicalLordoticXray) {
    await validateObjectKey(images.apicalLordoticXray, {
      passportNumber: application.passportNumber,
      countryOfIssue: application.countryOfIssue,
      applicationId,
      clinicId,
      fileName: "apical-lordotic.dcm",
      imageType: ImageType.Dicom,
    });
  }

  if (images.lateralDecubitusXray) {
    await validateObjectKey(images.lateralDecubitusXray, {
      passportNumber: application.passportNumber,
      countryOfIssue: application.countryOfIssue,
      applicationId,
      clinicId,
      fileName: "lateral-decubitus.dcm",
      imageType: ImageType.Dicom,
    });
  }
  logger.info({ applicationInfo }, "Validation Completed");
  return;
};
