import { Context } from "aws-lambda";
import { afterAll, describe, expect, it, vi } from "vitest";

import { SQService } from "../services/sqs-service";
import { StreamService } from "../services/stream-service";
import { mainEvent } from "../tests/resources/stream-event";
import { handler } from "./process-db-streams";

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
        await handler(undefined, ctx, () => {
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
        await handler(mainEvent, ctx, () => {
          return;
        });
      } catch (e) {
        expect(e).toMatchObject({ what: "?" });
        console.error(e);
      }

      expect(sendDbStreamMessage).toHaveBeenCalledWith(JSON.stringify(result));
      expect(sendDbStreamMessage).toHaveBeenCalledTimes(1);
    });
  });

  describe("when SQService throws error", () => {
    it("should throw error if code is not InvalidParameterValue", async () => {
      StreamService.getClinicDataStream = vi.fn().mockReturnValue([{}]);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      const myError = new Error("It Broke!") as any;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      myError.code = "SomeError";
      SQService.prototype.sendDbStreamMessage = vi.fn().mockRejectedValue(myError);
      StreamService.getClinicDataStream = vi.fn().mockReturnValue([{ test: "thing" }]);

      expect.assertions(1);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const returnedInfo = await handler({ Records: ["this is an event"] }, ctx, () => {
        return;
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(returnedInfo.batchItemFailures.length).toBe(1);
    });
    it("should not throw error if code is InvalidParameterValue", async () => {
      StreamService.getClinicDataStream = vi.fn().mockReturnValue([{}]);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      const myError = new Error("It Broke!") as any;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      myError.code = "InvalidParameterValue";
      SQService.prototype.sendDbStreamMessage = vi.fn().mockRejectedValue(myError);
      StreamService.getClinicDataStream = vi.fn().mockReturnValue([{ test: "thing" }]);

      expect.assertions(1);
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const result = await handler({ Records: ["this is an event"] }, ctx, () => {
          return;
        });
        expect(result).toBe({});
      } catch (e) {
        console.error(e);
      }
    });
  });
});
