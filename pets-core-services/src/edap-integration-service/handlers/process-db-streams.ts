import {
  Callback,
  Context,
  DynamoDBBatchItemFailure,
  DynamoDBBatchResponse,
  DynamoDBRecord,
  DynamoDBStreamEvent,
  Handler,
} from "aws-lambda";

import { logger } from "../../shared/logger";
import { SQService } from "../services/sqs-service";
import { StreamService } from "../services/stream-service";

/**
 * λ function to process a DynamoDB stream of pets clinic application s into a queue for EDAP integration.
 * @param event - DynamoDB Stream event
 * @param _context - λ Context
 * @param _callback - callback function
 */
const handler: Handler = async (
  event: DynamoDBStreamEvent,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  context?: Context,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  callback?: Callback,
): Promise<DynamoDBBatchResponse> => {
  if (!event) {
    logger.error("ERROR: event is not defined.");
    throw new Error("ERROR: event is not defined");
  }

  const batchItemFailures: DynamoDBBatchItemFailure[] = [];
  let newRecord: (DynamoDBRecord | undefined)[] = [];
  let sqService: SQService;

  try {
    // Instantiate the Simple Queue Service
    sqService = new SQService();
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    logger.error(`Error creating SQS instance:  ${e}`);
    throw new Error("Failed to initialize SQS service");
  }

  for (const record of event.Records) {
    try {
      newRecord = StreamService.getClinicDataStream(record);
      logger.info(`Number of Retrieved records: ${newRecord.length}`);

      const stringifiedRecord = JSON.stringify(newRecord);
      logger.info(`stringifiedRecord: ${stringifiedRecord}`);
      await sqService.sendDbStreamMessage(stringifiedRecord);

      logger.info(`event ${record.dynamodb?.SequenceNumber} successfully processed`);
    } catch (err) {
      logger.error("ERR:", err);
      logger.info("ERR records:", newRecord);
      batchItemFailures.push({
        itemIdentifier: record.dynamodb?.SequenceNumber ?? "",
      });
      // TODO: Send batchItemFailures to DLQ
    }
  }

  return { batchItemFailures };
};

export { handler };
