'use client'
import { ChangeEventHandler, useEffect, useState } from "react";

// import { useFormContext } from "react-hook-form";

export interface FreeTextProps {
    id: string;
    title?: string;
    label?: string;
    hint?: string;
    handleChange: ChangeEventHandler<HTMLInputElement>;
    errorMessage: string;
    // input?:  string;
}

export default function FreeText(props: Readonly<FreeTextProps>) {
    const [errorText, setErrorText] = useState("")
    const [wrapperClass, setWrapperClass] = useState("govuk-form-group")
    const [inputClass, setInputClass] = useState("govuk-input")

    // const { register } = useFormContext() //retrieve all hook methods
    
    useEffect(() => {
        setErrorText(props.errorMessage)
        setWrapperClass("govuk-form-group " + `${props.errorMessage && "govuk-form-group--error"}`)
        setInputClass("govuk-input " + `${props.errorMessage && "govuk-input--error"}`)
    }, [props.errorMessage])
    
    return (
        <div id={props.id} className={wrapperClass}>
            <h2 className="govuk-label-wrapper">
                <label className="govuk-label govuk-label--m" htmlFor={props.id}>
                    {props.title}
                </label>
            </h2>
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
              // {...register("passportNumber", {
              //   required: "Enter sex",
              //   pattern: {
              //     value: /A-Za-z\s/, 
              //     message: "Sex must contain only letters and spaces."
              //   }
              // }) }
              className={inputClass} 
              name={props.id} 
              type="text" 
              onChange={props.handleChange}
            >
            </input>
        </div>
    )
}