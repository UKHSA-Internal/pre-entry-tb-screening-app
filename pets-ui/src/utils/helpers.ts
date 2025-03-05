import { DateType } from "@/components/dateTextInput/dateTextInput";

import { countryList } from "./countryList";

const attributeToComponentId: { [key: string]: string } = {
  fullName: "name",
  passportNumber: "passport-number",
  countryOfNationality: "country-of-nationality",
  countryOfIssue: "country-of-issue",
  issueDate: "passport-issue-date",
  expiryDate: "passport-expiry-date",
  dateOfBirth: "birth-date",
  sex: "sex",
  applicantHomeAddress1: "address-1",
  applicantHomeAddress2: "address-2",
  applicantHomeAddress3: "address-3",
  townOrCity: "town-or-city",
  provinceOrState: "province-or-state",
  country: "address-country",
  postcode: "postcode",
  age: "age",
  tbSymptoms: "tb-symptoms",
  tbSymptomsList: "tb-symptoms-list",
  otherSymptomsDetail: "other-symptoms-detail",
  underElevenConditions: "under-eleven-conditions",
  underElevenConditionsDetail: "under-eleven-conditions-detail",
  previousTb: "previous-tb",
  previousTbDetail: "previous-tb-detail",
  closeContactWithTb: "close-contact-with-tb",
  closeContactWithTbDetail: "close-contact-with-tb-detail",
  pregnant: "pregnant",
  menstrualPeriods: "menstrual-periods",
  physicalExamNotes: "physical-exam-notes",
  visaType: "visa-type",
  applicantUkAddress1: "address-1",
  applicantUkAddress2: "address-2",
  ukMobileNumber: "mobile-number",
  ukEmail: "email",
  chestXrayTaken: "chest-xray-taken",
  xrayResult: "xray-result",
  reasonXrayWasNotTaken: "reason-xray-not-taken",
  xrayWasNotTakenFurtherDetails: "xray-not-taken-further-details",
};

const formRegex = {
  lettersAndNumbers: /^[A-Za-z0-9]+$/,
  lettersAndSpaces: /^[A-Za-z\s]+$/,
  lettersNumbersAndSpaces: /^[A-Za-z0-9\s]+$/,
  lettersSpacesAndPunctuation: /^[A-Za-z\s,-/()']+$/,
  lettersNumbersSpacesAndPunctuation: /^[A-Za-z0-9\s,-/()']+$/,
  numbersOnly: /^\d+$/,
  emailAddress: /^[\w\-.]+@([\w-]+\.)+[\w-]{2,}$/,
  fullName: /^[A-Za-z\s-'.]+$/,
};

const dateValidationMessages = {
  passportIssueDate: {
    emptyFieldError: "Passport issue date must include a day, month and year.",
    invalidCharError:
      "Passport issue day and year must contain only numbers. Passport issue month must be a number, or the name of the month, or the first three letters of the month.",
    invalidDateError: "Passport issue date must be a valid date.",
  },
  passportExpiryDate: {
    emptyFieldError: "Passport expiry date must include a day, month and year.",
    invalidCharError:
      "Passport expiry day and year must contain only numbers. Passport expiry month must be a number, or the name of the month, or the first three letters of the month.",
    invalidDateError: "Passport expiry date must be a valid date.",
  },
  dateOfBirth: {
    emptyFieldError: "Date of birth must include a day, month and year.",
    invalidCharError:
      "Date of birth day and year must contain only numbers. Date of birth month must be a number, or the name of the month, or the first three letters of the month.",
    invalidDateError: "Date of birth date must be a valid date.",
  },
};

const longMonthValues = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];
const shortMonthValues = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];
const longNumericStrings = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
const shortNumericStrings = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

const validMonthValues = [
  ...longMonthValues,
  ...shortMonthValues,
  ...longNumericStrings,
  ...shortNumericStrings,
];

function standardiseDayOrMonth(dayOrMonth: string) {
  let standardisedDayOrMonth = dayOrMonth.toLowerCase();

  for (const list of [longMonthValues, shortMonthValues, shortNumericStrings]) {
    if (list.includes(dayOrMonth.toLowerCase())) {
      standardisedDayOrMonth = longNumericStrings[list.indexOf(dayOrMonth.toLowerCase())];
    }
  }

  return standardisedDayOrMonth;
}

function isValidDate(day: string, month: string, year: string) {
  if (
    parseInt(year) <= 1900 ||
    parseInt(year) >= 2100 ||
    parseInt(day) < 1 ||
    parseInt(day) > 31 ||
    (parseInt(day) > 28 &&
      parseInt(year) % 4 != 0 &&
      (month == "february" || month == "feb" || month == "2")) ||
    (parseInt(day) > 29 &&
      parseInt(year) % 4 == 0 &&
      (month == "february" || month == "feb" || month == "2")) ||
    (parseInt(day) > 30 &&
      (month == "april" ||
        month == "june" ||
        month == "september" ||
        month == "november" ||
        month == "apr" ||
        month == "jun" ||
        month == "sep" ||
        month == "nov" ||
        month == "4" ||
        month == "6" ||
        month == "9" ||
        month == "11"))
  ) {
    return false;
  } else {
    return true;
  }
}

const validateDate = (value: DateType, fieldName: string) => {
  const { day, month, year } = value;

  if (!day || !month || !year) {
    return dateValidationMessages[fieldName as keyof typeof dateValidationMessages].emptyFieldError;
  } else if (
    day.search(/\D/g) > -1 ||
    year.search(/\D/g) > -1 ||
    !validMonthValues.includes(month.toLowerCase())
  ) {
    return dateValidationMessages[fieldName as keyof typeof dateValidationMessages]
      .invalidCharError;
  } else if (!isValidDate(day, month, year)) {
    return dateValidationMessages[fieldName as keyof typeof dateValidationMessages]
      .invalidDateError;
  }

  return true;
};

const visaOptions = [
  {
    value: "Family Reunion",
    label: "Family Reunion",
  },
  {
    value: "Settlement and Dependents",
    label: "Settlement and Dependents",
  },
  {
    value: "Students",
    label: "Students",
  },
  {
    value: "Work",
    label: "Work",
  },
  {
    value: "Working Holiday Maker",
    label: "Working Holiday Maker",
  },
  {
    value: "Government Sponsored",
    label: "Government Sponsored",
  },
];

export {
  attributeToComponentId,
  countryList,
  dateValidationMessages,
  formRegex,
  isValidDate,
  standardiseDayOrMonth,
  validateDate,
  validMonthValues,
  visaOptions,
};
