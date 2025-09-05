import {
  DateType,
  ReduxMedicalScreeningType,
  ReduxRadiologicalOutcomeDetailsType,
  ReduxSputumType,
} from "@/types";
import { PositiveOrNegative, YesOrNo } from "@/utils/enums";

import { countryList } from "./countryList";
import {
  dateEntryMustBeInTheFuture,
  dateEntryMustBeInThePast,
  dateEntryNames,
  dateValidationMessages,
  longNumericStrings,
  shortNumericStrings,
} from "./records";

const standardiseDayOrMonth = (dayOrMonth: string) => {
  return shortNumericStrings.includes(dayOrMonth)
    ? longNumericStrings[shortNumericStrings.indexOf(dayOrMonth)]
    : dayOrMonth;
};

const isValidDate = (day: string, month: string, year: string) => {
  if (
    parseInt(year) <= 1900 ||
    parseInt(year) >= 2100 ||
    parseInt(month) < 1 ||
    parseInt(month) > 12 ||
    parseInt(day) < 1 ||
    parseInt(day) > 31 ||
    (parseInt(day) > 28 && parseInt(year) % 4 != 0 && month == "2") ||
    (parseInt(day) > 29 && parseInt(year) % 4 == 0 && month == "2") ||
    (parseInt(day) > 30 && (month == "4" || month == "6" || month == "9" || month == "11"))
  ) {
    return false;
  } else {
    return true;
  }
};

const missingFieldsMessage = (fieldName: string, missingFields: string[]) => {
  const missingText =
    missingFields.length === 1
      ? `${missingFields[0]}`
      : `${missingFields[0]} and ${missingFields[1]}`;

  return `${dateEntryNames[fieldName]} must include a ${missingText}`;
};

const hasInvalidCharacters = (day: string, month: string, year: string) => {
  return /\D/.test(day) || /\D/.test(month) || /\D/.test(year);
};

const isDateInThePast = (day: string, month: string, year: string): boolean => {
  const inputDate = new Date(Number(year), Number(month) - 1, Number(day));
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);

  return inputDate <= today;
};

const isDateInTheFuture = (day: string, month: string, year: string): boolean => {
  const inputDate = new Date(Number(year), Number(month) - 1, Number(day));
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);

  return inputDate > today;
};

const validateDate = (value: DateType, fieldName: string) => {
  const { day, month, year } = value;
  const missingFields: Record<string, boolean> = { day: !day, month: !month, year: !year };
  const missingKeys = Object.keys(missingFields).filter((key) => missingFields[key]);

  //All three date fields missing
  if (missingKeys.length === 3) return dateValidationMessages[fieldName].emptyFieldError;

  //One or more date fields missing
  if (missingKeys.length > 0) return missingFieldsMessage(fieldName, missingKeys);

  //Fields contain invalid characters
  if (hasInvalidCharacters(day, month, year)) {
    return dateValidationMessages[fieldName].invalidCharError;
  }

  //Fields contain Invalid dates
  if (!isValidDate(day, month, year)) {
    return dateValidationMessages[fieldName].invalidDateError;
  }

  //Past Check
  if (dateEntryMustBeInThePast.includes(fieldName) && !isDateInThePast(day, month, year)) {
    return dateValidationMessages[fieldName].dateMustBeInPastError;
  }

  //Future Check
  if (dateEntryMustBeInTheFuture.includes(fieldName) && !isDateInTheFuture(day, month, year)) {
    return dateValidationMessages[fieldName].dateMustBeInFutureError;
  }

  return true;
};

const formatDateType = (date: DateType): string => {
  const { day, month, year } = date;

  if (!day || !month || !year) {
    return "";
  }

  return `${day}/${month}/${year}`;
};

const formatDateForDisplay = (date: DateType): string => {
  const { day, month, year } = date;

  if (!day || !month || !year) {
    return "";
  }

  const dateToDisplay = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  const paddedDay = dateToDisplay.getDate().toString().padStart(2, "0");
  const monthName = dateToDisplay.toLocaleDateString("en-GB", { month: "long" });
  return `${paddedDay} ${monthName} ${dateToDisplay.getFullYear()}`;
};

