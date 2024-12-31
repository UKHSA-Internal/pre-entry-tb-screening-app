import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

export interface TextAreaProps {
    id: string;
    label?: string;
    hint?: string;
    errorMessage: string;
    formValue: string;
    required: string | false;
    rows: number;
}

export default function TextArea(props: Readonly<TextAreaProps>) {
    const { register } = useFormContext()
    const [errorText, setErrorText] = useState("")
    const [wrapperClass, setWrapperClass] = useState("govuk-form-group")
    const [inputClass, setInputClass] = useState("govuk-textarea")

    useEffect(() => {
        setErrorText(props.errorMessage)
        setWrapperClass("govuk-form-group " + `${props.errorMessage && "govuk-form-group--error"}`)
        setInputClass("govuk-textarea " + `${props.errorMessage && "govuk-input--error"}`)
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
            <textarea
                className={inputClass} 
                rows={props.rows}
                data-testid={props.id}
                {...register(props.formValue, { 
                    required: props.required,
                })}
            />
        </div>
    )
}