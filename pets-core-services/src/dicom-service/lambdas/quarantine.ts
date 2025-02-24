import { EventBridgeEvent } from "aws-lambda";

import awsClients from "../../shared/clients/aws";
import { assertEnvExists } from "../../shared/config";
import { logger } from "../../shared/logger";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const QUARANTINE_BUCKET = assertEnvExists(process.env.QUARANTINE_BUCKET);

export const handler = (event: EventBridgeEvent<string, object>) => {
  logger.info({ event }, "Received Quarantine event");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { s3Client } = awsClients;
  /**
   * TODO: check and remove malicious images
   */
};
