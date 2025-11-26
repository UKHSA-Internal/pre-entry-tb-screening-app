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
  const userIdentities: string[] = [];
  const reqParams: string[] = [];
  const reqParamKeys: string[] = [];
  const tableNames: string[] = [];
  let resultReceived = 0;
  let nextToken: string | undefined = undefined;

  const params = {
    LookupAttributes: [
      {
        AttributeKey: "EventName",
        AttributeValue: "DescribeTable",
      },
      // {
      //   AttributeKey: "EventName",
      //   AttributeValue: "PutItem",
      // },
      // {
      //   AttributeKey: "EventName",
      //   AttributeValue: "UpdateItem",
      // },
      // {
      //   AttributeKey: "EventName",
      //   AttributeValue: "DeleteItem",
      // },
      // {
      //   AttributeKey: "EventSource",
      //   AttributeValue: "dynamodb.amazonaws.com",
      // },
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
        resultReceived += result.Events.length;
        events.push(...result.Events);

        for (const e of events) {
          // Add unique Usernames for logging
          if (!usernames.includes(e.Username as string)) usernames.push(e.Username as string);
          const cteventStr: string = e.CloudTrailEvent as string;

          if (!cteventStr) {
            continue;
          } else {
            let ctevent: Record<string, unknown> = {};
            try {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              ctevent = JSON.parse(cteventStr);
            } catch (e) {
              logger.error(e, "Error while parsing CloudTrailEvent string to JSON");
              continue;
            }
            // Adding 'result' to events
            // if (ctevent.eventCategory === "Data") events.push(...result.Events);

            // Getting values for logging
            if (!eventCategories.includes(ctevent.eventCategory as string))
              eventCategories.push(ctevent?.eventCategory as string);
            if (!eventNames.includes(ctevent.eventName as string))
              eventNames.push(ctevent?.eventName as string);
            if (!eventSources.includes(ctevent.eventSource as string))
              eventSources.push(ctevent?.eventSource as string);
            if (!userAgents.includes(ctevent.userAgent as string))
              userAgents.push(ctevent?.userAgent as string);
            // @ts-expect-error ignore
            if (!userIdentities.includes(ctevent?.userIdentity?.arn as string))
              // @ts-expect-error ignore
              userIdentities.push(ctevent?.userIdentity?.arn as string);

            try {
              if (ctevent?.requestParameters) {
                // @ts-expect-error ignore
                for (const [key, value] of ctevent.requestParameters) {
                  if (!reqParamKeys.includes(key as string)) reqParamKeys.push(key as string);
                  if (key === "tableName" && !tableNames.includes(value as string))
                    tableNames.push(value as string);
                }
                if (!reqParams.includes(ctevent.requestParameters as string))
                  reqParams.push(ctevent?.requestParameters as string);
              }
            } catch (error) {
              logger.error({ ctevent }, "requestParameters could not be processed");
              throw error;
            }
          }
        }
      }
      nextToken = result.NextToken;
    } catch (err) {
      if (err instanceof ThrottlingException) {
        logger.info(`ThrottlingException, received ${events.length}`);
      } else {
        logger.error({ err }, "CloudTrail lookup failed");
      }
      nextToken = undefined;
    }
  } while (nextToken && events.length < 300);

  logger.info(`All results fetched: ${resultReceived}`);

  if (events.length > 0) {
    logger.info({ ...events[0] }, `CloudTrail filtered result (1 of ${events.length})`);
    logger.info({ ...eventCategories }, "EventCategories ");
    logger.info({ ...eventNames }, "EventNames ");
    logger.info({ ...eventSources }, "EventSources ");
    logger.info({ ...userAgents }, "UserAgents ");

    logger.info({ ...userIdentities }, "userIdentities ");
    logger.info({ ...reqParams }, "requestParameters ");
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
