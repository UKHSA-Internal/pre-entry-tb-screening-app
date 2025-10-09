import { useEffect, useState } from "react";

import { DateType } from "@/types";

import FieldWrapper from "../fieldWrapper/fieldWrapper";
import { HeadingSize } from "../heading/heading";

export interface DateProps {
  id: string;
  heading?: string;
  label?: string;
  hint?: string;
  // The autocomplete prop should only be used when this component is utilised for birth dates
  autocomplete: boolean;
  errorMessage: string;
  value: DateType;
  setDateValue: (value: DateType) => void;
  headingLevel?: 1 | 2 | 3 | 4;
  headingSize?: HeadingSize;
  headingStyle?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
  divStyle?: React.CSSProperties;
  showTodayYesterdayLinks?: boolean;
}

interface AutocompleteI {
  autoComplete?: string;
}

const DateTextInput: React.FC<DateProps> = (props: Readonly<DateProps>) => {
  const [rawDay, setRawDay] = useState<string>(props.value?.day ?? "");
  const [rawMonth, setRawMonth] = useState<string>(props.value?.month ?? "");
  const [rawYear, setRawYear] = useState<string>(props.value?.year ?? "");

  const removeLeadingZeros = (s: string): string => {
    if (s === "") return "";
    const noLeading = s.replace(/^0+/, "");
    return noLeading === "" ? "0" : noLeading;
  };

  useEffect(() => {
    const propsValue = props.value || { day: "", month: "", year: "" };
    const isDayEqual = removeLeadingZeros(rawDay) === (propsValue.day ?? "");
    const isMonthEqual = removeLeadingZeros(rawMonth) === (propsValue.month ?? "");
    const isYearEqual = removeLeadingZeros(rawYear) === (propsValue.year ?? "");

    if (!isDayEqual) setRawDay(propsValue.day ?? "");
    if (!isMonthEqual) setRawMonth(propsValue.month ?? "");
    if (!isYearEqual) setRawYear(propsValue.year ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value?.day, props.value?.month, props.value?.year]);

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRawDay(value);
    const newValue = { ...props.value, day: removeLeadingZeros(value) };
    props.setDateValue(newValue);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRawMonth(value);
    const newValue = { ...props.value, month: removeLeadingZeros(value) };
    props.setDateValue(newValue);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRawYear(value);
    const newValue = { ...props.value, year: removeLeadingZeros(value) };
    props.setDateValue(newValue);
  };

  const autocompleteBDay: Record<"day" | "month" | "year", AutocompleteI> = {
    day: {},
    month: {},
    year: {},
  };

  if (props.autocomplete) {
    autocompleteBDay.day.autoComplete = "bday-day";
    autocompleteBDay.month.autoComplete = "bday-month";
    autocompleteBDay.year.autoComplete = "bday-year";
  }

  const [dayMonthClass, setDayMonthClass] = useState(
    "govuk-input govuk-date-input__input govuk-input--width-2",
  );
  const [yearClass, setYearClass] = useState(
    "govuk-input govuk-date-input__input govuk-input--width-4",
  );

  useEffect(() => {
    setDayMonthClass(
      "govuk-input govuk-date-input__input govuk-input--width-2 " +
        `${props.errorMessage && "govuk-input--error"}`,
    );
    setYearClass(
      "govuk-input govuk-date-input__input govuk-input--width-4 " +
        `${props.errorMessage && "govuk-input--error"}`,
    );
  }, [props.errorMessage]);

  const setDateTo = (date: Date) => {
    props.setDateValue({
      day: date.getDate().toString(),
      month: (date.getMonth() + 1).toString(),
      year: date.getFullYear().toString(),
    });
  };

  const handleSetToday = () => {
    const today = new Date();
    setDateTo(today);
  };

  const handleSetYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    setDateTo(yesterday);
  };

  return (
    <FieldWrapper
      id={props.id}
      heading={props.heading}
      label={props.label}
      hint={props.hint}
      errorMessage={props.errorMessage}
      headingLevel={props.headingLevel}
      headingSize={props.headingSize}
      labelStyle={props.labelStyle}
      headingStyle={props.headingStyle}
      divStyle={props.divStyle}
    >
      <div className="govuk-date-input" id={props.id}>
        <div className="govuk-date-input__item">
          <div className="govuk-form-group">
            <label className="govuk-label govuk-date-input__label" htmlFor={`${props.id}-day`}>
              Day
            </label>
            <input
              {...autocompleteBDay.day}
              className={dayMonthClass}
              id={`${props.id}-day`}
              data-testid={`${props.id}-day`}
              type="text"
              value={rawDay}
              onChange={handleDayChange}
            />
          </div>
        </div>
        <div className="govuk-date-input__item">
          <div className="govuk-form-group">
            <label className="govuk-label govuk-date-input__label" htmlFor={`${props.id}-month`}>
              Month
            </label>
            <input
              {...autocompleteBDay.month}
              className={dayMonthClass}
              id={`${props.id}-month`}
              data-testid={`${props.id}-month`}
              type="text"
              value={rawMonth}
              onChange={handleMonthChange}
            />
          </div>
        </div>
        <div className="govuk-date-input__item">
          <div className="govuk-form-group">
            <label className="govuk-label govuk-date-input__label" htmlFor={`${props.id}-year`}>
              Year
            </label>
            <input
              {...autocompleteBDay.year}
              className={yearClass}
              id={`${props.id}-year`}
              data-testid={`${props.id}-year`}
              type="text"
              value={rawYear}
              onChange={handleYearChange}
            />
          </div>
        </div>
      </div>
      {props.showTodayYesterdayLinks && (
        <div className="govuk-body govuk-!-margin-top-2">
          <span className="govuk-!-margin-right-2">Set to:</span>
          <a
            href="#"
            className="govuk-link govuk-!-margin-right-3"
            data-testid={`${props.id}-quickfill-today`}
            onClick={(e) => {
              e.preventDefault();
              handleSetToday();
            }}
          >
            Today
          </a>
          <a
            href="#"
            className="govuk-link"
            data-testid={`${props.id}-quickfill-yesterday`}
            onClick={(e) => {
              e.preventDefault();
              handleSetYesterday();
            }}
          >
            Yesterday
          </a>
        </div>
      )}
    </FieldWrapper>
  );
};

export default DateTextInput;
