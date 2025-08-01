// import { DynamoDB } from "aws-sdk";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { DynamoDBRecord } from "aws-lambda";

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let records: Record<string, any>[] = [];
    if (record.eventName === "INSERT" || record.eventName === "MODIFY") {
      if (record.dynamodb && record.dynamodb.NewImage) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
          records = [unmarshall((record as any).dynamodb.NewImage)];
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
