'use client'
import { MouseEventHandler } from 'react';

export enum ButtonType {
    DEFAULT = "govuk-button",
    SECONDARY = "govuk-button govuk-button--secondary",
    WARNING = "govuk-button govuk-button--warning"
}

export interface ButtonProps {
    id: string;
    type: ButtonType;
    text: string;
    href: string;
    handleClick: MouseEventHandler<HTMLButtonElement>;
}

export default function Button(props: Readonly<ButtonProps>) {
    return (
        <button
            type="submit"
            className={props.type}
            data-module="govuk-button"
            onClick={props.handleClick}>
            {props.text}
        </button>
    )
}