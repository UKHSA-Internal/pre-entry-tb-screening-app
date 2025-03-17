import {
  formatDateType,
  isDataPresent,
  spreadArrayIfNotEmpty,
  standardiseDayOrMonth,
} from "./helpers";

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
