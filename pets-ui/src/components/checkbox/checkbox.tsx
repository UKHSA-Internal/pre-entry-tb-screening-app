import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";

export interface CheckboxProps {
    id: string;
    legend?: string;
    hint?: string;
    answerOptions: string[];
    exclusiveAnswerOptions?: string[];
    sortAnswersAlphabetically: boolean;
    errorMessage: string;
    formValue: string;
    required: string | false;
    defaultValue?: string[];
}

export default function Checkbox(props: Readonly<CheckboxProps>) {
    
    const stringToJsxAttribute = (input: string) => {
        return input.toLowerCase().replace(/\s/g, "-").replace(/[^a-z0-9 -]/g, "")
    }
    
    const answerOptions: string[] = props.answerOptions
    if (props.sortAnswersAlphabetically) {
        answerOptions.sort((a, b) => a.localeCompare(b))
    }
    const exclusiveAnswerOptions: string[] = props.exclusiveAnswerOptions ?? []
    if (props.sortAnswersAlphabetically) {
        exclusiveAnswerOptions.sort((a, b) => a.localeCompare(b))
    }

    const { register } = useFormContext()
    const [errorText, setErrorText] = useState("")
    const [wrapperClass, setWrapperClass] = useState("govuk-form-group")
    
    useEffect(() => {
        setErrorText(props.errorMessage)
        setWrapperClass("govuk-form-group " + `${props.errorMessage && "govuk-form-group--error"}`)
    }, [props.errorMessage])
    
    return (
        <div id={props.id} className={wrapperClass}>
            <fieldset className="govuk-fieldset">
                {props.legend && 
                    <legend className="govuk-fieldset__legend">
                        {props.legend}
                    </legend>
                }
                {props.hint &&
                    <div className="govuk-hint">
                        {props.hint}
                    </div>
                }
                {errorText && 
                    <p className="govuk-error-message">
                        <span className="govuk-visually-hidden">Error:</span> {errorText}
                    </p>
                }
                <div className="govuk-checkboxes" data-module="govuk-checkboxes">
                    {answerOptions.map((answerOption: string, index: number) => {
                        return (
                            <div className="govuk-checkboxes__item" key={`answer-option-${index + 1}`}>
                                <input
                                    className="govuk-checkboxes__input"
                                    type="checkbox"
                                    data-testid={props.id}
                                    value={stringToJsxAttribute(answerOption)}
                                    {...register(props.formValue, { 
                                        required: props.required,
                                    })}
                                    defaultChecked={props.defaultValue?.includes(stringToJsxAttribute(answerOption))}
                                />
                                <label className="govuk-label govuk-checkboxes__label" htmlFor={props.id}>
                                    {answerOption}
                                </label>
                            </div>
                        )
                    })}
                    {exclusiveAnswerOptions.map((exclusiveAnswerOption: string, index: number) => {
                        return (
                            <div key={`exclusive-answer-option-${index + 1}`}>
                                <div className="govuk-checkboxes__divider">or</div>
                                <div className="govuk-checkboxes__item">
                                    <input
                                        className="govuk-checkboxes__input"
                                        type="checkbox"
                                        data-testid={props.id}
                                        value={stringToJsxAttribute(exclusiveAnswerOption)}
                                        {...register(props.formValue, { 
                                            required: props.required,
                                        })}
                                        data-behaviour="exclusive"
                                        defaultChecked={props.defaultValue?.includes(stringToJsxAttribute(exclusiveAnswerOption))}
                                    />
                                    <label className="govuk-label govuk-checkboxes__label" htmlFor={props.id}>
                                        {exclusiveAnswerOption}
                                    </label>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </fieldset>
        </div>
    )
}