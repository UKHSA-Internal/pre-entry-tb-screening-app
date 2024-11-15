'use client'

import { ChangeEventHandler, useState, useEffect } from "react";

interface OptionItem {
    label: string;
    value: string;
}

interface DropdownProps {
    id: string;
    label?: string;
    hint?: string;
    name: string;
    options: OptionItem[];
    handleOptionChange: ChangeEventHandler<HTMLSelectElement>;
    errorMessage: string;
}

export default function Dropdown(props: Readonly<DropdownProps>) {
    const [errorText, setErrorText] = useState("")
    const [wrapperClass, setWrapperClass] = useState("govuk-form-group")
    const [selectClass, setSelectClass] = useState("govuk-select")
    
    useEffect(() => {
        setErrorText(props.errorMessage)
        setWrapperClass("govuk-form-group " + `${props.errorMessage && "govuk-form-group--error"}`)
        setSelectClass("govuk-select " + `${props.errorMessage && "govuk-select--error"}`)
    }, [props.errorMessage])

    return (
        <div id={props.id} className={wrapperClass}>
            {props.label && 
                <label className="govuk-label" htmlFor="location">
                    {props.label}
                </label>
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
            <select 
                id={props.id}
                className={selectClass}
                name={props.name} 
                aria-describedby={`${props.id}-hint`}
                onChange={props.handleOptionChange}
                defaultValue="choose"
            >
                <option disabled value="choose">Select {props.name}</option>
                {props.options.map((optionItem: OptionItem, index: number) => (
                    <option 
                        value={optionItem.value} 
                        key={`${props.id}-${index + 1}`}
                    >
                        {optionItem.label}
                    </option>
                ))}
            </select>
        </div>
    )
}
