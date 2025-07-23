import { SQSClient } from "@aws-sdk/client-sqs";
import {
  Callback,
  Context,
  // Callback,
  // Context,
  DynamoDBBatchItemFailure,
  DynamoDBBatchResponse,
  DynamoDBStreamEvent,
  Handler,
} from "aws-lambda";

import { logger } from "../../shared/logger";
import { SQService } from "../services/SQService";
import { StreamService } from "../services/StreamService";
// import { Utils } from "../utils/Utils";

/**
 * λ function to process a DynamoDB stream of test results into a queue for certificate generation.
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let expandedRecords: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const certGenFilteredRecords: any[] = [];
  let sqService: SQService;

  try {
    // Instantiate the Simple Queue Service

    sqService = new SQService(new SQSClient());
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    logger.error(`Error creating SQS instance:  ${e}`);
    throw new Error("Failed to initialize SQS service");
  }

  for (const record of event.Records) {
    try {
      expandedRecords = StreamService.getTestResultStream(record);
      logger.info(`Number of Retrieved records: ${expandedRecords.length}`);

      for (const record of expandedRecords) {
        const stringifiedRecord = JSON.stringify(record);
        logger.info(stringifiedRecord);
        await sqService.sendCertGenMessage(stringifiedRecord);
      }

      logger.info(`event ${record.dynamodb?.SequenceNumber} successfully processed`);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      logger.error(`ERROR: ${err}`);
      logger.info("expandedRecords");
      logger.info(JSON.stringify(expandedRecords));
      logger.info("certGenFilteredRecords");
      logger.info(JSON.stringify(certGenFilteredRecords));
      batchItemFailures.push({
        itemIdentifier: record.dynamodb?.SequenceNumber ?? "",
      });
    }
  }

  return { batchItemFailures };
};

export { handler };
