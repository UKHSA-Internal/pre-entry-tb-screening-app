import {
  CreateQueueCommand,
  GetQueueUrlCommand,
  GetQueueUrlRequest,
  ReceiveMessageCommand,
  SendMessageCommand,
  SendMessageCommandOutput,
  SQSClient,
} from "@aws-sdk/client-sqs";
import { DynamoDBRecord } from "aws-lambda";
import { mockClient } from "aws-sdk-client-mock";
import { beforeEach, describe, expect, test } from "vitest";

import { SQService } from "../../services/SQService";
import { StreamService } from "../../services/StreamService";
import { SQMockClient } from "../models/SQMockClient";
import { applicationData } from "../resources/db-data/data-application";
import { mainEvent } from "../resources/stream-event";
import { eventType } from "../resources/types";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const event: eventType = JSON.parse(JSON.stringify(mainEvent));

describe("cert-gen-init", () => {
  let processedEvent: any;

  describe("StreamService", () => {
    describe("when fetching test result stream and the eventName is INSERT", () => {
      test("should result in an array of filtered js objects", () => {
        processedEvent = StreamService.getClinicDataStream(event.Records[0] as DynamoDBRecord);
        expect(processedEvent).toEqual([
          {
            applicationId: "b3dc3b1e-2dbf-4e91-9d2b-ca089b679baf",
            clinicId: "UK/PETS/02",
            createdBy: "pets.tester1@hotmail.com",
            dateCreated: "2025-04-22T10:10:26.714Z",
            pk: "APPLICATION#b3dc3b1e-2dbf-4e91-9d2b-ca089b679baf",
            sk: "APPLICATION#ROOT",
          },
        ]);
      });
    });

    describe("when fetching test result stream and the eventName is MODIFY", () => {
      test("shouldn't result in an array of filtered js objects when PROCESS_MODIFY_EVENTS is false", () => {
        process.env.PROCESS_MODIFY_EVENTS = "false";
        event.Records[0].eventName = "MODIFY";
        processedEvent = StreamService.getClinicDataStream(event.Records[0] as DynamoDBRecord);
        expect(processedEvent).toHaveLength(0);
      });

      test("should result in an array of filtered js objects when PROCESS_MODIFY_EVENTS is true", () => {
        process.env.PROCESS_MODIFY_EVENTS = "true";
        event.Records[0].eventName = "MODIFY";
        processedEvent = StreamService.getClinicDataStream(event.Records[0] as DynamoDBRecord);
        expect(processedEvent).toHaveLength(1);
        expect(processedEvent).toEqual(applicationData);
      });

      test("should throw an error if PROCESS_MODIFY_EVENTS is not true or false", () => {
        process.env.PROCESS_MODIFY_EVENTS = "";
        event.Records[0].eventName = "MODIFY";
        expect(() => {
          StreamService.getClinicDataStream(event.Records[0] as DynamoDBRecord);
        }).toThrowError();
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
        test("should successfully add the records to the certGen queue", () => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents
          const sendMessagePromises: Array<Promise<any | SendMessageCommandOutput>> = [];
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          processedEvent.forEach((record: any) => {
            sendMessagePromises.push(sqService.sendCertGenMessage(JSON.stringify(record)));
          });
          return Promise.all(sendMessagePromises).catch((error: any) => {
            expect(error).toBeInstanceOf(Error);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(error.message).toEqual("Queue cert-gen-q was not found.");
          });
        });
      });

      describe("and the queue does exist", () => {
        test("should successfully add the records to the certGen queue", () => {
          const sendMessagePromises: Array<Promise<any>> = [];
          void sqService.sqsClient.send(
            new CreateQueueCommand({
              QueueName: "cert-gen-q",
            }),
          );

          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          processedEvent.forEach((record: any) => {
            sendMessagePromises.push(sqService.sendCertGenMessage(JSON.stringify(record)));
          });

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
