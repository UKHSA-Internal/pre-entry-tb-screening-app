import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
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
    const dbrecord: StreamRecord["NewImage"] = {};

    if (record.eventName === "INSERT" || record.eventName === "MODIFY") {
      if (record?.dynamodb?.NewImage) {
        const newImage = record.dynamodb?.NewImage as Record<string, AttributeValue>;

        try {
          return unmarshall(newImage);
        } catch (error) {
          logger.error({ error }, `unmarshall error for the record: ${JSON.stringify(newImage)}`);
        }
      } else {
        logger.info("No 'NewImage'");
      }
    } else {
      logger.info("event name was not of correct type");
    }

    return dbrecord;
  }
}

export { StreamService };
