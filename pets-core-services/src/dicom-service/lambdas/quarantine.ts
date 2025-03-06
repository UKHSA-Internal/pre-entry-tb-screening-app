import {
  CopyObjectCommand,
  CopyObjectCommandInput,
  CopyObjectCommandOutput,
} from "@aws-sdk/client-s3";
import { EventBridgeEvent } from "aws-lambda";

import awsClients from "../../shared/clients/aws";
import { assertEnvExists } from "../../shared/config";
import { logger } from "../../shared/logger";

const QUARANTINE_BUCKET = assertEnvExists(process.env.QUARANTINE_BUCKET);

export const handler = (event: EventBridgeEvent<string, object>) => {
  logger.info({ event }, "Received Quarantine event");

  const { detail } = event;
  let bucketName: string | undefined;
  let fileName: string | undefined;

  if (detail) {
    // @ts-expect-error Property 'scanResultDetails' does not exist on type 'object'
    if (detail?.s3ObjectDetails) {
      // @ts-expect-error Property 'scanResultDetails' does not exist on type 'object'
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const s3ObjDetails = detail.s3ObjectDetails;

      if (s3ObjDetails) {
        logger.info("s3ObjectDetails:", s3ObjDetails);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        bucketName = s3ObjDetails?.bucketName;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        fileName = s3ObjDetails?.objectKey;
        logger.info(`bucketName => ${bucketName} / fileName => ${fileName}`);

        if (typeof bucketName !== "string" || typeof fileName !== "string") {
          logger.info("EventBridge event doesn't contain correct bucketName or objectKey");

          return;
        }
      }
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
    logger.info({ event }, "Received Quarantine event");

    const params: CopyObjectCommandInput = {
      Bucket: QUARANTINE_BUCKET,
      CopySource: `${bucketName}/${fileName}`,
      Key: fileName,
    };

    const copyCommand = new CopyObjectCommand(params);
    const promise = s3Client.send(copyCommand);
    promise
      .then((result: CopyObjectCommandOutput) => {
        logger.info(`The files has been copied ${QUARANTINE_BUCKET}`);
        logger.info(`Result of copy: ${JSON.stringify(result)}`);
      })
      .catch((error) => {
        logger.error(error);
      });

    return;
  }
};
