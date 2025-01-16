import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";

interface OptionItem {
    label: string;
    value: string;
}

interface DropdownProps {
    id: string;
    label?: string;
    hint?: string;
    options: OptionItem[];
    errorMessage: string;
    formValue: string;
    required: string | false;
    defaultValue?: string;
}

export default function Dropdown(props: Readonly<DropdownProps>) {
    const { register } = useFormContext()
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
                aria-describedby={`${props.id}-hint`}
                defaultValue={props.defaultValue ?? ""}
                {...register(props.formValue, { 
                    required: props.required,
                })}
            >
                <option disabled value="">Select an option</option>
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
