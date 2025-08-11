import { DynamoDBRecord, StreamRecord } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

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
    const dbrecord: StreamRecord["NewImage"][] = [];

    if (record.eventName === "INSERT" || record.eventName === "MODIFY") {
      if (record.dynamodb && record.dynamodb.NewImage) {
        const newImage: DynamoDB.AttributeMap = record.dynamodb.NewImage;

        try {
          const unmarshalled = DynamoDB.Converter.unmarshall(newImage);

          return [unmarshalled];
        } catch (error) {
          logger.error("unmarshall error:", error);
          logger.error("error in record:", record);
        }
      } else {
        logger.info(record);
      }
    } else {
      logger.info("event name was not of correct type");
    }

    return dbrecord;
  }
}

export { StreamService };
