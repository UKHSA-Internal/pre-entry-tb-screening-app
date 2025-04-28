import "./dateTextInput.scss";

import { useEffect, useState } from "react";

import { DateType } from "@/applicant";

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
}

interface AutocompleteI {
  autoComplete?: string;
}

const DateTextInput: React.FC<DateProps> = (props: Readonly<DateProps>) => {
  const { day, month, year } = props.value || {};

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = {
      ...props.value,
      day: e.target.value.trim(),
    };
    props.setDateValue(newValue); // Update the whole date object
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = {
      ...props.value,
      month: e.target.value.trim(),
    };
    props.setDateValue(newValue); // Update the whole date object
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = {
      ...props.value,
      year: e.target.value.trim(),
    };
    props.setDateValue(newValue); // Update the whole date object
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
              inputMode="numeric"
              value={day || ""}
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
              inputMode="numeric"
              value={month || ""}
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
              inputMode="numeric"
              value={year || ""}
              onChange={handleYearChange}
            />
          </div>
        </div>
      </div>
    </FieldWrapper>
  );
};

export default DateTextInput;
