import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { RadioIsInline } from "@/utils/enums";

export interface RadioProps {
    id: string;
    legend?: string;
    hint?: string;
    isInline: RadioIsInline;
    answerOptions: string[];
    sortAnswersAlphabetically: boolean;
    errorMessage: string;
    formValue: string;
    required: string | false;
}

export default function Radio(props: Readonly<RadioProps>) {
    
    const stringToJsxAttribute = (input: string) => {
        return input.toLowerCase().replace(/\s/g, "-").replace(/[^a-z0-9 -]/g, "")
    }
    
    const answerOptions: string[] = props.answerOptions
    if (props.sortAnswersAlphabetically) {
        answerOptions.sort((a, b) => a.localeCompare(b))
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
                                type="radio"
                                data-testid={props.id}
                                value={stringToJsxAttribute(answerOption)}
                                {...register(props.formValue, { 
                                    required: props.required,
                                })}
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