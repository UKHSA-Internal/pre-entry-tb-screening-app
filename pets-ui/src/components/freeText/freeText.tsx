import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

export interface FreeTextProps {
    id: string;
    label?: string;
    hint?: string;
    errorMessage: string;
    formValue: string;
    required: string | false;
    patternValue: RegExp;
    patternError: string;
}

export default function FreeText(props: Readonly<FreeTextProps>) {
    const { register } = useFormContext()
    const [errorText, setErrorText] = useState("")
    const [wrapperClass, setWrapperClass] = useState("govuk-form-group")
    const [inputClass, setInputClass] = useState("govuk-input")

    useEffect(() => {
        setErrorText(props.errorMessage)
        setWrapperClass("govuk-form-group " + `${props.errorMessage && "govuk-form-group--error"}`)
        setInputClass("govuk-input " + `${props.errorMessage && "govuk-input--error"}`)
    }, [props.errorMessage])
    
    return (
        <div id={props.id} className={wrapperClass}>
            {props.label &&
                <label className="govuk-label" htmlFor={props.id}>
                    {props.label}
                </label>
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
            <input
                className={inputClass} 
                type="text" 
                {...register(props.formValue, { 
                    required: props.required,
                    pattern: {
                        value: props.patternValue,
                        message: props.patternError
                    }
                })}
            />
        </div>
    )
}