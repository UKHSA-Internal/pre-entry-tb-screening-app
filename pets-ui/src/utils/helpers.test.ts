import {
  formatDateType,
  hasInvalidCharacters,
  isDataPresent,
  isDateInTheFuture,
  isDateInThePast,
  missingFieldsMessage,
  spreadArrayIfNotEmpty,
  standardiseDayOrMonth,
  validateDate,
} from "./helpers";
import { validMonthValues } from "./records";

describe("standardiseDayOrMonth function", () => {
  test.each([
    ["1", "01"],
    ["2", "02"],
    ["3", "03"],
    ["4", "04"],
    ["5", "05"],
    ["6", "06"],
    ["7", "07"],
    ["8", "08"],
    ["9", "09"],
    ["10", "10"],
    ["11", "11"],
    ["12", "12"],
    ["13", "13"],
    ["14", "14"],
    ["15", "15"],
    ["16", "16"],
    ["17", "17"],
    ["18", "18"],
    ["19", "19"],
    ["20", "20"],
    ["21", "21"],
    ["22", "22"],
    ["23", "23"],
    ["24", "24"],
    ["25", "25"],
    ["26", "26"],
    ["27", "27"],
    ["28", "28"],
    ["29", "29"],
    ["30", "30"],
    ["31", "31"],
    ["01", "01"],
    ["02", "02"],
    ["03", "03"],
    ["04", "04"],
    ["05", "05"],
    ["06", "06"],
    ["07", "07"],
    ["08", "08"],
    ["09", "09"],
    ["jan", "01"],
    ["january", "01"],
    ["feb", "02"],
    ["february", "02"],
    ["mar", "03"],
    ["march", "03"],
    ["april", "04"],
    ["apr", "04"],
    ["may", "05"],
    ["jun", "06"],
    ["june", "06"],
    ["jul", "07"],
    ["july", "07"],
    ["aug", "08"],
    ["august", "08"],
    ["sep", "09"],
    ["september", "09"],
    ["oct", "10"],
    ["october", "10"],
    ["nov", "11"],
    ["november", "11"],
    ["dec", "12"],
    ["december", "12"],
  ])("%s standardises to %s", (input, expected) => {
    expect(standardiseDayOrMonth(input)).toEqual(expected);
  });
});

describe("FormatDateType function", () => {
  it("returns a DateType Object in the correct format", () => {
    expect(formatDateType({ day: "04", month: "05", year: "2025" })).toBe("04/05/2025");
    expect(formatDateType({ day: "15", month: "12", year: "1999" })).toBe("15/12/1999");
    expect(formatDateType({ day: "24", month: "01", year: "2030" })).toBe("24/01/2030");
  });
  it("should return an empty string if all value is missing", () => {
    expect(formatDateType({ year: "", month: "", day: "" })).toBe("");
  });
  it("should return an empty string if any value is missing", () => {
    expect(formatDateType({ year: "", month: "5", day: "4" })).toBe("");
    expect(formatDateType({ year: "2025", month: "", day: "4" })).toBe("");
    expect(formatDateType({ year: "2025", month: "5", day: "" })).toBe("");
  });
});

describe("isDataPresent function", () => {
  it("returns true if data is present in the summaryElement", () => {
    const summaryElementStringExample = {
      key: "Exmaple Key",
      value: "A Value",
      link: "/a-link",
      hiddenLabel: "label",
    };
    const summaryElementArrayExample = {
      key: "Exmaple Key",
      value: ["A Value", "AnotherValue"],
      link: "/a-link",
      hiddenLabel: "label",
    };
    expect(isDataPresent(summaryElementStringExample)).toBeTruthy();
    expect(isDataPresent(summaryElementArrayExample)).toBeTruthy();
  });
  it("returns false if data is not present in the summaryElement", () => {
    const summaryElementEmptyStringExmaple = {
      key: "Exmaple Key",
      value: "",
      link: "/a-link",
      hiddenLabel: "label",
    };
    expect(isDataPresent(summaryElementEmptyStringExmaple)).toBeFalsy();
  });
  it("returns false if data is an empty array", () => {
    const summaryElementEmptyArrayExmaple = {
      key: "Exmaple Key",
      value: [],
      link: "/a-link",
      hiddenLabel: "label",
    };
    expect(isDataPresent(summaryElementEmptyArrayExmaple)).toBeFalsy();
  });
});

