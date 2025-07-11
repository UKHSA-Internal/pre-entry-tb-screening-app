import { describe, expect, test, vi } from "vitest";

import { logger } from "../../shared/logger";
import { readClinicsFile, validateClinic, validateClinicsDataString } from "./validation";

describe("Load and validate Clinics from json file", () => {
  test("read file with correct path", () => {
    const res = readClinicsFile("src/clinic-service/fixtures/test-file.json");
    expect(JSON.parse(res as string)).toHaveLength(13);
  });

  test("read incorrect file path", () => {
    const consoleMock = vi.spyOn(logger, "error").mockImplementation(() => undefined);
    const fileName = "fake-file.json";
    const res = readClinicsFile(fileName);
    expect(consoleMock).toHaveBeenCalledOnce();
    expect(consoleMock).toHaveBeenCalledWith(
      "File reading error:",
      Error(`ENOENT: no such file or directory, open '${process.cwd()}/${fileName}'`),
    );
    expect(res).toBeUndefined();
  });

  test("validate objects", () => {
    const fakeFile = `[{"clinicId":"1","name":"Q-Life Family clinic","city":"Lagos","country":"NGA","startDate":"2025-02-07","endDate":"2025-02-08","createdBy":"shane.park@iom.com"}]`;

    const res = validateClinicsDataString(fakeFile);

    expect(res).toMatchObject([
      {
        city: "Lagos",
        clinicId: "1",
        country: "NGA",
        createdBy: "shane.park@iom.com",
        endDate: "2025-02-08",
        name: "Q-Life Family clinic",
        startDate: "2025-02-07",
      },
    ]);
    expect(res).toHaveLength(1);
  });

  test("validate objects in empty string", () => {
    const consoleMock = vi.spyOn(logger, "info").mockImplementation(() => null);
    const fakeFile = "";

    const res = validateClinicsDataString(fakeFile);

    expect(res).toHaveLength(0);
    expect(consoleMock).toHaveBeenCalled();
    expect(consoleMock).toHaveBeenLastCalledWith("The json file didn't contain correct objects");
  });

  test("validate objects invalid json string error handling", () => {
    const consoleMock = vi.spyOn(logger, "error").mockImplementation(() => null);
    const fakeFileData = "it's not json";

    // expect(validateClinicsDataString(fakeFileData)).toThrow("IDK");
    const result = validateClinicsDataString(fakeFileData);

    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(0);
    expect(consoleMock).toHaveBeenCalled();
    expect(consoleMock).toHaveBeenLastCalledWith(
      SyntaxError(`Unexpected token i in JSON at position 0`),
    );
  });

  test("create Clinic from object", () => {
    const fakeClinic = {
      clinicId: "clinic-id-03",
      name: "Town's Clinic",
      city: "Town One",
      country: "KOR",
      startDate: "2025-02-08",
      endDate: null,
      createdBy: "info@eclinic.eu",
    };
    const res = validateClinic(fakeClinic);

    expect(res).toMatchObject({
      clinicId: "clinic-id-03",
      name: "Town's Clinic",
      city: "Town One",
      country: "KOR",
      startDate: "2025-02-08",
      endDate: null,
      createdBy: "info@eclinic.eu",
    });
    expect(res).toHaveProperty("endDate");
  });

  test("create Clinic missing clinicId value", () => {
    const consoleMock = vi.spyOn(logger, "error").mockImplementation(() => undefined);
    const fakeClinic = {
      clinicId: "",
      name: "Town's Clinic",
      city: "Town One",
      country: "KOR",
      startDate: "2025-01-01",
      endDate: null,
      createdBy: "info@eclinic.eu",
    };
    const res = validateClinic(fakeClinic);

    expect(consoleMock).toHaveBeenCalledOnce();
    expect(consoleMock).toHaveBeenLastCalledWith(
      "Clinic object missing required attribute: clinicId",
    );
    expect(res).toBeUndefined();
  });

  test("create Clinic missing name value", () => {
    const consoleMock = vi.spyOn(logger, "error").mockImplementation(() => undefined);
    const fakeClinic = {
      clinicId: "01",
      name: "",
      city: "Town One",
      country: "KOR",
      startDate: "2025-01-01",
      endDate: null,
      createdBy: "info@eclinic.eu",
    };
    const res = validateClinic(fakeClinic);

    expect(consoleMock).toHaveBeenCalledOnce();
    expect(consoleMock).toHaveBeenLastCalledWith("Clinic object missing required attribute: name");
    expect(res).toBeUndefined();
  });

  test("create Clinic missing city value", () => {
    const consoleMock = vi.spyOn(logger, "error").mockImplementation(() => undefined);
    const fakeClinic = {
      clinicId: "01",
      name: "Name",
      country: "KOR",
      startDate: "2025-01-01",
      endDate: null,
      createdBy: "info@eclinic.eu",
    };
    const res = validateClinic(fakeClinic);

    expect(consoleMock).toHaveBeenCalledOnce();
    expect(consoleMock).toHaveBeenLastCalledWith("Clinic object missing required attribute: city");
    expect(res).toBeUndefined();
  });

  test("create Clinic missing CountryCode value", () => {
    const consoleMock = vi.spyOn(logger, "error").mockImplementation(() => undefined);
    const fakeClinic = {
      clinicId: "clinic-id-03",
      name: "Town's Clinic",
      city: "Town One",
      country: "XYZ",
      startDate: "2025-02-08",
      endDate: null,
      createdBy: "info@eclinic.eu",
    };
    const res = validateClinic(fakeClinic);

    expect(consoleMock).toHaveBeenCalledOnce();
    expect(consoleMock).toHaveBeenLastCalledWith("Can't convert to CountyCode: XYZ");
    expect(res).toBeUndefined();
  });

  test("create Clinic missing startDate value", () => {
    const consoleMock = vi.spyOn(logger, "error").mockImplementation(() => undefined);
    const fakeClinic = {
      clinicId: "clinic-id-03",
      name: "Town's Clinic",
      city: "Town One",
      country: "KOR",
      startDate: "",
      endDate: null,
      createdBy: "info@eclinic.eu",
    };
    const res = validateClinic(fakeClinic);

    expect(consoleMock).toHaveBeenCalledOnce();
    expect(consoleMock).toHaveBeenLastCalledWith(
      "Clinic object missing required attribute: startDate",
    );
    expect(res).toBeUndefined();
  });

  test("create Clinic invalid endDate", () => {
    const consoleMock = vi.spyOn(logger, "error").mockImplementation(() => undefined);
    // endDate < startDate
    const wrongDate = "2024-01-01";
    const fakeClinic = {
      clinicId: "clinic-id-03",
      name: "Town's Clinic",
      city: "Town One",
      country: "KOR",
      startDate: "2025-01-01",
      endDate: wrongDate,
      createdBy: "info@eclinic.eu",
    };
    const res = validateClinic(fakeClinic);

    expect(consoleMock).toHaveBeenCalledOnce();
    expect(consoleMock).toHaveBeenLastCalledWith(`Failed to validate endDate: ${wrongDate}`);
    expect(res).toBeUndefined();
  });

  test("create Clinic invalid startDate value type", () => {
    const consoleMock = vi.spyOn(logger, "error").mockImplementation(() => undefined);
    const badDateString = "abc";
    const fakeClinic = {
      clinicId: "clinic-id-03",
      name: "Town's Clinic",
      city: "Town One",
      country: "KOR",
      startDate: badDateString,
      endDate: null,
      createdBy: "info@eclinic.eu",
    };
    const res = validateClinic(fakeClinic);

    expect(consoleMock).toHaveBeenLastCalledWith(
      `Invalid or too early startDate: ${badDateString}`,
    );
    expect(res).toBeUndefined();
  });
});
