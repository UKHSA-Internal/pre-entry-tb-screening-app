import {
  CreateQueueCommand,
  GetQueueUrlCommand,
  GetQueueUrlRequest,
  ReceiveMessageCommand,
  SendMessageCommand,
  SendMessageCommandOutput,
  SQSClient,
} from "@aws-sdk/client-sqs";
import * as dynamoUtils from "@aws-sdk/util-dynamodb";
import { DynamoDBRecord, DynamoDBStreamEvent } from "aws-lambda";
import { mockClient } from "aws-sdk-client-mock";
import { beforeEach, describe, expect, test, vi } from "vitest";

// Wrap unmarshall in a vi.fn so vi.mocked() can intercept it inside stream-service.ts
vi.mock("@aws-sdk/util-dynamodb", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@aws-sdk/util-dynamodb")>();
  return {
    ...actual,
    unmarshall: vi.fn(actual.unmarshall),
  };
});

import { logger } from "../../shared/logger";
import { applicationData } from "../tests/db-data/data-application";
import { SQMockClient } from "../tests/models/SQMockClient";
import { mainEvent } from "../tests/resources/stream-event";
import { SQService } from "./sqs-service";
import { StreamService } from "./stream-service";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const event: DynamoDBStreamEvent = JSON.parse(JSON.stringify(mainEvent));

describe("init", () => {
  let processedEvent: any;

  describe("StreamService", () => {
    describe("when fetching data stream and the eventName is INSERT", () => {
      test("should result in an array of filtered js objects", () => {
        processedEvent = StreamService.getClinicDataStream(event.Records[0]);
        expect(processedEvent).toEqual({
          applicationId: "b3dc3b1e-2dbf-4e91-9d2b-ca089b679baf",
          clinicId: "UK/PETS/02",
          createdBy: "pets.tester1@hotmail.com",
          dateCreated: "2025-04-22T10:10:26.714Z",
          pk: "APPLICATION#b3dc3b1e-2dbf-4e91-9d2b-ca089b679baf",
          sk: "APPLICATION#ROOT",
        });
      });
    });

    describe("when fetching data stream and the eventName is MODIFY", () => {
      test("should result in an array of filtered js objects when PROCESS_MODIFY_EVENTS is true", () => {
        event.Records[0].eventName = "MODIFY";
        processedEvent = StreamService.getClinicDataStream(event.Records[0]);
        expect(processedEvent).toMatchObject(applicationData[0]);
      });
    });

    describe("when fetching data stream and the eventName is other than INSERT or MODIFY", () => {
      test("should create appropriate message about it", () => {
        const loggerMock = vi.spyOn(logger, "info").mockImplementation(() => null);
        // @ts-expect-error ignore
        event.Records[0].eventName = "OTHER?";
        processedEvent = StreamService.getClinicDataStream(event.Records[0]);
        expect(loggerMock).toHaveBeenNthCalledWith(1, "event name was not of correct type");
      });
    });
    describe("when fetching data stream and there is no NewImage", () => {
      test("should log 'No NewImage' and return empty object", () => {
        const loggerMock = vi.spyOn(logger, "info").mockImplementation(() => null);
        const recordWithoutNewImage: DynamoDBRecord = {
          ...event.Records[0],
          eventName: "INSERT",
          dynamodb: {},
        };
        const result = StreamService.getClinicDataStream(recordWithoutNewImage);
        expect(loggerMock).toHaveBeenCalledWith("No 'NewImage'");
        expect(result).toEqual({});
      });
    });

    describe("when fetching data stream with MODIFY event and no NewImage", () => {
      test("should log 'No NewImage' and return empty object", () => {
        const loggerMock = vi.spyOn(logger, "info").mockImplementation(() => null);
        const recordWithoutNewImage: DynamoDBRecord = {
          ...event.Records[0],
          eventName: "MODIFY",
          dynamodb: {},
        };
        const result = StreamService.getClinicDataStream(recordWithoutNewImage);
        expect(loggerMock).toHaveBeenCalledWith("No 'NewImage'");
        expect(result).toEqual({});
      });
    });

    describe("when unmarshall throws an error for the record", () => {
      test("should log the error and return empty object", () => {
        const loggerErrorMock = vi.spyOn(logger, "error").mockImplementation(() => null);
        vi.mocked(dynamoUtils.unmarshall).mockImplementationOnce(() => {
          throw new Error("Invalid DynamoDB data");
        });
        const recordWithNewImage: DynamoDBRecord = {
          ...event.Records[0],
          eventName: "INSERT",
          dynamodb: {
            NewImage: { pk: { S: "test" } },
          },
        };
        const result = StreamService.getClinicDataStream(recordWithNewImage);
        expect(loggerErrorMock).toHaveBeenCalledTimes(1);
        const [firstArg, secondArg] = loggerErrorMock.mock.calls[0] as [{ error: unknown }, string];
        expect(firstArg.error).toBeInstanceOf(Error);
        expect(secondArg).toContain("unmarshall error");
        expect(result).toEqual({});
      });
    });
  });

  describe("SQService", () => {
    const client = mockClient(SQSClient);
    const mock = new SQMockClient();
    const sqService = new SQService();
    // const config = Configuration.getInstance().getConfig();
    const config = {
      sqs: {
        local: {
          QueueName: ["just-name"],
        },
      },
    };
    mock.createQueue({
      QueueName: config.sqs.local.QueueName ? config.sqs.local.QueueName[0] : "",
    });
    beforeEach(() => {
      // client.reset();

      client.on(GetQueueUrlCommand).resolves(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        mock.getQueueUrl(
          config.sqs.local.QueueName
            ? (config.sqs.local.QueueName[0] as unknown as GetQueueUrlRequest)
            : ("" as unknown as GetQueueUrlRequest),
        ),
      );
      client
        .on(SendMessageCommand)
        .resolves(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          mock.sendMessage({
            QueueUrl: config.sqs.local.QueueName[0],
            MessageBody: JSON.stringify(applicationData),
          }),
        )
        .on(ReceiveMessageCommand)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        .resolves(mock.receiveMessage({ QueueUrl: config.sqs.local.QueueName[0] }));
    });
    describe("when adding a record to the queue", () => {
      describe("and the queue does not exist", () => {
        test("should successfully add the records to the queue", () => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents
          const sendMessagePromises: Array<Promise<any | SendMessageCommandOutput>> = [];
          sendMessagePromises.push(sqService.sendDbStreamMessage(processedEvent as DynamoDBRecord));
          return Promise.all(sendMessagePromises).catch((error: any) => {
            expect(error).toBeInstanceOf(Error);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(error.message).toEqual("Queue was not found.");
          });
        });
      });

      describe("and the queue does exist", () => {
        test("should successfully add the records to the queue", () => {
          const sendMessagePromises: Array<Promise<any>> = [];
          void sqService.sqsClient.send(
            new CreateQueueCommand({
              QueueName: "test-queue",
            }),
          );

          sendMessagePromises.push(sqService.sendDbStreamMessage(processedEvent as DynamoDBRecord));

          expect.assertions(0);
          return Promise.all(sendMessagePromises).catch((error: any) => {
            console.error(error);
            expect(error).toBeFalsy();
          });
        });
      });
    });
  });
});
