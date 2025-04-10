import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { HeadBucketCommandOutput, HeadObjectCommand, S3ServiceException } from "@aws-sdk/client-s3";
import { z } from "zod";

import awsClients from "../../shared/clients/aws";
import { assertEnvExists } from "../../shared/config";
import { createHttpResponse } from "../../shared/http";
import { logger } from "../../shared/logger";
import { Applicant } from "../../shared/models/applicant";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { generateDicomObjectkey, KeyParameters } from "../helpers/upload";
import { ChestXRayDbOps, ChestXRayNotTaken, ChestXRayTaken } from "../models/chest-xray";
import { YesOrNo } from "../types/enums";
import { ApplicantNotFound, InvalidObjectKey, ObjectNotFound } from "../types/errors";
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

    if (parsedBody.chestXrayTaken === YesOrNo.Yes) {
      const validationError = await validateImages(parsedBody, applicationId, clinicId);
      if (validationError) {
        return createHttpResponse(400, { message: validationError });
      }
    }

    let chestXray: ChestXRayTaken | ChestXRayNotTaken;
    try {
      chestXray = await ChestXRayDbOps.createChestXray({
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
  const { applicant, clinicId, applicationId, fileName } = expectedKeyParameters;
  logger.info({ applicationId, clinicId, fileName }, "Validating object key");

  const expectedObjectKey = generateDicomObjectkey({
    applicant,
    clinicId,
    applicationId,
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

const validateChestXRayImages = async (
  images: ChestXRayImages,
  applicationInfo: ApplicationInfo,
) => {
  logger.info({ applicationInfo }, "Validating Uploaded Chest X-Ray Images");
  const { applicationId } = applicationInfo;
  const applicant = await Applicant.getByApplicationId(applicationId);
  if (!applicant) {
    logger.error("Application does not have an applicant");
    throw new ApplicantNotFound("Invalid Application - No Applicant");
  }

  const { clinicId } = applicationInfo;
  await validateObjectKey(images.posteroAnteriorXray, {
    applicant,
    applicationId,
    clinicId,
    fileName: "postero-anterior.dcm",
  });

  if (images.apicalLordoticXray) {
    await validateObjectKey(images.apicalLordoticXray, {
      applicant,
      applicationId,
      clinicId,
      fileName: "apical-lordotic.dcm",
    });
  }

  if (images.lateralDecubitusXray) {
    await validateObjectKey(images.lateralDecubitusXray, {
      applicant,
      applicationId,
      clinicId,
      fileName: "lateral-decubitus.dcm",
    });
  }
  logger.info({ applicationInfo }, "Validation Completed");
};
