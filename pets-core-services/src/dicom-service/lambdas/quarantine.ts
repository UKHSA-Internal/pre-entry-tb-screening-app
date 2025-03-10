import {
  CopyObjectCommand,
  CopyObjectCommandInput,
  CopyObjectCommandOutput,
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  waitUntilObjectExists,
  waitUntilObjectNotExists,
} from "@aws-sdk/client-s3";

import awsClients from "../../shared/clients/aws";
import { assertEnvExists } from "../../shared/config";
import { logger } from "../../shared/logger";
import { EventBridgeEvent, EventBridgeEventDetails } from "./types";

const QUARANTINE_BUCKET = assertEnvExists(process.env.QUARANTINE_BUCKET);

export const handler = (event: EventBridgeEvent<string, EventBridgeEventDetails>) => {
  logger.info({ event }, "Received Quarantine event");

  const { detail } = event;
  let bucketName: string = "";
  let fileName: string = "";

  if (detail) {
    if (detail?.s3ObjectDetails) {
      bucketName = detail.s3ObjectDetails?.bucketName || "";
      fileName = detail.s3ObjectDetails?.objectKey || "";

      logger.info(`bucketName => ${bucketName} / fileName => ${fileName}`);

      // Do nothing if there are no proper names
      if (!bucketName || !fileName) return;
    }
  } else {
    // This should never happen
    logger.error("EventBridge event object doesn't contain 'detail' property");

    return;
  }

  const { s3Client } = awsClients;

  // @ts-expect-error Property 'scanResultDetails' does not exist on type 'object'.
  if (detail?.scanResultDetails === "NO_THREATS_FOUND") {
    logger.info("EventBridge rule is not properly set");
  } else {
    logger.info(`Copying the file: ${bucketName}/${fileName} to the bucket: ${QUARANTINE_BUCKET}`);

    const copyParams: CopyObjectCommandInput = {
      Bucket: QUARANTINE_BUCKET,
      CopySource: `${bucketName}/${fileName}`,
      Key: fileName,
    };

    const deleteParams: DeleteObjectCommandInput = {
      Bucket: bucketName,
      Key: fileName,
    };

    const copyCommand = new CopyObjectCommand(copyParams);
    s3Client
      .send(copyCommand)
      .then((result: CopyObjectCommandOutput) => {
        logger.info(`Result of copy: ${JSON.stringify(result)}`);

        const deleteCommand = new DeleteObjectCommand(deleteParams);
        s3Client
          .send(deleteCommand)
          .then((result) => {
            logger.info(`Result of delete: ${JSON.stringify(result)}`);
          })
          .catch((error) => {
            logger.error(`Error while calling DeleteObjectCommand: ${error}`);
          });
      })
      .catch((error) => {
        logger.error(`Error message while calling CopyObjectCommand: ${error}`);
      });

    return;
  }
};