const calculateCertificateExpiryDate = (
  issueDate: DateType,
  hasCloseContactWithTb: boolean,
): DateType => {
  const { year, month, day } = issueDate;
  if (!year || !month || !day) return issueDate;

  const jsDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  const expiryMonths = hasCloseContactWithTb ? 3 : 6;
  jsDate.setMonth(jsDate.getMonth() + expiryMonths);

  return {
    year: jsDate.getFullYear().toString(),
    month: (jsDate.getMonth() + 1).toString(),
    day: jsDate.getDate().toString(),
  };
};

const calculateCertificateIssueDate = (
  chestXrayCompletionDate: DateType | undefined,
  chestXrayTaken: string | undefined,
  medicalScreeningCompletionDate: DateType | undefined,
): DateType => {
  if (chestXrayCompletionDate && chestXrayTaken === "Yes") {
    const { year, month, day } = chestXrayCompletionDate;
    if (year && month && day) {
      return chestXrayCompletionDate;
    }
  }

  if (medicalScreeningCompletionDate) {
    const { year, month, day } = medicalScreeningCompletionDate;
    if (year && month && day) {
      return medicalScreeningCompletionDate;
    }
  }

  const today = new Date();
  return {
    year: today.getFullYear().toString(),
    month: (today.getMonth() + 1).toString(),
    day: today.getDate().toString(),
  };
};

const spreadArrayIfNotEmpty = (...arrays: string[][]) => {
  return arrays.flatMap((array) => (array?.length ? array : []));
};

const logError = (error: Error, info: { componentStack?: string | null }) => {
  console.error(`Error: + ${error}`);
  console.error(`Info: + ${JSON.stringify(info)}`);
};

const toArray = (input: boolean | string | string[]) => {
  if (typeof input == "string") {
    return [input];
  } else if (typeof input == "boolean") {
    return [];
  } else {
    return input;
  }
};

const getCountryName = (countryCode: string) => {
  const country = countryList.find((c) => c.value === countryCode);
  return country ? country.label : countryCode;
};

const calculateSputumOutcome = (
  radiologicalOutcomeData: ReduxRadiologicalOutcomeDetailsType,
  sputumData: ReduxSputumType,
) => {
  if (radiologicalOutcomeData.isSputumRequired === YesOrNo.NO) {
    return "Not provided";
  }

  const samples = [sputumData.sample1, sputumData.sample2, sputumData.sample3];
  let hasAnyResults = false;

  for (const sample of samples) {
    const smearResult = sample.smearResults.smearResult;
    const cultureResult = sample.cultureResults.cultureResult;

    if (
      smearResult === PositiveOrNegative.POSITIVE ||
      cultureResult === PositiveOrNegative.POSITIVE
    ) {
      return PositiveOrNegative.POSITIVE;
    } else if (
      smearResult !== PositiveOrNegative.NOT_YET_ENTERED ||
      cultureResult !== PositiveOrNegative.NOT_YET_ENTERED
    ) {
      hasAnyResults = true;
    }
  }

  if (hasAnyResults) {
    return PositiveOrNegative.NEGATIVE;
  } else {
    return "Not provided";
  }
};

const isChildUnder11 = (medicalScreeningData: ReduxMedicalScreeningType) => {
  const age = medicalScreeningData?.age;
  if (!age) return "No";
  const parsedAge = typeof age === "string" ? parseInt(age) : age;
  return parsedAge < 11 ? "Yes" : "No";
};

export {
  calculateCertificateExpiryDate,
  calculateCertificateIssueDate,
  calculateSputumOutcome,
  formatDateForDisplay,
  formatDateType,
  getCountryName,
  hasInvalidCharacters,
  isChildUnder11,
  isDateInTheFuture,
  isDateInThePast,
  isValidDate,
  logError,
  missingFieldsMessage,
  spreadArrayIfNotEmpty,
  standardiseDayOrMonth,
  toArray,
  validateDate,
};
