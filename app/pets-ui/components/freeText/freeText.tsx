'use client'
import { ChangeEventHandler } from "react";

export interface FreeTextProps {
    id: string;
    title?: string;
    label?: string;
    hint?: string;
    handleChange: ChangeEventHandler<HTMLInputElement>;
}

export default function FreeText(props: Readonly<FreeTextProps>) {
    return (
        <div id={props.id} className="govuk-form-group">
            <h1 className="govuk-label-wrapper">
                <label className="govuk-label govuk-label--l" htmlFor={props.id}>
                    {props.title}
                </label>
            </h1>
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
            <input className="govuk-input" name={props.id} type="text" onChange={props.handleChange}></input>
        </div>
    )
}