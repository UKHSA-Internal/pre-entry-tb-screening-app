import { applicationDynamoDbJSON } from "./db-data/data-application";

export const mainEvent = {
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
          vin: {
            S: "XMGDE02FS0H012345",
          },
          testResultId: {
            S: "1",
          },
        },
        NewImage: {
          ...applicationDynamoDbJSON[0],
        },
        SequenceNumber: "210600000000000318969213",
        SizeBytes: 1554,
        StreamViewType: "NEW_AND_OLD_IMAGES",
      },
      eventSourceARN:
        "arn:aws:dynamodb:eu-west-2:006106226016:table/cvs-develop-test-results/stream/2019-02-21T09:49:27.002",
    },
  ],
};
