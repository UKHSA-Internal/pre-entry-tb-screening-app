import { standardiseDayOrMonth, validateDate } from "./helpers";

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

describe("validateDate function", () => {
  it("should provide the emptyFieldError when provided with all empty date fields", () => {
    expect(validateDate({ day: "", month: "", year: "" }, "dateOfBirth")).toBe(
      "Date of birth must include a day, month and year.",
    );
  });
  it("should provide the a missing Fields error message when provided with partially completed date fields", () => {
    const testCases = [
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

    testCases.forEach(({ value, field, expected }) => {
      expect(validateDate(value, field)).toBe(expected);
    });
  });
});
