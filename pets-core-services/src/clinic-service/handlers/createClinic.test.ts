import { describe, expect, test } from "vitest";

import { mockAPIGwEvent } from "../../test/mocks/events";
import { createClinicHandler } from "./createClinic";

describe("Create Clinic", () => {
  test("success response", async () => {
    const res = await createClinicHandler({ ...mockAPIGwEvent });
    expect(res.statusCode).toBe(200);
  });
});
