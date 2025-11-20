import {
  PutEventSelectorsCommand,
  PutEventSelectorsCommandInput,
  PutEventSelectorsCommandOutput,
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

  const params: PutEventSelectorsCommandInput = {
    TrailName: "arn:aws:cloudtrail:eu-west-2:108782068086:trail/halo-pets-nl2-avm-cloudtrail-main",
    EventSelectors: [
      {
        ReadWriteType: "All",
        IncludeManagementEvents: true,
        DataResources: [
          {
            Type: "AWS::DynamoDB::Table",
            Values: [
              "arn:aws:dynamodb:eu-west-2:108782068086:table/applicant-details",
              "arn:aws:dynamodb:eu-west-2:108782068086:table/application-details",
            ],
          },
        ],
        // ExcludeManagementEventSources: ["STRING_VALUE"],
      },
    ],
    AdvancedEventSelectors: [
      {
        Name: "Log all PutItam db events",
        FieldSelectors: [
          { Field: "eventCategory", Equals: ["Data"] },
          { Field: "eventName", Equals: ["PutItem", "DeleteItem"] },
          { Field: "resources.type", Equals: ["AWS::DynamoDB::Table"] },
          {
            Field: "resources.ARN",
            StartsWith: [
              "arn:aws:dynamodb:eu-west-2:108782068086:table/applicant-details",
              "arn:aws:dynamodb:eu-west-2:108782068086:table/application-details",
            ],
          },
        ],
      },
    ],
  };
  const command = new PutEventSelectorsCommand(params);
  const results: PutEventSelectorsCommandOutput = await client.send(command);

  logger.info({ results }, "Results:");

  return SourceType.app;
};
