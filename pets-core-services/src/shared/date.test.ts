import { describe, expect, it } from "vitest";

import { getDateWithoutTime } from "./date";

describe("getDateWithoutTime", () => {
  it("should return the correct date in YYYY-MM-DD format", () => {
    const date = new Date("2025-02-08T14:30:00Z");
    expect(getDateWithoutTime(date)).toBe("2025-02-08");
  });
});
