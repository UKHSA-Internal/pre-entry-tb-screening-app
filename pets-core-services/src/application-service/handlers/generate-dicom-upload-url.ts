import { ChecksumAlgorithm, ServerSideEncryption } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { z } from "zod";

import awsClients from "../../shared/clients/aws";
import { assertEnvExists } from "../../shared/config";
import { createHttpResponse } from "../../shared/http";
import { logger } from "../../shared/logger";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { DicomUploadUrlRequestSchema } from "../types/zod-schema";

export type DicomUploadUrlRequestSchema = z.infer<typeof DicomUploadUrlRequestSchema>;
export type GenerateUploadEvent = PetsAPIGatewayProxyEvent & {
  parsedBody?: DicomUploadUrlRequestSchema;
};

const IMAGE_BUCKET = assertEnvExists(process.env.IMAGE_BUCKET);
const SSE_KEY_ID = assertEnvExists(process.env.SSE_KEY_ID);
const EXPIRY_TIME = 5 * 60; // 5 minutes
const UPLOAD_TEMPORARY_FOLDER = "temp";

export const generateDicomUploadUrlHandler = async (event: GenerateUploadEvent) => {
  const applicationId = decodeURIComponent(event.pathParameters?.["applicationId"] || "").trim();

  const { parsedBody } = event;

  if (!parsedBody) {
    logger.error("Event missing parsed body");

    return createHttpResponse(500, {
      message: "Internal Server Error: Generate Upload URL Request not parsed correctly",
    });
  }

  // const applicant = await Applicant.getByApplicationId(applicationId);
  // if (!applicant) {
  //   logger.error("Application does not have an applicant");
  //   return createHttpResponse(400, { message: "Invalid Application - No Applicant" });
  // }

  // const countryOfIssue = applicant.countryOfIssue; // TODO: Inform platform about another dynamodb changes
  // const passportNumber = applicant.passportNumber;
  // const { clinicId } = event.requestContext.authorizer;
  // const clinicIDFormatted = clinicId.replaceAll("/", "-"); // Replace

  const fileName = parsedBody.fileName;

  // TODO: Move to clinic directory
  const objectkey = `${UPLOAD_TEMPORARY_FOLDER}/${applicationId}/${fileName}`; // TODO: Document temp path as well as the esbuild thingy with Envs and also we depend on the aws sdk in runtime

  const client = awsClients.s3Client;

  const { url, fields } = await createPresignedPost(client, {
    Bucket: IMAGE_BUCKET,
    Key: objectkey,
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

  return createHttpResponse(200, { uploadUrl: url, fields });
};

/**
 * // DEVOPS Notes
 * - Don't sign request
 * - Caching should be changed for upload
 * - OAC behaviour should be different for frontend web browser
 * - Content policy failing
 * - Delete the upload behaviour
 * - Content policy to limit to AWS important also
 */
