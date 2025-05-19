import { GetCommand, PutCommand, QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { beforeEach, describe, expect, test, vi } from "vitest";

import awsClients from "../../shared/clients/aws";
import { CountryCode } from "../../shared/country";
import { logger } from "../../shared/logger";
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
const clinicNoStartDate = {
  clinicId: "clinic-id-03",
  name: "Town's Clinic",
  city: "Town One",
  country: CountryCode.KOR,
  startDate: "",
  endDate: null,
  createdBy: "info@eclinic.eu",
};

describe("Tests for Clinic Model", () => {
  const ddbMock = mockClient(awsClients.dynamoDBDocClient);

  beforeEach(() => {
    ddbMock.reset();
  });

  test("Create New Clinic Successfully No StartDate", async () => {
    // Arrange
    ddbMock.on(PutCommand);
    vi.useFakeTimers();
    const expectedDateTime = "2025-03-04";
    vi.setSystemTime(expectedDateTime);

    // Act
    const clinic = await Clinic.createNewClinic(clinicNoStartDate);

    // Assert
    expect(clinic).toMatchObject({
      ...clinicNoStartDate,
      startDate: new Date(expectedDateTime),
      endDate: null,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(ddbMock.commandCalls(PutCommand)[0].firstArg.input).toMatchObject({
      TableName: "test-clinic-details",
      Item: {
        ...clinicNoStartDate,
        startDate: "2025-03-04T00:00:00.000Z",
        pk: "CLINIC#clinic-id-03",
        sk: "CLINIC#ROOT",
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(ddbMock.commandCalls(PutCommand)[0].firstArg.input).toMatchObject({
      ConditionExpression: "attribute_not_exists(pk) AND attribute_not_exists(sk)",
    });
  });

  test("Create New Clinic error handling", async () => {
    // Arrange
    const consoleMock = vi.spyOn(logger, "error").mockImplementation(() => null);
    ddbMock.on(PutCommand).rejectsOnce(Error("--error--"));

    // Act
    await expect(Clinic.createNewClinic(clinicNoStartDate)).rejects.toThrow(Error("--error--"));

    // // Assert
    expect(consoleMock).toHaveBeenCalledOnce();
    expect(consoleMock).toHaveBeenLastCalledWith(
      Error("--error--"),
      "Error saving new clinic details",
    );
  });

  test("Create New Clinic Successfully with StartDate", async () => {
    // Arrange
    ddbMock.on(PutCommand);

    // Act
    const clinic = await Clinic.createNewClinic(clinicsDetails[0]);

    // Assert
    expect(clinic).toMatchObject({
      ...clinicsDetails[0],
      startDate: new Date(clinicsDetails[0].startDate),
      endDate: null,
    });
  });

  test("Get all clinics", async () => {
    const loggerMock = vi.spyOn(logger, "info").mockImplementation(() => null);
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

    const results = await Clinic.getAllClinics();
    expect(results).toHaveLength(2);
    expect(loggerMock).toHaveBeenCalled();
    expect(loggerMock).toHaveBeenLastCalledWith(
      { resultCount: 2 },
      "Clinics data fetched successfully",
    );
  });

  test("Gettting all clinics error", async () => {
    const loggerMock = vi.spyOn(logger, "error").mockImplementation(() => null);
    ddbMock.on(ScanCommand).rejects("DB Error");

    await expect(Clinic.getAllClinics()).rejects.toThrowError("DB Error");

    expect(loggerMock).toHaveBeenCalled();
    expect(loggerMock).toHaveBeenLastCalledWith(Error("DB Error"), "Error retrieving clinics");
  });

  test("Get all clinics empty db response", async () => {
    const loggerMock = vi.spyOn(logger, "info").mockImplementation(() => null);
    ddbMock.on(ScanCommand).resolves({});

    const results = await Clinic.getAllClinics();
    expect(results).toHaveLength(0);
    expect(loggerMock).toHaveBeenCalled();
    expect(loggerMock).toHaveBeenLastCalledWith("No clinics found");
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

  test("Getting clinic by clinicID error handling", async () => {
    const consoleMock = vi.spyOn(logger, "error").mockImplementation(() => null);
    // @ts-expect-error checking error handling
    ddbMock.on(GetCommand).resolves(undefined);

    // Act
    await expect(Clinic.getClinicById("clinic-id-01")).rejects.toThrow(
      "Cannot read properties of undefined (reading 'Item')",
    );

    // Assert
    expect(consoleMock).toHaveBeenCalledOnce();
    expect(consoleMock).toHaveBeenLastCalledWith(
      TypeError("Cannot read properties of undefined (reading 'Item')"),
      "Error retrieving clinic details",
    );
  });

  test("Getting clinic by clinicID no rusults", async () => {
    const consoleMock = vi.spyOn(logger, "info").mockImplementation(() => null);
    ddbMock.on(GetCommand).resolves({
      Item: {},
    });
    // Act
    const clinic = await Clinic.getClinicById("clinic-id-01");

    // Assert
    expect(consoleMock).toHaveBeenCalled();
    expect(consoleMock).toHaveBeenLastCalledWith("No clinic details found");
    expect(clinic).toBeUndefined();
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

  test("Check active clinic multiple results", async () => {
    const consoleMock = vi.spyOn(logger, "error").mockImplementation(() => null);
    ddbMock.on(QueryCommand).resolves({
      Items: [
        {
          ...clinicsDetails[0],
          startDate: new Date(clinicsDetails[0].startDate),
          endDate: null,
          pk: "CLINICN#test-id-01",
          sk: "CLINIC#DROOT",
        },
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
    expect(active).toBeFalsy();
    expect(consoleMock).toHaveBeenCalledOnce();
    expect(consoleMock).toHaveBeenLastCalledWith(
      `Retrieved more than 1 clinic with the same 'clinicId': ${clinicsDetails[0].clinicId}`,
    );
  });

  test("Check active clinic error handling", async () => {
    const consoleMock = vi.spyOn(logger, "error").mockImplementation(() => null);
    const clinicId = "clinic-id-01";
    ddbMock.on(QueryCommand).rejects();

    // Assert
    await expect(Clinic.isActiveClinic(clinicId)).rejects.toThrow();
    expect(consoleMock).toHaveBeenCalled();
    expect(consoleMock).toHaveBeenLastCalledWith(
      Error(),
      `Error retrieving the active clinic with 'clinicId': ${clinicId}`,
    );
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

  test("Convert to json", async () => {
    const consoleMock = vi.spyOn(logger, "info").mockImplementation(() => null);
    const data = {
      ...clinicNoStartDate,
      startDate: new Date(),
    } as NewClinic;

    // Act
    const clinic = await Clinic.createNewClinic(data);
    const result = clinic.toJson();

    // Assert
    expect(consoleMock).toHaveBeenCalled();
    expect(consoleMock).toHaveBeenLastCalledWith(`Clinic details saved successfully`);
    expect(result).toBeInstanceOf(Object);
    expect(result?.clinicId).toBeTruthy();
    expect(result?.name.length).toBeGreaterThan(3);
    expect(result?.city).toBeTruthy();
    expect(result?.country).toBeTypeOf("string");
    expect(result?.startDate).toBeTruthy();
    expect(result).toHaveProperty("endDate");
    expect(result?.createdBy).toBeTruthy();
  });
});
