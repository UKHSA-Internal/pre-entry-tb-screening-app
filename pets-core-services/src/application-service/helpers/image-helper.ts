import { GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { Readable } from "stream";

import awsClients from "../../shared/clients/aws";
import { assertEnvExists } from "../../shared/config";
import { logger } from "../../shared/logger";

const { s3Client } = awsClients;

export class ImageHelper {
  static async streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on("data", (chunk) => chunks.push(chunk as Buffer));
      stream.on("end", () => resolve(Buffer.concat(chunks)));
      stream.on("error", reject);
    });
  }

  static async fetchImageAsBase64(bucket: string, key: string): Promise<string | null> {
    try {
      const listCommand = new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: key,
        MaxKeys: 1,
      });

      const listResult = await s3Client.send(listCommand);
      const object = listResult.Contents?.[0];

      if (!object || !object.Key) {
        logger.error("No image found under the specified prefix.");
        return null;
      }

      const getCommand = new GetObjectCommand({
        Bucket: bucket,
        Key: object.Key,
      });

      const result = await s3Client.send(getCommand);
      const stream = result.Body as Readable;
      const buffer = await ImageHelper.streamToBuffer(stream);

      return buffer.toString("base64");
    } catch (error) {
      logger.error("Error fetching image:", error);
      throw error;
    }
  }
}

export function getImageBucket(): string {
  return assertEnvExists(process.env.IMAGE_BUCKET);
}
