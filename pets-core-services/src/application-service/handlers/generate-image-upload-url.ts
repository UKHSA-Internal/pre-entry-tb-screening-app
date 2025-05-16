import { ChecksumAlgorithm, ServerSideEncryption } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { Conditions } from "@aws-sdk/s3-presigned-post/dist-types/types";
import path from "path";
import { z } from "zod";

import awsClients from "../../shared/clients/aws";
import { assertEnvExists, isLocal } from "../../shared/config";
import { createHttpResponse } from "../../shared/http";
import { logger } from "../../shared/logger";
import { Applicant } from "../../shared/models/applicant";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { generateImageObjectkey } from "../helpers/upload";
import { ImageType } from "../types/enums";
import { ImageUploadUrlRequestSchema } from "../types/zod-schema";

export type ImageUploadUrlRequestSchema = z.infer<typeof ImageUploadUrlRequestSchema>;
export type GenerateUploadEvent = PetsAPIGatewayProxyEvent & {
  parsedBody?: ImageUploadUrlRequestSchema;
};

const IMAGE_BUCKET = assertEnvExists(process.env.IMAGE_BUCKET);
const SSE_KEY_ID = assertEnvExists(process.env.SSE_KEY_ID);
const EXPIRY_TIME = 5 * 60; // 5 minutes
const MAX_FILE_SIZE_PHOTO = 10 * 1024 * 1024; // 10MB
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
    let fileRestrictions: Conditions[] = [];

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
      //can’t specify multiple exact values directly in a pre-signed POST
      // prefix-matching "image/" is the most effective solution for image/jpeg, image/png, etc
      fileRestrictions = [
        ["starts-with", "$Content-Type", contentType],
        ["content-length-range", 0, MAX_FILE_SIZE_PHOTO],
      ];
    }
    const applicant = await Applicant.getByApplicationId(applicationId);
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

    const signedPost = await createPresignedPost(client, {
      Bucket: IMAGE_BUCKET,
      Key: objectKey,
      Fields: {
        "Content-Type": contentType,
        "x-amz-checksum-sha256": parsedBody.checksum,
        "x-amz-sdk-checksum-algorithm": ChecksumAlgorithm.SHA256,
        "x-amz-server-side-encryption": ServerSideEncryption.aws_kms,
        "x-amz-server-side-encryption-aws-kms-key-id": SSE_KEY_ID,
      },
      Conditions: fileRestrictions, // TBBETA-701: Future conditions to enforce size and file types
      Expires: EXPIRY_TIME,
    });

    let { url } = signedPost;
    if (isLocal()) {
      const localImageBucket = assertEnvExists(process.env.IMAGE_BUCKET);
      url = `http://localhost:4566/${localImageBucket}`;
    }

    const { fields } = signedPost;
    return createHttpResponse(200, { uploadUrl: url, bucketPath: objectKey, fields });
  } catch (error) {
    logger.error(error, "Error generating uploading url");
    return createHttpResponse(500, { message: "Something went wrong" });
  }
};
