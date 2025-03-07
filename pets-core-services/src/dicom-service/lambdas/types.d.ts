export interface s3ObjectDetailsObject {
  bucketName: string;
  objectKey: string;
  eTag: string;
  versionId: string;
  s3Throttled: boolean;
}

export interface scanResultDetailsObject {
  scanResultStatus: string;
  threats: string | undefined;
}

export interface EventBridgeEventDetails {
  schemaVersion: string;
  scanStatus: string;
  resourceType: string;
  s3ObjectDetails: s3ObjectDetailsObject;
  scanResultDetails: scanResultDetailsObject;
}

export interface EventBridgeEvent<TDetailType extends string, EventBridgeEventDetails> {
  id: string;
  version: string;
  account: string;
  time: string;
  region: string;
  resources: string[];
  source: string;
  "detail-type": TDetailType;
  detail: EventBridgeEventDetails;
  "replay-name"?: string;
}
