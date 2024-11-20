'use client'
import { FormEventHandler, useState, useEffect } from "react";

export enum RadioIsInline {
    TRUE = "govuk-radios govuk-radios--inline",
    FALSE = "govuk-radios",
}

export interface RadioProps {
    id: string;
    title?: string;
    legend?: string;
    hint?: string;
    isInline: RadioIsInline;
    answerOptions: string[];
    sortAnswersAlphabetically: boolean;
    handleChange: FormEventHandler<HTMLDivElement>;
    errorMessage: string;
}

export default function Radio(props: Readonly<RadioProps>) {
    
    const stringToJsxAttribute = (input: string) => {
        return input.toLowerCase().replaceAll(" ", "-").replace(/[^a-z0-9 -]/g, "")
    }
    
    let radioInputName: string = "undefined";
    if (props.title) radioInputName = stringToJsxAttribute(props.title)
    else if (props.legend) radioInputName = stringToJsxAttribute(props.legend)

    const answerOptions: string[] = props.answerOptions
    if (props.sortAnswersAlphabetically) {
        answerOptions.sort((a, b) => a.localeCompare(b))
    }

    const [errorText, setErrorText] = useState("")
    const [wrapperClass, setWrapperClass] = useState("govuk-form-group")
    
    useEffect(() => {
        setErrorText(props.errorMessage)
        setWrapperClass("govuk-form-group " + `${props.errorMessage && "govuk-form-group--error"}`)
    }, [props.errorMessage])
    
    return (
        <div id={props.id} className={wrapperClass}>
            <fieldset className="govuk-fieldset">
                {props.title && 
                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
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
                    <div id="changedName-hint" className="govuk-hint">
                        {props.hint}
                    </div>
                }
                {errorText && 
                    <p className="govuk-error-message">
                        <span className="govuk-visually-hidden">Error:</span> {errorText}
                    </p>
                }
                <div className={props.isInline} data-module="govuk-radios">
                    {answerOptions.map((answerOption: string, index: number) => (
                        <div className="govuk-radios__item" key={`answer-option-${index + 1}`}>
                            <input
                                className="govuk-radios__input"
                                name={radioInputName}
                                type="radio"
                                value={stringToJsxAttribute(answerOption)}
                                onChange={props.handleChange}
                            />
                            <label className="govuk-label govuk-radios__label" htmlFor={props.id}>
                                {answerOption}
                            </label>
                        </div>
                    ))}
                </div>
            </fieldset>
        </div>
    )
}