describe("validateDate function", () => {
  it("should provide the emptyFieldError when provided with all empty date fields", () => {
    expect(validateDate({ day: "", month: "", year: "" }, "dateOfBirth")).toBe(
      "Date of birth must include a day, month and year",
    );
  });
  it("should provide the a missing Fields error message when provided with partially completed date fields", () => {
    const dateTestCases = [
      {
        value: { day: "01", month: "", year: "" },
        field: "dateOfBirth",
        expected: "Date of birth must include a month and year",
      },
      {
        value: { day: "", month: "02", year: "" },
        field: "dateOfBirth",
        expected: "Date of birth must include a day and year",
      },
      {
        value: { day: "", month: "", year: "2000" },
        field: "dateOfBirth",
        expected: "Date of birth must include a day and month",
      },
      {
        value: { day: "01", month: "02", year: "" },
        field: "dateOfBirth",
        expected: "Date of birth must include a year",
      },
      {
        value: { day: "", month: "02", year: "2000" },
        field: "dateOfBirth",
        expected: "Date of birth must include a day",
      },
      {
        value: { day: "01", month: "", year: "2000" },
        field: "dateOfBirth",
        expected: "Date of birth must include a month",
      },
    ];

    dateTestCases.forEach(({ value, field, expected }) => {
      expect(validateDate(value, field)).toBe(expected);
    });
  });
  it("should provide the invalidCharError when provided with all date fields containing invalid charcters", () => {
    const invalidCharError =
      "Date of birth day and year must contain only numbers. Date of birth month must be a number, or the name of the month, or the first three letters of the month";

    const dateTestCases = [
      {
        value: { day: "05", month: "02", year: "$$" },
        field: "dateOfBirth",
        expected: invalidCharError,
      },
      {
        value: { day: "05", month: "$$", year: "2000" },
        field: "dateOfBirth",
        expected: invalidCharError,
      },
      {
        value: { day: "$$", month: "02", year: "2000" },
        field: "dateOfBirth",
        expected: invalidCharError,
      },
      {
        value: { day: "not", month: "02", year: "2000" },
        field: "dateOfBirth",
        expected: invalidCharError,
      },
      {
        value: { day: "01", month: "not", year: "2000" },
        field: "dateOfBirth",
        expected: invalidCharError,
      },
      {
        value: { day: "01", month: "05", year: "not" },
        field: "dateOfBirth",
        expected: invalidCharError,
      },
    ];
    dateTestCases.forEach(({ value, field, expected }) => {
      expect(validateDate(value, field)).toBe(expected);
    });
  });
  it("should provide the invalidDateError when provided an invalid date", () => {
    const dateTestCases = [
      {
        value: { day: "09", month: "12", year: "1888" },
        field: "dateOfBirth",
        expected: "Date of birth date must be a valid date",
      },
      {
        value: { day: "09", month: "12", year: "3000" },
        field: "dateOfBirth",
        expected: "Date of birth date must be a valid date",
      },
    ];

    dateTestCases.forEach(({ value, field, expected }) => {
      expect(validateDate(value, field)).toBe(expected);
    });
  });
  it("should provide specific wordings based on the error field and the type of date", () => {
    const dateTestCases = [
      {
        value: { day: "09", month: "12", year: "3000" },
        field: "dateOfBirth",
        expected: "Date of birth",
      },
      {
        value: { day: "09", month: "12", year: "3000" },
        field: "passportIssueDate",
        expected: "Passport issue date",
      },
      {
        value: { day: "09", month: "12", year: "3000" },
        field: "passportExpiryDate",
        expected: "Passport expiry date",
      },
      {
        value: { day: "09", month: "12", year: "3000" },
        field: "tbCertificateDate",
        expected: "TB clearance certificate date",
      },
    ];

    dateTestCases.forEach(({ value, field, expected }) => {
      expect(validateDate(value, field)).toContain(expected);
    });
  });
});

