import { BatchGetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

type Key = Record<string, any>;

export class DynamoBatchLoader {
  static async batchLoad<T>({
    tableName,
    keys,
    client,
    mapItem,
    mapKey,
    maxBatchSize = 100,
  }: {
    tableName: string;
    keys: Key[];
    client: DynamoDBDocumentClient;
    mapItem: (item: Record<string, any>) => T;
    mapKey: (item: T) => string;
    maxBatchSize?: number;
  }): Promise<Map<string, T>> {
    if (!keys.length) return new Map();

    //  Deduplicate
    const uniqueKeys = Array.from(new Map(keys.map((k) => [JSON.stringify(k), k])).values());

    //  Chunk
    const chunks: Key[][] = [];
    for (let i = 0; i < uniqueKeys.length; i += maxBatchSize) {
      chunks.push(uniqueKeys.slice(i, i + maxBatchSize));
    }

    const results: T[] = [];

    for (const chunk of chunks) {
      let requestItems: Record<string, { Keys: Key[] }> = {
        [tableName]: { Keys: chunk },
      };

      let response;

      do {
        response = await client.send(new BatchGetCommand({ RequestItems: requestItems }));

        const rawItems: Record<string, unknown>[] =
          (response.Responses?.[tableName] as Record<string, unknown>[]) ?? [];

        const mappedItems = rawItems.map((item) => mapItem(item));
        results.push(...mappedItems);

        const unprocessed = response.UnprocessedKeys?.[tableName]?.Keys;

        requestItems =
          unprocessed && unprocessed.length ? { [tableName]: { Keys: unprocessed } } : ({} as any);
      } while (requestItems[tableName]?.Keys?.length);
    }

    return new Map(results.map((item) => [mapKey(item), item]));
  }
}
