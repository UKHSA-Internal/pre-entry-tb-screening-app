import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { describe, expect, test, vi } from "vitest";

import awsClients from "../../shared/clients/aws";
import { CountryCode } from "../../shared/country";
import { logger } from "../../shared/logger";
import { PetsAPIGatewayProxyEvent } from "../../shared/types";
import { mockAPIGwEvent } from "../../test/mocks/events";
import { NewClinic } from "../models/clinics";
import { getClinicHandler } from "./getClinic";

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
  const event: PetsAPIGatewayProxyEvent = {
    ...mockAPIGwEvent,
    resource: "/clinics/{clinicId}",
    path: "/clinics/12345",
    pathParameters: {
      clinicId: "12345",
    },
    httpMethod: "GET",
  };
  test("success response", async () => {
    ddbMock.on(GetCommand).resolves({
      Item: {
        ...clinicsDetails[0],
        pk: "CLINIC#t12345",
        sk: "CLINIC#ROOT",
      },
    });

    const res = await getClinicHandler({ ...event });
    expect(res.statusCode).toBe(200);
  });

  test("error response 500", async () => {
    const loggerMock = vi.spyOn(logger, "error").mockImplementation(() => null);
    ddbMock.on(GetCommand).rejects("DB Error");

    const res = await getClinicHandler({ ...event });
    expect(res.statusCode).toBe(500);
    expect(loggerMock).toHaveBeenLastCalledWith(
      "Fetching clinic with ID: 12345 failed",
      Error("DB Error"),
    );
  });

  test("error response with status code 404", async () => {
    const loggerMock = vi.spyOn(logger, "info").mockImplementation(() => null);
    ddbMock.on(GetCommand).resolves({ Item: [] });

    const res = await getClinicHandler({ ...event });
    expect(res.statusCode).toBe(404);
    expect(loggerMock).toHaveBeenCalled();
    expect(loggerMock).toHaveBeenLastCalledWith("No clinic details found");
  });
});