describe("isDateInTheFuture function", () => {
  it("should return false if date is in the past", () => {
    expect(isDateInTheFuture("04", "02", "2000")).toBeFalsy();
  });
  it("should return true if date is in the future", () => {
    expect(isDateInTheFuture("04", "02", "3000")).toBeTruthy();
  });
});

describe("isDateInThePast function", () => {
  it("should return false if date is in the future", () => {
    expect(isDateInThePast("04", "02", "3000")).toBeFalsy();
  });
  it("should return true if date is in the past", () => {
    expect(isDateInThePast("04", "02", "2000")).toBeTruthy();
  });
  it("should return true if date provided is today", () => {
    const today = new Date();
    const day = today.getDay().toString();
    const month = today.getMonth().toString();
    const year = today.getFullYear().toString();
    expect(isDateInThePast(day, month, year)).toBeTruthy();
  });
});

describe("hasInvalidCharacters function", () => {
  it("should return false if date is valid", () => {
    expect(hasInvalidCharacters("05", "02", "2025", validMonthValues)).toBeFalsy();
  });
  it("should return true if date has invalid characters", () => {
    expect(hasInvalidCharacters("$$", "02", "3000", validMonthValues)).toBeTruthy();
    expect(hasInvalidCharacters("02", "$$", "3000", validMonthValues)).toBeTruthy();
    expect(hasInvalidCharacters("02", "02", "$$", validMonthValues)).toBeTruthy();
  });
  it("should return true if date has invalid month", () => {
    expect(hasInvalidCharacters("01", "22", "3000", validMonthValues)).toBeTruthy();
  });
});

describe("missingFieldsMessage function", () => {
  const testCases = [
    { fieldName: "dateOfBirth", missing: ["day"], expected: "Date of birth must include a day" },
    {
      fieldName: "dateOfBirth",
      missing: ["month"],
      expected: "Date of birth must include a month",
    },
    { fieldName: "dateOfBirth", missing: ["year"], expected: "Date of birth must include a year" },
    {
      fieldName: "dateOfBirth",
      missing: ["day", "year"],
      expected: "Date of birth must include a day and year",
    },
    {
      fieldName: "dateOfBirth",
      missing: ["month", "year"],
      expected: "Date of birth must include a month and year",
    },
    {
      fieldName: "dateOfBirth",
      missing: ["day", "month"],
      expected: "Date of birth must include a day and month",
    },
    {
      fieldName: "passportIssueDate",
      missing: ["day"],
      expected: "Passport issue date must include a day",
    },
    {
      fieldName: "passportExpiryDate",
      missing: ["day"],
      expected: "Passport expiry date must include a day",
    },
    {
      fieldName: "tbCertificateDate",
      missing: ["day"],
      expected: "TB clearance certificate date must include a day",
    },
  ];

  testCases.forEach(({ fieldName, missing, expected }) => {
    it(`should return "${expected}" for fieldName: "${fieldName}" with missing: ${missing.join(", ")}`, () => {
      expect(missingFieldsMessage(fieldName, missing)).toBe(expected);
    });
  });
});

describe("spreadIfNotEmpty", () => {
  test("should spread non-empty string arrays", () => {
    const result = spreadArrayIfNotEmpty(
      ["Example Text 1", "Example Text 2"],
      ["Example Text 3", "Example Text 4"],
      ["Example Text 5"],
    );
    expect(result).toEqual([
      "Example Text 1",
      "Example Text 2",
      "Example Text 3",
      "Example Text 4",
      "Example Text 5",
    ]);
  });

  test("should return an empty array provided empty arrays", () => {
    const result = spreadArrayIfNotEmpty([], [], []);
    expect(result).toEqual([]);
  });

  test("should ignore empty arrays and spread only non-empty ones", () => {
    const result = spreadArrayIfNotEmpty(
      ["Example Text 1"],
      [],
      ["Example Text 3", "Example Text 4"],
      [],
    );
    expect(result).toEqual(["Example Text 1", "Example Text 3", "Example Text 4"]);
  });
});
