import { describe, expect, test } from "vitest";

import { context } from "../../test/mocks/events";
import { mainEvent } from "../tests/resources/stream-event";
import { handler } from "./send-db-stream";

describe("Test for Integration Lambda", () => {
  test("Fetching an application", async () => {
    // Arrange
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const event = JSON.parse(JSON.stringify(mainEvent));

    // Act
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response = await handler(event, context, () => {});

    // Assert
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const batchItemFailures = response?.batchItemFailures ? response.batchItemFailures : [];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(batchItemFailures?.length).toBe(0);
  });
});
