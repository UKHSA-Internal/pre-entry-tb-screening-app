import {
  Callback,
  Context,
  DynamoDBBatchItemFailure,
  DynamoDBBatchResponse,
  DynamoDBRecord,
  Handler,
} from "aws-lambda";

import { logger } from "../../shared/logger";
import { AuditDbOps } from "../models/audit-db-ops";
// import { AuditDbOps } from "../models/audit-db-ops";

/**
 * λ function to process a DynamoDB stream of pets clinic application s into a queue for EDAP integration.
 * @param event - DynamoDB Stream event
 * @param _context - λ Context
 * @param _callback - callback function
 */
const createAuditHandler: Handler = async (
  event: DynamoDBRecord[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  context?: Context,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  callback?: Callback,
): Promise<DynamoDBBatchResponse> => {
  logger.info(`Audit-service / event received: ${JSON.stringify(event)}`);
  const batchItemFailures: DynamoDBBatchItemFailure[] = [];

  for (const record of event) {
    logger.info(`Audit handler / processing record: ${JSON.stringify(record)}`);

    try {
      const result = await AuditDbOps.createNewAuditFromDBRecord(record);

      if (!result) {
        logger.error("Audit was not created");
      }
    } catch (e) {
      logger.error({ e }, "Error creating audit");
      batchItemFailures.push({ itemIdentifier: record.dynamodb?.SequenceNumber ?? "" });

      throw new Error("Failed to create audit");
    }
  }

  return { batchItemFailures: [{ itemIdentifier: "0" }] };
};

export { createAuditHandler };
