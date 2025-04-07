import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { describe, expect, test, vi } from "vitest";

import awsClients from "../../shared/clients/aws";
import { CountryCode } from "../../shared/country";
import { logger } from "../../shared/logger";
import { mockAPIGwEvent } from "../../test/mocks/events";
import { NewClinic } from "../models/clinics";
import { fetchActiveClinicsHandler } from "./fetchActiveClinics";

const clinicsDetails: NewClinic[] = [
  {
    clinicId: "clinic-id-01",
    name: "5tar-Clinic",
    city: "Town-of-ALA",
    country: CountryCode.ALA,
    startDate: "2025-01-01",
    endDate: null,
    createdBy: "test-clinic-creator@epost.this",
  },
  {
    clinicId: "clinic-id-02",
    name: "Town's Clinic",
    city: "Town One",
    country: CountryCode.KOR,
    startDate: "2025-01-02",
    endDate: "2030-01-25",
    createdBy: "info@eclinic.eu",
  },
];

describe("Fetching Clinic", () => {
  const ddbMock = mockClient(awsClients.dynamoDBDocClient);

  test("success response", async () => {
    ddbMock.on(ScanCommand).resolves({
      Items: [
        {
          ...clinicsDetails[0],
          pk: "CLINIC#clinic-id-01",
          sk: "CLINIC#ROOT",
        },
        {
          ...clinicsDetails[1],
          pk: "CLINIC#clinic-id-02",
          sk: "CLINIC#ROOT",
        },
      ],
    });
    const res = await fetchActiveClinicsHandler({ ...mockAPIGwEvent });
    expect(res.statusCode).toBe(200);
  });

  test("error response", async () => {
    const loggerMock = vi.spyOn(logger, "error").mockImplementation(() => null);
    ddbMock.on(ScanCommand).rejects("DB Error");

    const res = await fetchActiveClinicsHandler({ ...mockAPIGwEvent });
    expect(res.statusCode).toBe(500);
    expect(loggerMock).toHaveBeenCalled();
    expect(loggerMock).toHaveBeenLastCalledWith(
      Error("DB Error"),
      "Fetching Active Clinics Failed",
    );
  });
});
