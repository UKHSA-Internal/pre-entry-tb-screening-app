import { ChecksumAlgorithm, ServerSideEncryption } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { z } from "zod";

import awsClients from "../../shared/clients/aws";
import { assertEnvExists, isLocal } from "../../shared/config";
import { createHttpResponse } from "../../shared/http";
import { logger } from "../../shared/logger";
import { Applicant } from "../../shared/models/applicant";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { generateDicomObjectkey } from "../helpers/upload";
import { DicomUploadUrlRequestSchema } from "../types/zod-schema";

export type DicomUploadUrlRequestSchema = z.infer<typeof DicomUploadUrlRequestSchema>;
export type GenerateUploadEvent = PetsAPIGatewayProxyEvent & {
  parsedBody?: DicomUploadUrlRequestSchema;
};

const IMAGE_BUCKET = assertEnvExists(process.env.IMAGE_BUCKET);
const SSE_KEY_ID = assertEnvExists(process.env.SSE_KEY_ID);
const EXPIRY_TIME = 5 * 60; // 5 minutes

export const generateDicomUploadUrlHandler = async (event: GenerateUploadEvent) => {
  try {
    const applicationId = decodeURIComponent(event.pathParameters?.["applicationId"] ?? "").trim();

    const { parsedBody } = event;

    if (!parsedBody) {
      logger.error("Event missing parsed body");

      return createHttpResponse(500, {
        message: "Internal Server Error: Generate Upload URL Request not parsed correctly",
      });
    }

    const applicant = await Applicant.getByApplicationId(applicationId);
    if (!applicant) {
      logger.error("Application does not have an applicant");
      return createHttpResponse(400, { message: "Invalid Application - No Applicant" });
    }

    const objectKey = generateDicomObjectkey({
      applicant,
      clinicId: event.requestContext.authorizer.clinicId,
      fileName: parsedBody.fileName,
      applicationId,
    });

    const client = awsClients.s3Client;

    const signedPost = await createPresignedPost(client, {
      Bucket: IMAGE_BUCKET,
      Key: objectKey,
      Fields: {
        "Content-Type": "application/octet-stream",
        "x-amz-checksum-sha256": parsedBody.checksum,
        "x-amz-sdk-checksum-algorithm": ChecksumAlgorithm.SHA256,
        "x-amz-server-side-encryption": ServerSideEncryption.aws_kms,
        "x-amz-server-side-encryption-aws-kms-key-id": SSE_KEY_ID,
      },
      Conditions: [], // TBBETA-701: Future conditions to enforce size and file types
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
