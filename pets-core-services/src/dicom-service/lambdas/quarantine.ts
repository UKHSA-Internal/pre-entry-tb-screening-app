import {
  CopyObjectCommand,
  CopyObjectCommandInput,
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  waitUntilObjectExists,
} from "@aws-sdk/client-s3";
import assert from "assert";

import awsClients from "../../shared/clients/aws";
import { assertEnvExists } from "../../shared/config";
import { logger } from "../../shared/logger";
import { EventBridgeEvent, EventBridgeEventDetails } from "../types";

const QUARANTINE_BUCKET = assertEnvExists(process.env.QUARANTINE_BUCKET);
const SSE_KEY_ID = assertEnvExists(process.env.VITE_SSE_KEY_ID);
const NO_THREATS_FOUND = "NO_THREATS_FOUND";

export const handler = async (
  event: EventBridgeEvent<string, EventBridgeEventDetails>,
): Promise<void | object> => {
  logger.info({ event }, "Received Quarantine event");
  try {
    const { detail } = event;
    assert(detail, "EventBridge event object doesn't contain 'detail' property");

    if (detail?.scanResultDetails.scanResultStatus === NO_THREATS_FOUND) {
      logger.error("EventBridge rule is not properly set");
      return;
    }

    const { s3ObjectDetails } = detail;

    const bucketName = s3ObjectDetails?.bucketName;
    const fileName = s3ObjectDetails?.objectKey;

    assert(bucketName, "Invalid bucket name");
    assert(fileName, "Invalid file name");

    logger.info(`bucketName => ${bucketName} / fileName => ${fileName}`);

    const { s3Client } = awsClients;

    logger.info(`Copying the file: ${bucketName}/${fileName} to the bucket: ${QUARANTINE_BUCKET}`);

    const copyParams: CopyObjectCommandInput = {
      Bucket: QUARANTINE_BUCKET,
      CopySource: `${bucketName}/${fileName}`,
      Key: fileName,
      SSEKMSKeyId: SSE_KEY_ID,
      ServerSideEncryption: "aws:kms",
    };

    const copyCommand = new CopyObjectCommand(copyParams);

    await s3Client.send(copyCommand);

    await waitUntilObjectExists(
      { client: s3Client, maxWaitTime: 30 },
      { Bucket: QUARANTINE_BUCKET, Key: fileName },
    );
    logger.info("Successfully copied to quarantine bucket");

    const deleteParams: DeleteObjectCommandInput = {
      Bucket: bucketName,
      Key: fileName,
    };
    const deleteCommand = new DeleteObjectCommand(deleteParams);
    await s3Client.send(deleteCommand);
    logger.info("Successfully deleted from source bucket");

    return {
      sourceBucket: bucketName,
      destinationBucket: QUARANTINE_BUCKET,
      fileName: fileName,
      status: "OK",
    };
  } catch (error) {
    logger.error(error, "Error processing event details");
    throw error;
  }
};
