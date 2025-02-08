import { describe, expect, test } from "vitest";

import { mockAPIGwEvent } from "../../test/mocks/events";
import { fetchClinicsHandler } from "./fetchClinics";

describe("Fetching Clinic", () => {
  test("success response", async () => {
    const res = await fetchClinicsHandler({ ...mockAPIGwEvent });
    expect(res.statusCode).toBe(200);
  });
});
