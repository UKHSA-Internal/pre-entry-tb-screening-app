import { LookupEventsCommand, LookupEventsCommandInput } from "@aws-sdk/client-cloudtrail";
import { DynamoDBRecord } from "aws-lambda";

import awsClients from "../../shared/clients/aws";
import { logger } from "../../shared/logger";
import { SourceType } from "../types/enums";

const { cloudTrailClient: client } = awsClients;

export const getConsoleEvent = async (record: DynamoDBRecord) => {
  const tableArn = record.eventSourceARN;
  const approxTime = record?.dynamodb?.ApproximateCreationDateTime;

  // Extract just the table name from ARN
  const tableName = tableArn ? tableArn.split("/")[1] : undefined;
  logger.info(`tableName: ${tableName}, approxTime: ${approxTime}`);

  if (!tableName || !approxTime) {
    logger.error("Record is missing tableName or ApproximateCreationDateTime");

    return;
  }

  // Look up CloudTrail events around that time
  const startTime = new Date(approxTime * 1000 - 60 * 1000); // 1 min before
  const endTime = new Date(approxTime * 1000 + 60 * 1000); // 1 min after

  const params = {
    LookupAttributes: [
      {
        AttributeKey: "EventSource",
        AttributeValue: "dynamodb.amazonaws.com",
      },
    ],
    StartTime: startTime,
    EndTime: endTime,
    MaxResults: 10,
  };

  try {
    logger.info("Sending LookupEventCommand");
    const result = await client.send(new LookupEventsCommand(params as LookupEventsCommandInput));

    logger.info({ result }, "CloudTrail lookup result");

    const consoleEvents = result.Events?.filter((evt) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const details = evt?.CloudTrailEvent ? JSON.parse(evt.CloudTrailEvent) : undefined;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (!details || !details?.userAgent || !details?.requestParameters?.table) return;

      logger.info(details, "CloudTrail parsing event");

      return (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        details.userAgent === "console.amazonaws.com" &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        details.requestParameters?.tableName === tableName
      );
    });

    if (consoleEvents && consoleEvents.length > 0) {
      // @ts-expect-error it can't be undefined
      logger.info(`Update to ${tableName} came from AWS Console:`, consoleEvents[0]);
      return SourceType.app;
    } else {
      // @ts-expect-error it can't be undefined
      logger.info(`Update to ${tableName} likely came from SDK/API.`, consoleEvents[0]);
      return SourceType.api;
    }
  } catch (err) {
    logger.error({ err }, "CloudTrail lookup failed");
    return;
  }
};
