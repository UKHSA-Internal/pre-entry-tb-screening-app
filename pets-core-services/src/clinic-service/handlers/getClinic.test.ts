import { describe, expect, test } from "vitest";

import { mockAPIGwEvent } from "../../test/mocks/events";
import { getClinicHandler } from "./getClinic";

describe("Get Clinic", () => {
  test("success response", async () => {
    const res = await getClinicHandler({ ...mockAPIGwEvent });
    expect(res.statusCode).toBe(200);
  });
});
