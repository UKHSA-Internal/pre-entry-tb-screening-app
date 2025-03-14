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
  tbClearanceIssued: "tb-clearance-issued",
  tbCertificateDate: "tb-certificate-date",
  tbCertificateNumber: "tb-certificate-number",
  passportIssueDate: "passportIssueDate",
  passportExpiryDate: "passportExpiryDate",
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

const dateValidationMessages: Record<string, Record<string, string>> = {
  passportIssueDate: {
    emptyFieldError: "Passport issue date must include a day, month and year",
    invalidCharError:
      "Passport issue day and year must contain only numbers. Passport issue month must be a number, or the name of the month, or the first three letters of the month",
    invalidDateError: "Passport issue date must be a valid date",
    dateMustBeInPastError: "Passport issue date must be today or in the past",
  },
  passportExpiryDate: {
    emptyFieldError: "Passport expiry date must include a day, month and year",
    invalidCharError:
      "Passport expiry day and year must contain only numbers. Passport expiry month must be a number, or the name of the month, or the first three letters of the month",
    invalidDateError: "Passport expiry date must be a valid date",
    dateMustBeInFutureError: "Passport expiry date must be in the future",
  },
  dateOfBirth: {
    emptyFieldError: "Date of birth must include a day, month and year",
    invalidCharError:
      "Date of birth day and year must contain only numbers. Date of birth month must be a number, or the name of the month, or the first three letters of the month",
    invalidDateError: "Date of birth date must be a valid date",
    dateMustBeInPastError: "Date of birth date must in the past",
  },
  tbCertificateDate: {
    emptyFieldError: "TB clearance certificate date must include a day, month and year",
    invalidCharError:
      "TB clearance certificate day and year must contain only numbers. TB clearance certificate month must be a number, or the name of the month, or the first three letters of the month",
    invalidDateError: "TB clearance certificate date must be a valid date",
    dateMustBeInPastError: "TB clearance certificate date must be today or in the past",
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

const dateEntryNames: Record<string, string> = {
  dateOfBirth: "Date of birth",
  passportIssueDate: "Passport issue date",
  passportExpiryDate: "Passport expiry date",
  tbCertificateDate: "TB clearance certificate date",
};

const dateEntryMustBeInThePast: string[] = [
  "dateOfBirth",
  "passportIssueDate",
  "tbCertificateDate",
];

const dateEntryMustBeInTheFuture: string[] = ["passportExpiryDate"];

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
  {
    value: "British National (Overseas)",
    label: "British National (Overseas)",
  },
];

export {
  attributeToComponentId,
  countryList,
  dateEntryMustBeInTheFuture,
  dateEntryMustBeInThePast,
  dateEntryNames,
  dateValidationMessages,
  formRegex,
  longMonthValues,
  longNumericStrings,
  shortMonthValues,
  shortNumericStrings,
  validMonthValues,
  visaOptions,
};
