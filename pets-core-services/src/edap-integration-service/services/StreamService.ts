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
    logger.info(record);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let records: Record<string, any>[] = [];
    // Create from a test result with multiple test types, multiple test result with one test type each
    if (
      record.eventName === "INSERT" ||
      (record.eventName === "MODIFY" && StreamService.isProcessModifyEventsEnabled())
    ) {
      if (record.dynamodb && record.dynamodb.NewImage) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        const unmarshalledRecord = unmarshall((record as any).dynamodb.NewImage);
        records = [unmarshalledRecord];
      }
    } else {
      logger.info("event name was not of correct type");
    }

    return records;
  }

  /**
   * Returns true or false as a boolean based on PROCESS_MODIFY_EVENTS, if
   * it is not a valid value then it should throw an error
   */
  private static isProcessModifyEventsEnabled(): boolean {
    if (
      process.env.PROCESS_MODIFY_EVENTS !== "true" &&
      process.env.PROCESS_MODIFY_EVENTS !== "false"
    ) {
      throw Error("PROCESS_MODIFY_EVENTS environment variable must be true or false");
    }
    return process.env.PROCESS_MODIFY_EVENTS === "true";
  }

  /**
   * Helper method for expanding a single record with multiple test types
   * into multiple records with a single test type
   * @param records
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static expandRecords(records: any): any[] {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, prettier/prettier, @typescript-eslint/no-unsafe-call
    return records
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        .map((record: any) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
          const templateRecord: any = Object.assign({}, record);
          Object.assign(templateRecord, {});

          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return templateRecord;
        })
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, prettier/prettier, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        .reduce((acc: any[], val: any) => acc.concat(val), []); // Flatten the array
  }
}

export { StreamService };
