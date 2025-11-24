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

  const events: Event[] = [];
  let nextToken: string | undefined = undefined;

  const params = {
    // LookupAttributes: [
    //   {
    //     AttributeKey: "EventName",
    //     AttributeValue: "DescribeTable",
    //   },
    //   {
    //     AttributeKey: "EventSource",
    //     AttributeValue: "dynamodb.amazonaws.com",
    //   },
    // ],
    FieldSelectors: [
      {
        Field: "eventCategory",
        Equals: ["Data"],
      },
      {
        Field: "resources.type",
        Equals: ["AWS::DynamoDB::Table"],
      },
      {
        Field: "eventName",
        Equals: ["PutItem", "UpdateItem", "DeleteItem"],
      },
      {
        Field: "resources.ARN",
        Equals: [
          "arn:aws:dynamodb:REGION:ACCOUNT_ID:table/<table1Name>>",
          "arn:aws:dynamodb:REGION:ACCOUNT_ID:table/<<table2Name>>",
        ],
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
        events.push(...result.Events);
      }
      nextToken = result.NextToken;
    } catch (err) {
      logger.error({ err }, "CloudTrail lookup failed");
      if (err instanceof ThrottlingException) {
        logger.error(`ERR / Received ${events.length}`);
      }
      nextToken = undefined;
      // return;
    }
  } while (nextToken);

  logger.info({ events }, "CloudTrail lookup result");

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
