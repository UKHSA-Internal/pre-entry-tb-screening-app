import { GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import awsClients from "../../shared/clients/aws";
import { assertEnvExists, isLocal } from "../../shared/config";
import { logger } from "../../shared/logger";

const { s3Client } = awsClients;
const EXPIRY_TIME = 5 * 60; // 5 minutes
const APP_DOMAIN = assertEnvExists(process.env.APP_DOMAIN);

export class ImageHelper {
  static async getPresignedUrlforImage(bucket: string, key: string): Promise<string | null> {
    try {
      const listCommand = new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: key,
        MaxKeys: 1,
      });

      const listResult = await s3Client.send(listCommand);
      const object = listResult.Contents?.[0];

      if (!object?.Key) {
        logger.error("No image found under the specified prefix.");
        return null;
      }

      const getCommand = new GetObjectCommand({
        Bucket: bucket,
        Key: object.Key,
      });

      const presignedUrl: string = await getSignedUrl(s3Client, getCommand, {
        expiresIn: EXPIRY_TIME,
      });

      let appUrl = presignedUrl.replace(
        /^https:\/\/[^.]+\.s3\.[^/]+\.amazonaws\.com/,
        APP_DOMAIN.replace(/\/$/, ""),
      );
      if (isLocal()) {
        appUrl = presignedUrl;
      }

      return appUrl;
    } catch (error) {
      logger.error({ error }, "Error fetching image");
      throw error;
    }
  }
}

export function getImageBucket(): string {
  return assertEnvExists(process.env.IMAGE_BUCKET);
}
