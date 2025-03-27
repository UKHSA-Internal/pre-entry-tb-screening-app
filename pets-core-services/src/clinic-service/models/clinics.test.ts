import { GetCommand, PutCommand, QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { beforeEach, describe, expect, test, vi } from "vitest";

import awsClients from "../../shared/clients/aws";
import { CountryCode } from "../../shared/country";
import { Clinic, NewClinic } from "./clinics";

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

describe("Tests for Clinic Model", () => {
  const ddbMock = mockClient(awsClients.dynamoDBDocClient);

  beforeEach(() => {
    ddbMock.reset();
  });

  test("Create New Clinic Successfully", async () => {
    // Arrange
    ddbMock.on(PutCommand);
    vi.useFakeTimers();
    const expectedDateTime = "2025-03-04";
    vi.setSystemTime(expectedDateTime);

    // Act
    const clinic = await Clinic.createNewClinic(clinicsDetails[0]);

    // Assert
    expect(clinic).toMatchObject({
      ...clinicsDetails[0],
      startDate: new Date(expectedDateTime),
      endDate: null,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(ddbMock.commandCalls(PutCommand)[0].firstArg.input).toMatchObject({
      TableName: "test-clinic-details",
      Item: {
        ...clinicsDetails[0],
        startDate: "2025-03-04T00:00:00.000Z",
        pk: "CLINIC#clinic-id-01",
        sk: "CLINIC#ROOT",
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(ddbMock.commandCalls(PutCommand)[0].firstArg.input).toMatchObject({
      ConditionExpression: "attribute_not_exists(pk) AND attribute_not_exists(sk)",
    });
  });

  test("Getting clinic by clinicID", async () => {
    ddbMock.on(GetCommand).resolves({
      Item: {
        ...clinicsDetails[0],
        pk: "CLINICN#test-id-01",
        sk: "CLINIC#ROOT",
      },
    });

    // Act
    const clinic = await Clinic.getClinicById("clinic-id-01");

    // Assert
    expect(clinic).toMatchObject({
      ...clinicsDetails[0],
      startDate: new Date("2025-01-01"),
      endDate: null,
    });
  });

  test("Get all active clinic details", async () => {
    // Arrange
    vi.useFakeTimers();
    vi.setSystemTime("2025-03-04");

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

    // Act
    const searchResult = await Clinic.getActiveClinics();

    // Assert
    expect(searchResult).toHaveLength(2);
    expect(searchResult).toMatchObject([
      {
        ...clinicsDetails[0],
        startDate: new Date("2025-01-01"),
        endDate: null,
      },
      {
        ...clinicsDetails[1],
        startDate: new Date("2025-01-02"),
        endDate: new Date("2030-01-25"),
      },
    ]);
  });

  test("Check active clinic with endDate null", async () => {
    ddbMock.on(QueryCommand).resolves({
      Items: [
        {
          ...clinicsDetails[0],
          startDate: new Date(clinicsDetails[0].startDate),
          endDate: null,
          pk: "CLINICN#test-id-01",
          sk: "CLINIC#DROOT",
        },
      ],
    });

    // Act
    const active = await Clinic.isActiveClinic("clinic-id-01");

    // Assert
    expect(active).toBeTruthy();
  });

  test("Check active clinic with endDate in future", async () => {
    ddbMock.on(QueryCommand).resolves({
      Items: [
        {
          ...clinicsDetails[1],
          startDate: new Date(clinicsDetails[1].startDate),
          endDate: clinicsDetails[1].endDate,
          pk: "CLINICN#test-id-01",
          sk: "CLINIC#DROOT",
        },
      ],
    });

    // Act
    const active = await Clinic.isActiveClinic("clinic-id-02");

    // Assert
    expect(active).toBeTruthy();
  });
});
