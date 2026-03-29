import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DynamoBatchLoader } from "./batch-util";

// Mock class for client
class MockDynamoClient {
  send = vi.fn();
}

// Sample model for mapping
class TestItem {
  id: string;
  value: string;

  constructor(props: { id: string; value: string }) {
    this.id = props.id;
    this.value = props.value;
  }

  static fromDb(item: Record<string, any>) {
    return new TestItem({ id: item.id, value: item.value });
  }
}

describe("DynamoBatchLoader", () => {
  let client: MockDynamoClient;

  beforeEach(() => {
    client = new MockDynamoClient();
    client.send.mockReset();
  });

  it("returns empty map when no keys are provided", async () => {
    const result = await DynamoBatchLoader.batchLoad({
      tableName: "TestTable",
      keys: [],
      client: client as unknown as DynamoDBDocumentClient,
      mapItem: (item) => TestItem.fromDb(item),
      mapKey: (item) => item.id,
    });

    expect(result.size).toBe(0);
  });

  it("loads items from DynamoDB and maps correctly", async () => {
    // Mock DynamoDB response
    client.send.mockResolvedValueOnce({
      Responses: {
        TestTable: [
          { id: "1", value: "a" },
          { id: "2", value: "b" },
        ],
      },
    });

    const keys = [{ id: "1" }, { id: "2" }];

    const result = await DynamoBatchLoader.batchLoad({
      tableName: "TestTable",
      keys,
      client: client as unknown as DynamoDBDocumentClient,
      mapItem: (item) => TestItem.fromDb(item),
      mapKey: (item) => item.id,
    });

    expect(result.size).toBe(2);
    expect(result.get("1")?.value).toBe("a");
    expect(result.get("2")?.value).toBe("b");
  });

  it("deduplicates keys and handles unprocessed keys", async () => {
    // First response returns one unprocessed key
    client.send
      .mockResolvedValueOnce({
        Responses: { TestTable: [{ id: "1", value: "a" }] },
        UnprocessedKeys: { TestTable: { Keys: [{ id: "2" }] } },
      })
      // Second response returns the remaining key
      .mockResolvedValueOnce({
        Responses: { TestTable: [{ id: "2", value: "b" }] },
      });

    const keys = [{ id: "1" }, { id: "2" }, { id: "1" }]; // duplicate key "1"

    const result = await DynamoBatchLoader.batchLoad({
      tableName: "TestTable",
      keys,
      client: client as unknown as DynamoDBDocumentClient,
      mapItem: (item) => TestItem.fromDb(item),
      mapKey: (item) => item.id,
      maxBatchSize: 1, // force chunking
    });

    expect(result.size).toBe(2);
    expect(result.get("1")?.value).toBe("a");
    expect(result.get("2")?.value).toBe("b");

    // Ensure client.send was called twice (chunking + retry)
    expect(client.send).toHaveBeenCalledTimes(2);
  });
});
