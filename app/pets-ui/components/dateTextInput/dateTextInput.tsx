'use client'
import { ChangeEventHandler } from "react";

export interface DateProps {
    id: string;
    title?: string;
    legend?: string;
    hint?: string;
    // The autocomplete prop should only be used when this component is utilised for birth dates
    autocomplete: boolean;
    handleChange: ChangeEventHandler<HTMLInputElement>;
}

interface AutocompleteI {
    autocomplete?: string;
}

export default function DateTextInput(props: Readonly<DateProps>) {
    const autocompleteBDay: Record<'day' | 'month' | 'year', AutocompleteI> = {
        day: {},
        month: {},
        year: {}
    };

    if (props.autocomplete) {
        autocompleteBDay.day.autocomplete = "bday-day";
        autocompleteBDay.month.autocomplete = "bday-month";
        autocompleteBDay.year.autocomplete = "bday-year";
    }

    return (
        <div className="govuk-form-group">
            <fieldset className="govuk-fieldset" role="group" aria-describedby={`${props.id}-hint`}>
                {props.title && 
                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                        <h1 className="govuk-fieldset__heading">
                            {props.title}
                        </h1>
                    </legend>
                }
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
                <div className="govuk-date-input" id={props.id}>
                    <div className="govuk-date-input__item">
                        <div className="govuk-form-group">
                            <label className="govuk-label govuk-date-input__label" htmlFor={`${props.id}-day`}>
                                Day
                            </label>
                            <input 
                                {...autocompleteBDay.day}
                                className="govuk-input govuk-date-input__input govuk-input--width-2" 
                                id={`${props.id}-day`}
                                name={`${props.id}-day`}
                                type="text"
                                onChange={props.handleChange}/>
                        </div>
                    </div>
                    <div className="govuk-date-input__item">
                        <div className="govuk-form-group">
                            <label className="govuk-label govuk-date-input__label" htmlFor={`${props.id}-month`}>
                                Month
                            </label>
                            <input 
                                {...autocompleteBDay.month}
                                className="govuk-input govuk-date-input__input govuk-input--width-2" 
                                id={`${props.id}-month`}
                                name={`${props.id}-month`} 
                                type="text"
                                onChange={props.handleChange}/>
                        </div>
                    </div>
                    <div className="govuk-date-input__item">
                        <div className="govuk-form-group">
                            <label className="govuk-label govuk-date-input__label" htmlFor={`${props.id}-year`}>
                                Year
                            </label>
                            <input 
                                {...autocompleteBDay.year}
                                className="govuk-input govuk-date-input__input govuk-input--width-4" 
                                id={`${props.id}-year`} 
                                name={`${props.id}-year`} 
                                type="text"
                                onChange={props.handleChange}/>
                        </div>
                    </div>
                </div>
            </fieldset>
        </div>
    )
}
