import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { describe, expect, test, vi } from "vitest";
import { z } from "zod";

import awsClients from "../../shared/clients/aws";
import { CountryCode } from "../../shared/country";
import { logger } from "../../shared/logger";
import { mockAPIGwEvent } from "../../test/mocks/events";
import { NewClinic } from "../models/clinics";
import { ClinicSchema, ClinicWithStatusSchema } from "../types/zod-schema";
import { fetchClinicsHandler } from "./fetchClinics";

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

describe("Fetching Clinics", () => {
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

    const res = await fetchClinicsHandler({ ...mockAPIGwEvent });
    expect(res.statusCode).toBe(200);
  });

  test("returns all clinics, active or not, with isActive and the existing fields", async () => {
    ddbMock.on(ScanCommand).resolves({
      Items: [
        { ...clinicsDetails[0], pk: "CLINIC#clinic-id-01", sk: "CLINIC#ROOT" },
        {
          ...clinicsDetails[1],
          endDate: "2020-01-01T00:00:00.000Z",
          pk: "CLINIC#clinic-id-02",
          sk: "CLINIC#ROOT",
        },
      ],
    });

    const res = await fetchClinicsHandler({ ...mockAPIGwEvent });
    const body = JSON.parse(res.body) as (z.infer<typeof ClinicWithStatusSchema> & {
      isActive: boolean;
    })[];

    expect(body.map((c) => [c.clinicId, c.isActive])).toEqual([
      ["clinic-id-01", true],
      ["clinic-id-02", false],
    ]);
    expect(() => z.array(ClinicWithStatusSchema).parse(body)).not.toThrow();
    // Existing consumers see the same fields plus isActive
    expect(Object.keys(body[0]).sort()).toEqual(
      [
        "city",
        "clinicId",
        "country",
        "createdBy",
        "endDate",
        "isActive",
        "name",
        "startDate",
      ].sort(),
    );
  });

  test("clinic creation schema does not require isActive", () => {
    expect(() => ClinicSchema.parse(clinicsDetails[0])).not.toThrow();
  });

  test("error response 500", async () => {
    const loggerMock = vi.spyOn(logger, "error").mockImplementation(() => null);
    ddbMock.on(ScanCommand).rejects("DB Error");

    const res = await fetchClinicsHandler({ ...mockAPIGwEvent });
    expect(res.statusCode).toBe(500);
    expect(loggerMock).toHaveBeenCalled();
    expect(loggerMock).toHaveBeenLastCalledWith(Error("DB Error"), "Fetching Clinics Failed");
  });

  test("error response with status code 404", async () => {
    const loggerMock = vi.spyOn(logger, "info").mockImplementation(() => null);
    ddbMock.on(ScanCommand).resolves({ Items: [] });

    const res = await fetchClinicsHandler({ ...mockAPIGwEvent });
    expect(res.statusCode).toBe(404);
    expect(loggerMock).toHaveBeenCalled();
    expect(loggerMock).toHaveBeenLastCalledWith(
      { resultCount: 0 },
      "Clinics data fetched successfully",
    );
  });
});
