'use client'

import { ChangeEventHandler } from "react";

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
}

export default function Dropdown(props: Readonly<DropdownProps>) {

    return (
        <div className="govuk-form-group">
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
            
            <select 
                className="govuk-select" 
                id={props.id} 
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
