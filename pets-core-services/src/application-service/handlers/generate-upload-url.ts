import { ChecksumAlgorithm, PutObjectCommand, ServerSideEncryption } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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
const APP_DOMAIN = assertEnvExists(process.env.APP_DOMAIN); // // TODO: App domain change to route53 Qs
const UPLOAD_CLOUDFRONT_PATH = "upload";

export const generateUploadUrlHandler = async (event: GenerateUploadEvent) => {
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
  const objectkey = `${UPLOAD_CLOUDFRONT_PATH}/temp/${applicationId}/${fileName}`; // TODO: Document temp as well as the esbuild thingy

  const client = awsClients.s3Client;
  const command = new PutObjectCommand({
    Bucket: IMAGE_BUCKET,
    Key: objectkey,
    ContentType: "application/octet-stream",
    IfNoneMatch: "*",
    ChecksumAlgorithm: ChecksumAlgorithm.SHA256,
    ChecksumSHA256: parsedBody.checksum,
    SSEKMSKeyId: "arn:aws:kms:eu-west-2:108782068086:key/e9d62629-f651-4cfc-bab3-7b63563f2f82", // TODO: Change to Github secrets
    ServerSideEncryption: ServerSideEncryption.aws_kms,
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const s3EndpointUploadUrl = await getSignedUrl(client, command, {
    expiresIn: 5 * 60 * 60, // TODO: Change to 2 minutes
    hoistableHeaders: new Set([
      "x-amz-server-side-encryption",
      "x-amz-server-side-encryption-aws-kms-key-id",
    ]),
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const parsedUrl = new URL(s3EndpointUploadUrl);
  const domainUploadUrl = `${APP_DOMAIN}${parsedUrl.pathname}${parsedUrl.search}`;

  return createHttpResponse(200, { uploadUrl: domainUploadUrl });
};

/**
 * // DEVOPS Notes
 * - Don't sign request
 * - Caching should be changed for upload
 * - OAC behaviour should be different for frontend web browser
 * - Content policy failing
 */
