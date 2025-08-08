import { DynamoDBStreamEvent } from "aws-lambda";

import { applicationDynamoDbJSON } from "../db-data/data-application";

export const mainEvent: DynamoDBStreamEvent = {
  Records: [
    {
      eventID: "31686e42312621b7ae06baf52be29800",
      eventName: "INSERT",
      eventVersion: "1.1",
      eventSource: "aws:dynamodb",
      awsRegion: "eu-west-2",
      dynamodb: {
        ApproximateCreationDateTime: 1550751349,
        Keys: {
          pk: {
            S: "APPLICATION#b3dc3b1e-2dbf-4e91-9d2b-ca089b679baf",
          },
          sk: {
            S: "APPLICATION#ROOT",
          },
        },
        NewImage: applicationDynamoDbJSON[0],
        SequenceNumber: "210600000000000318969213",
        SizeBytes: 1554,
        StreamViewType: "NEW_AND_OLD_IMAGES",
      },
      eventSourceARN:
        "arn:aws:dynamodb:eu-west-2:108782068086:table/application-details/stream/2019-02-21T09:49:27.002",
    },
  ],
};
