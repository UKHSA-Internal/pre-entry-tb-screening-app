import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { NativeAttributeValue, unmarshall } from "@aws-sdk/util-dynamodb";
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
  public static getClinicDataStream(
    record: DynamoDBRecord,
  ): Record<string, NativeAttributeValue> | undefined {
    if (record.eventName === "INSERT" || record.eventName === "MODIFY") {
      if (record?.dynamodb?.NewImage) {
        const newImage = record.dynamodb?.NewImage as Record<string, AttributeValue>;

        try {
          return unmarshall(newImage);
        } catch (error) {
          logger.error({ error }, `unmarshall error for the record: ${JSON.stringify(newImage)}`);
        }
      } else {
        logger.error("No 'NewImage'");
      }
    } else {
      logger.error("event name was not of correct type");
    }
  }
}

export { StreamService };
