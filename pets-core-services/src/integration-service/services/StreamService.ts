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
   * Extract INSERT events from the DynamoDB Stream, convert them
   * to a JS object and expand the test results into multiple ones for each test type
   * Example:
   * Convert
   * test-result
   *  ├── test-type-1
   *  ├── test-type-2
   *  └── test-type-3
   *  into
   *  test-result
   *  └── test-type-1
   *  test-result
   *  └── test-type-2
   *  test-result
   *  └── test-type-3
   * @param event
   */
  public static getTestResultStream(record: DynamoDBRecord) {
    logger.info(record);
    let records = [];
    // Create from a test result with multiple test types, multiple test result with one test type each
    if (
      record.eventName === "INSERT" ||
      (record.eventName === "MODIFY" && StreamService.isProcessModifyEventsEnabled())
    ) {
      if (record.dynamodb && record.dynamodb.NewImage) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        const unmarshalledRecord = unmarshall((record as any).dynamodb.NewImage);
        records = StreamService.expandRecords([unmarshalledRecord]);
      }
    } else {
      logger.info("event name was not of correct type");
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
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
  private static expandRecords(records: any): any[] {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, prettier/prettier, @typescript-eslint/no-unsafe-call
    return records
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        .map((record: any) => {
          // Separate each test type in a record to form multiple records
          const splittedRecords: any[] = [];
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const templateRecord: any = Object.assign({}, record);
          Object.assign(templateRecord, {});
          logger.info("before for each");
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (record.testTypes instanceof Array) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            record.testTypes?.forEach((testType: any, i: number, array: any[]) => {
              logger.info("in for each");
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              const clonedRecord: any = Object.assign({}, templateRecord); // Create record from template
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              Object.assign(clonedRecord, { testTypes: testType }); // Assign it the test type
              Object.assign(clonedRecord, {
                // Assign certificate order number
                order: {
                  current: i + 1,
                  total: array.length,
                },
              });

              splittedRecords.push(clonedRecord);
            });
          }

          logger.info("after for each");
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return splittedRecords;
        })
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, prettier/prettier, @typescript-eslint/no-unsafe-member-access
        .reduce((acc: any[], val: any) => acc.concat(val), []); // Flatten the array
  }
}

export { StreamService };
