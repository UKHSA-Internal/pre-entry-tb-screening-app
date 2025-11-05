import { Context } from "aws-lambda";
import { afterAll, describe, expect, it, vi } from "vitest";

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

      expect(sendDbStreamMessage).toHaveBeenCalledWith(JSON.stringify(result));
      expect(sendDbStreamMessage).toHaveBeenCalledTimes(1);
    });
  });
});
