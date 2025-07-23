import { Context } from "aws-lambda";
import { afterAll, describe, expect, it, vi } from "vitest";

import { handler } from "../../lambdas/integration";
import { SQService } from "../../services/SQService";
import { StreamService } from "../../services/StreamService";

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
      const sendCertGenMessage = vi.fn();
      SQService.prototype.sendCertGenMessage = sendCertGenMessage;
      StreamService.getTestResultStream = vi
        .fn()
        .mockReturnValue([{ TestRecord: "updateStatusMessage" }]);
      // Utils.filterCertificateGenerationRecords = vi
      //   .fn()
      //   .mockReturnValue([{ TestRecord: "certGenMessage" }]);

      try {
        await handler({ Records: ["this is an event"] }, ctx, () => {
          return;
        });
      } catch (e) {
        console.error(e);
      }
      expect(sendCertGenMessage).toHaveBeenCalledWith(
        JSON.stringify({ TestRecord: "updateStatusMessage" }),
      );
      expect(sendCertGenMessage).toHaveBeenCalledTimes(1);
    });
  });

  describe("when SQService throws error", () => {
    it("should throw error if code is not InvalidParameterValue", async () => {
      StreamService.getTestResultStream = vi.fn().mockReturnValue([{}]);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      const myError = new Error("It Broke!") as any;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      myError.code = "SomeError";
      SQService.prototype.sendCertGenMessage = vi.fn().mockRejectedValue(myError);
      StreamService.getTestResultStream = vi.fn().mockReturnValue([{ test: "thing" }]);
      // Utils.filterCertificateGenerationRecords = vi.fn().mockReturnValue([{ test: "thing" }]);

      expect.assertions(1);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const returnedInfo = await handler({ Records: ["this is an event"] }, ctx, () => {
        return;
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(returnedInfo.batchItemFailures.length).toBe(1);
    });
    it("should not throw error if code is InvalidParameterValue", async () => {
      StreamService.getTestResultStream = vi.fn().mockReturnValue([{}]);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      const myError = new Error("It Broke!") as any;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      myError.code = "InvalidParameterValue";
      SQService.prototype.sendCertGenMessage = vi.fn().mockRejectedValue(myError);
      StreamService.getTestResultStream = vi.fn().mockReturnValue([{ test: "thing" }]);
      // Utils.filterCertificateGenerationRecords = vi.fn().mockReturnValue([{ test: "thing" }]);

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
