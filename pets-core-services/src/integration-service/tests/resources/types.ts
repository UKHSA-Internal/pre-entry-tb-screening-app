type dbKeysType = {
  pk: string;
  sk: string;
};

type dynamodbType = {
  ApproximateCreationDateTime: number;
  Keys: dbKeysType;
  NewImage: Record<string, any>;
  SequenceNumber: string;
  SizeBytes: number;
  StreamViewType: string;
};

type recordsType = {
  eventID: string;
  eventName: string;
  eventVersion: string;
  eventSource: string;
  awsRegion: string;
  dynamodb: dynamodbType;
  eventSourceARN: string;
};

export type eventType = {
  Records: recordsType[];
};
