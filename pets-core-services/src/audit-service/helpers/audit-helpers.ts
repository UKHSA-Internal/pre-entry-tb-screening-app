import {
  Event,
  LookupEventsCommand,
  LookupEventsCommandInput,
  LookupEventsCommandOutput,
  ThrottlingException,
} from "@aws-sdk/client-cloudtrail";
import { DynamoDBRecord } from "aws-lambda";

import awsClients from "../../shared/clients/aws";
import { logger } from "../../shared/logger";
import { SourceType } from "../types/enums";

const { cloudTrailClient: client } = awsClients;

export const getConsoleEvent = async (record: DynamoDBRecord) => {
  const tableArn = record.eventSourceARN;
  // const approxTime = record?.dynamodb?.ApproximateCreationDateTime;

  // Extract just the table name from ARN
  const tableName = tableArn ? tableArn.split("/")[1] : undefined;
  logger.info(`tableName: ${tableName}`);

  if (!tableName) {
    logger.error("Record is missing tableName");

    return;
  }

  // Look up CloudTrail events around that time
  // const startTime = new Date(approxTime * 1000 - 60 * 1000); // 1 min before
  // const endTime = new Date(approxTime * 1000 + 20 * 1000); // 1 min after
  // const startTime = new Date(Date.now() - 3 * 60 * 1000);
  // const endTime = new Date();
  const startTime = new Date(Date.now() - 60 * 1000); // 1 min before
  const endTime = new Date(Date.now() + 20 * 1000); // 20 sec after
  const ITEM_EVENTS = ["PutItem", "DeleteItem"];
  const events: Event[] = [];
  let nextToken: string | undefined = undefined;
  let queryNumber = 0;
  const eventNames = new Set();

  const params = {
    LookupAttributes: [
      {
        AttributeKey: "EventSource",
        AttributeValue: "dynamodb.amazonaws.com",
      },
      // {
      //   AttributeKey: "EventName",
      //   AttributeValue: "PutItem",
      // },
    ],
    StartTime: startTime,
    EndTime: endTime,
    MaxResults: 15,
    NextToken: nextToken,
  };

  logger.info("Sending LookupEventCommand");
  do {
    try {
      const result: LookupEventsCommandOutput = await client.send(
        new LookupEventsCommand(params as LookupEventsCommandInput),
      );
      queryNumber += 1;
      // const filtered = [];
      // result.Events?.filter((e) => e.EventName && ITEM_EVENTS.includes(e.EventName)) || [];
      if (!result.Events || result.Events?.length < 1) {
        logger.info("No 'Events'");
        return;
      }
      for (const e of result.Events) {
        eventNames.add(e.EventName);
        if (e.EventName && ITEM_EVENTS.includes(e.EventName)) events.push(e);
      }
      // events.push(...filtered);
      nextToken = result.NextToken;
    } catch (err) {
      logger.error({ err }, "CloudTrail lookup failed");
      if (err instanceof ThrottlingException) {
        logger.error(`Queried ${queryNumber} times, received ${events.length}`);
      }
      nextToken = undefined;
      // return;
    }
  } while (nextToken);

  logger.info(`Queried ${queryNumber} times`);
  logger.info({ eventNames }, "EventNames");
  logger.info({ events }, "CloudTrail lookup result");

  const consoleEvents = events.filter((evt: Event) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const details = evt?.CloudTrailEvent ? JSON.parse(evt.CloudTrailEvent) : undefined;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!details?.userAgent || !details?.requestParameters?.table) return;

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
    return SourceType.console;
  } else {
    // @ts-expect-error it can't be undefined
    logger.info(`Update to ${tableName} likely came from SDK/API.`, consoleEvents[0]);
    return SourceType.app;
  }
};
