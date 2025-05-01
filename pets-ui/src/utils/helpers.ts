import { DateType } from "@/applicant";

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

export {
  formatDateType,
  hasInvalidCharacters,
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
