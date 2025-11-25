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

  // Extract just the table name from ARN
  const tableName = tableArn ? tableArn.split("/")[1] : undefined;
  logger.info(`tableName: ${tableName}`);

  if (!tableName) {
    logger.error("Record is missing tableName");

    return;
  }

  const eventCategories: string[] = [];
  const eventNames: string[] = [];
  const eventSources: string[] = [];
  const userAgents: string[] = [];
  const usernames: string[] = [];
  const events: Event[] = [];
  let nextToken: string | undefined = undefined;

  const params = {
    LookupAttributes: [
      {
        AttributeKey: "EventName",
        AttributeValue: "DescribeTable",
      },
      {
        AttributeKey: "EventSource",
        AttributeValue: "dynamodb.amazonaws.com",
      },
    ],
    NextToken: nextToken,
  };

  logger.info("Sending LookupEventCommand");
  do {
    try {
      const result: LookupEventsCommandOutput = await client.send(
        new LookupEventsCommand(params as LookupEventsCommandInput),
      );
      if (!result.Events || result.Events?.length < 1) {
        logger.info({ result }, "No 'Events'");
      } else {
        for (const e of events) {
          if (!usernames.includes(e.Username as string)) usernames.push(e.Username as string);
          const cteventStr: string = e.CloudTrailEvent as string;
          if (!cteventStr) {
            continue;
          } else {
            try {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              const ctevent: Record<string, unknown> = JSON.parse(cteventStr);
              // Adding 'result' to events
              if (ctevent.eventCategory === "Data") events.push(...result.Events);

              if (!eventCategories.includes(ctevent.eventCategory as string))
                eventCategories.push(ctevent?.eventCategory as string);
              if (!eventNames.includes(ctevent.eventName as string))
                eventNames.push(ctevent?.eventName as string);
              if (!eventSources.includes(ctevent.eventSource as string))
                eventSources.push(ctevent?.eventSource as string);
              if (!userAgents.includes(ctevent.userAgent as string))
                userAgents.push(ctevent?.userAgent as string);
            } catch (e) {
              logger.error(e, "Error while parsing CloudTrailEvent string to JSON");
              continue;
            }
          }
        }
      }
      nextToken = result.NextToken;
      logger.info(nextToken);
    } catch (err) {
      if (err instanceof ThrottlingException) {
        logger.info(`ThrottlingException, received ${events.length}`);
      } else {
        logger.error({ err }, "CloudTrail lookup failed");
      }
      nextToken = undefined;
    }
  } while (nextToken && events.length < 300);

  if (events.length > 0) {
    logger.info({ ...events[0] }, `CloudTrail lookup result (1 of ${events.length})`);
    logger.info({ ...eventCategories }, "EventCategories ");
    logger.info({ ...eventNames }, "EventNames ");
    logger.info({ ...eventSources }, "EventSources ");
    logger.info({ ...userAgents }, "UserAgents ");
  } else {
    logger.info("No events");
  }

  const consoleEvents = events.filter((evt) => {
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
