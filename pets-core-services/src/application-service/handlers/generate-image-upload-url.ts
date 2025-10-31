import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import path from "path";
import { z } from "zod";

import awsClients from "../../shared/clients/aws";
import { assertEnvExists, isLocal, isTest } from "../../shared/config";
import { createHttpResponse } from "../../shared/http";
import { logger } from "../../shared/logger";
import { ApplicantDbOps } from "../../shared/models/applicant";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { generateImageObjectkey } from "../helpers/upload";
import { ImageType } from "../types/enums";
import { ImageUploadUrlRequestSchema } from "../types/zod-schema";

export type ImageUploadUrlRequestSchema = z.infer<typeof ImageUploadUrlRequestSchema>;
export type GenerateUploadEvent = PetsAPIGatewayProxyEvent & {
  parsedBody?: ImageUploadUrlRequestSchema;
};

const IMAGE_BUCKET = assertEnvExists(process.env.IMAGE_BUCKET);
const SSE_KEY_ID = assertEnvExists(process.env.VITE_SSE_KEY_ID);
const APP_DOMAIN = assertEnvExists(process.env.APP_DOMAIN);

const EXPIRY_TIME = 5 * 60; // 5 minutes
// Mapping extensions to MIME types for applicant photo
const mimeTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
};

export const generateImageUploadUrlHandler = async (event: GenerateUploadEvent) => {
  try {
    const applicationId = decodeURIComponent(event.pathParameters?.["applicationId"] ?? "").trim();

    const { parsedBody } = event;

    if (!parsedBody) {
      logger.error("Event missing parsed body");

      return createHttpResponse(500, {
        message: "Internal Server Error: Generate Upload URL Request not parsed correctly",
      });
    }
    const imageType = parsedBody.imageType as ImageType;
    let contentType = "application/octet-stream";
    if (imageType === ImageType.Photo) {
      //validate fileName
      const ext = path.extname(parsedBody.fileName).toLowerCase();
      contentType = mimeTypes[ext];
      if (!contentType) {
        logger.error("Invalid file type. Only .jpg, .jpeg, and .png are allowed.");
        return createHttpResponse(400, {
          message: "Invalid file type. Only .jpg, .jpeg, and .png are allowed.",
        });
      }
    }
    const applicant = await ApplicantDbOps.getByApplicationId(applicationId);
    if (!applicant) {
      logger.error("Application does not have an applicant");
      return createHttpResponse(400, { message: "Invalid Application - No Applicant" });
    }

    const objectKey = generateImageObjectkey({
      applicant,
      clinicId: event.requestContext.authorizer.clinicId,
      fileName: parsedBody.fileName,
      imageType,
      applicationId,
    });

    const client = awsClients.s3Client;
    const SSE_ALGORITHM = "aws:kms"; // value for x-amz-server-side-encryption

    const command = new PutObjectCommand({
      Bucket: IMAGE_BUCKET,
      Key: objectKey,
      ContentType: contentType,
      ServerSideEncryption: SSE_ALGORITHM, // -> signs x-amz-server-side-encryption
      SSEKMSKeyId: SSE_KEY_ID,
      ChecksumSHA256: parsedBody.checksum,
    });
    const url = await getSignedUrl(client, command, {
      expiresIn: EXPIRY_TIME,
      unhoistableHeaders: new Set(["x-amz-sdk-checksum-algorithm", "x-amz-checksum-sha256"]),
    });
    let appUrl = url.replace(
      /^https:\/\/[^.]+\.s3\.[^/]+\.amazonaws\.com/,
      APP_DOMAIN.replace(/\/$/, ""),
    );
    if (isLocal()) {
      const localImageBucket = assertEnvExists(process.env.IMAGE_BUCKET);
      appUrl = url.replace(
        /^http:\/\/(?:127\.0\.0\.1|localhost|172\.\d+\.\d+\.\d+):\d+\/[^/]+/,
        `http://localhost:4566/${localImageBucket}`,
      );
    }
    if (isTest()) {
      appUrl = url.replace(
        /^http:\/\/(?:127\.0\.0\.1|localhost|172\.\d+\.\d+\.\d+):\d+\/[^/]+/,
        APP_DOMAIN,
      );
    }

    return createHttpResponse(200, { uploadUrl: appUrl, bucketPath: objectKey });
  } catch (error) {
    logger.error(error, "Error generating uploading url");
    return createHttpResponse(500, { message: "Something went wrong" });
  }
};
