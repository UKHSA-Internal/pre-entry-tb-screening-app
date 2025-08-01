import { DynamoDBRecord, StreamRecord } from "aws-lambda";

import { logger } from "../../shared/logger";

/**
 * Service class for interpreting and formatting
 * incoming DynamoDB streams
 */
class StreamService {
  /**
   * Extract INSERT events from the DynamoDB Stream
   * @param event
   */
  public static getClinicDataStream(record: DynamoDBRecord) {
    logger.info("record:", record);
    let records: StreamRecord["NewImage"][] = [];
    if (record.eventName === "INSERT" || record.eventName === "MODIFY") {
      if (record.dynamodb && record.dynamodb.NewImage) {
        try {
          records = [record.dynamodb.NewImage];
        } catch (error) {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          logger.error(`unmarshall error: ${error}`);
          logger.error(`NewImage: ${JSON.stringify(record.dynamodb.NewImage)}`);
        }
      }
    } else {
      logger.info("event name was not of correct type");
    }

    return records;
  }
}

export { StreamService };
