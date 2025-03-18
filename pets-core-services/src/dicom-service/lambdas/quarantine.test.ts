import {
  CopyObjectCommand,
  CopyObjectCommandOutput,
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
} from "@aws-sdk/client-s3";
import { mockClient } from "aws-sdk-client-mock";
import { describe, expect, test } from "vitest";

import awsClients from "../../shared/clients/aws";
import { handler, QUARANTINE_BUCKET } from "./quarantine";
import { EventBridgeEvent, EventBridgeEventDetails } from "./types";

const EVENT: EventBridgeEvent<string, EventBridgeEventDetails> = {
  version: "0",
  id: "12341234-1234-1234-1234-123412341234",
  "detail-type": "GuardDuty Malware Protection Object Scan Result",
  source: "aws.guardduty",
  account: "123412341234",
  time: "2025-03-10T08:17:24Z",
  region: "eu-west-2",
  resources: [
    "arn:aws:guardduty:eu-west-2:123412341234:malware-protection-plan/12341234123412341234",
  ],
  detail: {
    schemaVersion: "1.0",
    scanStatus: "COMPLETED",
    resourceType: "S3_OBJECT",
    s3ObjectDetails: {
      bucketName: "imageservice-source",
      objectKey: "test.txt",
      eTag: "59624357a45b93ede3ff284adc5fa078",
      versionId: "GOxuogcOVkXPnbMd_6._mmyHFPeXsKfF",
      s3Throttled: false,
    },
    scanResultDetails: {
      scanResultStatus: "THREATS_FOUND",
      threats: [
        {
          name: "Trojan.Script.3151",
        },
      ],
    },
  },
};

describe("Tests for image service lambda", () => {
  //@ts-expect-error type difference
  const s3ClientMock = mockClient(awsClients.s3Client);

  test("Copy file", () => {
    //@ts-expect-error type difference
    s3ClientMock.on(CopyObjectCommand).resolvesOnce({
      done: "OK",
    } as CopyObjectCommandOutput);
    //@ts-expect-error type difference
    s3ClientMock.on(DeleteObjectCommand).resolves({
      done: "OK",
    } as DeleteObjectCommandOutput);

    // Act
    const result = handler(EVENT);

    // Assert
    expect(result).toMatchObject({
      sourceBucket: "imageservice-source",
      destinationBucket: QUARANTINE_BUCKET,
      fileName: "test.txt",
      status: "OK",
    });
  });
});
