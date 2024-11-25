import { DateType } from "@/sections/applicant-form-temp";
import { useEffect, useState } from "react";

export interface DateProps {
    id: string;
    legend?: string;
    hint?: string;
    // The autocomplete prop should only be used when this component is utilised for birth dates
    autocomplete: boolean;
    errorMessage: string;
    value: DateType;
    setDateValue: (value: DateType) => void;
}

interface AutocompleteI {
    autoComplete?: string;
}

const DateTextInput: React.FC<DateProps> = (props: Readonly<DateProps>) => {
    const { day, month, year } = props.value || {};

    const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = { ...props.value, day: e.target.value };
      props.setDateValue(newValue); // Update the whole date object
    };
  
    const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = { ...props.value, month: e.target.value };
      props.setDateValue(newValue); // Update the whole date object
    };
  
    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = { ...props.value, year: e.target.value };
      props.setDateValue(newValue); // Update the whole date object
    };

    const autocompleteBDay: Record<'day' | 'month' | 'year', AutocompleteI> = {
        day: {},
        month: {},
        year: {}
    };

    if (props.autocomplete) {
        autocompleteBDay.day.autoComplete = "bday-day";
        autocompleteBDay.month.autoComplete = "bday-month";
        autocompleteBDay.year.autoComplete = "bday-year";
    }

    const [errorText, setErrorText] = useState("")
    const [wrapperClass, setWrapperClass] = useState("govuk-form-group")
    const [dayMonthClass, setDayMonthClass] = useState("govuk-input govuk-date-input__input govuk-input--width-2")
    const [yearClass, setYearClass] = useState("govuk-input govuk-date-input__input govuk-input--width-4")
    
    useEffect(() => {
        setErrorText(props.errorMessage)
        setWrapperClass("govuk-form-group " + `${props.errorMessage && "govuk-form-group--error"}`)
        setDayMonthClass("govuk-input govuk-date-input__input govuk-input--width-2 " + `${props.errorMessage && "govuk-input--error"}`)
        setYearClass("govuk-input govuk-date-input__input govuk-input--width-4 " + `${props.errorMessage && "govuk-input--error"}`)
    }, [props.errorMessage])

    return (
        <div id={props.id} className={wrapperClass}>
            <fieldset className="govuk-fieldset" role="group" aria-describedby={`${props.id}-hint`}>
                {props.legend && 
                    <legend className="govuk-fieldset__legend">
                        {props.legend}
                    </legend>
                }
                {props.hint && 
                    <div id={`${props.id}-hint`} className="govuk-hint">
                        {props.hint}
                    </div>
                }
                {errorText && 
                    <p className="govuk-error-message">
                        <span className="govuk-visually-hidden">Error:</span> {errorText}
                    </p>
                }
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
                              type="string"
                              value={day || ''}
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
                              type="string"
                              value={month || ''}
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
                              type="string"
                              value={year || ''}
                              onChange={handleYearChange}
                            />
                        </div>
                    </div>
                </div>
            </fieldset>
        </div>
    )
}


export default DateTextInput;