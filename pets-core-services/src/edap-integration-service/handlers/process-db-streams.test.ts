import { Context } from "aws-lambda";
import { afterAll, describe, expect, it, vi } from "vitest";

import { logger } from "../../shared/logger";
import { SQService } from "../services/sqs-service";
import { StreamService } from "../services/stream-service";
import { mainEvent } from "../tests/resources/stream-event";
import { edapIntegrationHandler } from "./process-db-streams";

describe("handler Function", () => {
  const ctx = "" as unknown as Context;
  afterAll(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  describe("if the event is undefined", () => {
    it("should return undefined", async () => {
      expect.assertions(1);
      try {
        await edapIntegrationHandler(undefined, ctx, () => {
          return;
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(e.message).toBe("ERROR: event is not defined");
        console.error(e);
      }
    });
  });

  describe("with good event", () => {
    it("should invoke SQS service with correct params", async () => {
      const result = [{ test: "result" }];
      const sendDbStreamMessage = vi.fn();
      SQService.prototype.sendDbStreamMessage = sendDbStreamMessage;
      StreamService.getClinicDataStream = vi.fn().mockReturnValue(result);

      try {
        await edapIntegrationHandler(mainEvent, ctx, () => {
          return;
        });
      } catch (e) {
        expect(e).toMatchObject({ what: "?" });
        console.error(e);
      }

      expect(sendDbStreamMessage).toHaveBeenCalledWith(result);
      expect(sendDbStreamMessage).toHaveBeenCalledTimes(1);
    });

    it("should log unexpected record structure when getClinicDataStream returns undefined", async () => {
      const errorLoggerMock = vi.spyOn(logger, "error").mockImplementation(() => null);
      const sendDbStreamMessage = vi.fn();
      SQService.prototype.sendDbStreamMessage = sendDbStreamMessage;
      StreamService.getClinicDataStream = vi.fn().mockReturnValue(undefined);

      const result = await edapIntegrationHandler(mainEvent, ctx, () => {
        return;
      });

      expect(sendDbStreamMessage).not.toHaveBeenCalled();
      expect(errorLoggerMock).toHaveBeenCalledWith(
        { record: mainEvent.Records[0] },
        "Unexpected record structure",
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(result.batchItemFailures).toHaveLength(0);
      errorLoggerMock.mockRestore();
    });

    it("should add to batchItemFailures and call sendToDLQ when sendDbStreamMessage throws", async () => {
      const processedData = { pk: "APPLICATION#123", sk: "APPLICATION#ROOT" };
      StreamService.getClinicDataStream = vi.fn().mockReturnValue(processedData);
      const sendDbStreamMessage = vi.fn().mockRejectedValue(new Error("SQS send failed"));
      const sendToDLQ = vi.fn().mockResolvedValue(undefined);
      SQService.prototype.sendDbStreamMessage = sendDbStreamMessage;
      SQService.prototype.sendToDLQ = sendToDLQ;

      const result = await edapIntegrationHandler(mainEvent, ctx, () => {
        return;
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(result.batchItemFailures).toHaveLength(1);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(result.batchItemFailures[0].itemIdentifier).toBe(
        mainEvent.Records[0].dynamodb?.SequenceNumber,
      );
      expect(sendToDLQ).toHaveBeenCalledWith(mainEvent.Records[0]);
    });

    it("should throw when both sendDbStreamMessage and sendToDLQ fail", async () => {
      StreamService.getClinicDataStream = vi.fn().mockReturnValue({ pk: "test" });
      SQService.prototype.sendDbStreamMessage = vi.fn().mockRejectedValue(new Error("SQS error"));
      SQService.prototype.sendToDLQ = vi.fn().mockRejectedValue(new Error("DLQ error"));

      await expect(
        edapIntegrationHandler(mainEvent, ctx, () => {
          return;
        }),
      ).rejects.toThrow("Record can't be sent in the SQS/DLQ message");
    });
  });
});
