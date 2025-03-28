import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { describe, expect, test } from "vitest";

import awsClients from "../../shared/clients/aws";
import { CountryCode } from "../../shared/country";
import { mockAPIGwEvent } from "../../test/mocks/events";
import { NewClinic } from "../models/clinics";
import { checkActiveClinicHandler } from "./checkActiveClinic";

const activeClinicDetails: NewClinic = {
  clinicId: "clinic-id-01",
  name: "5tar-Clinic",
  city: "Town-of-ALA",
  country: CountryCode.ALA,
  startDate: "2025-01-01",
  endDate: null,
  createdBy: "test-clinic-creator@epost.this",
};

describe("Get active Clinic", () => {
  const ddbMock = mockClient(awsClients.dynamoDBDocClient);

  test("success response for active clinic", async () => {
    const mockEvent = Object.assign({}, mockAPIGwEvent);
    ddbMock.on(QueryCommand).resolves({
      Items: [
        {
          ...activeClinicDetails,
          pk: "CLINICN#clinic-id-01",
          sk: "CLINIC#ROOT",
        },
      ],
    });
    mockEvent.pathParameters = { clinicId: "clinic-id-01" };

    const res = await checkActiveClinicHandler({ ...mockEvent });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toMatchObject({ isActive: true });
  });

  test("success response for inactive clinic", async () => {
    const mockEvent = Object.assign({}, mockAPIGwEvent);
    ddbMock.on(QueryCommand).resolves({
      Items: [],
    });
    mockEvent.pathParameters = { clinicId: "clinic-id-02" };

    const res = await checkActiveClinicHandler({ ...mockEvent });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toMatchObject({ isActive: false });
  });
});
