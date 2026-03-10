import { describe, expect, test } from "vitest";

import { CountryCode } from "../../shared/country";
import { mockAPIGwEvent } from "../../test/mocks/events";
import { CreateClinicEvent, createClinicHandler } from "./createClinic";

const newClinic: CreateClinicEvent["parsedBody"] = {
  clinicId: "test-clinic-id",
  country: CountryCode.ALA,
  startDate: "01-01-2026",
  name: "test-clinic",
  city: "test",
  createdBy: "hardcoded@user.com",
};

describe("Create Clinic", () => {
  test("Clinic is created successfully", async () => {
    // Arrange
    const event: CreateClinicEvent = {
      ...mockAPIGwEvent,
      parsedBody: newClinic,
    };
    // Act
    const response = await createClinicHandler(event);

    // Assert
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject({
      clinicId: "test-clinic-id",
      country: CountryCode.ALA,
      startDate: new Date("01-01-2026").toISOString(),
      endDate: null,
      name: "test-clinic",
      city: "test",
      createdBy: "hardcoded@user.com",
    });
  });
});
