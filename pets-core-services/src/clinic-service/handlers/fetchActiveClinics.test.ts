import { QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
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

describe("Fetching active clinics", () => {
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

  test("Fetching active clinics empty response", async () => {
    ddbMock.on(ScanCommand).resolves({
      Items: [],
    });
    const res = await fetchActiveClinicsHandler({ ...mockAPIGwEvent });
    expect(res.statusCode).toBe(404);
    expect(res.body).toContain("No active clinics exist");
  });

  test("success response for an active clinic", async () => {
    const mockEvent = Object.assign({}, mockAPIGwEvent);
    ddbMock.on(QueryCommand).resolves({
      Items: [
        {
          ...clinicsDetails[0],
          pk: "CLINICN#clinic-id-01",
          sk: "CLINIC#ROOT",
        },
      ],
    });
    mockEvent.queryStringParameters = { clinicId: "clinic-id-01" };

    const res = await fetchActiveClinicsHandler({ ...mockEvent });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toMatchObject({ isActive: true });
  });

  test("success response for an inactive clinic", async () => {
    const mockEvent = Object.assign({}, mockAPIGwEvent);
    ddbMock.on(QueryCommand).resolves({
      Items: [],
    });
    mockEvent.queryStringParameters = { clinicId: "clinic-id-02" };

    const res = await fetchActiveClinicsHandler({ ...mockEvent });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toMatchObject({ isActive: false });
  });

  test("db error response", async () => {
    const consoleMock = vi.spyOn(logger, "error").mockImplementation(() => undefined);
    const mockEvent = Object.assign({}, mockAPIGwEvent);
    ddbMock.rejects("DB Error");

    const res = await fetchActiveClinicsHandler({ ...mockEvent });

    // expect(consoleMock).toHaveBeenCalledOnce();
    expect(consoleMock).toHaveBeenCalledWith(Error("DB Error"), "Fetching Active Clinics Failed");
    expect(JSON.parse(res.body)).toMatchObject({ message: "Something went wrong" });
    expect(res.statusCode).toBe(500);
  });

  test("db error response while getting the active clinic", async () => {
    const consoleMock = vi.spyOn(logger, "error").mockImplementation(() => undefined);
    const mockEvent = Object.assign(
      {},
      { ...mockAPIGwEvent, queryStringParameters: { clinicId: "clinic-id-02" } },
    );
    ddbMock.rejects("DB Error");

    const res = await fetchActiveClinicsHandler({ ...mockEvent });

    // expect(consoleMock).toHaveBeenCalledOnce();
    expect(consoleMock).toHaveBeenCalledWith(
      "Checking clinic with ID: clinic-id-02 failed",
      Error("DB Error"),
    );
    expect(JSON.parse(res.body)).toMatchObject({ message: "Something went wrong" });
    expect(res.statusCode).toBe(500);
  });
});
