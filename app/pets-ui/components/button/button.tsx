'use client'
import Link from 'next/link'

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
}

export default function Button(props: ButtonProps) {
    return (
        <Link id={props.id} href={props.href}>
            <button type="submit" className={props.type} data-module="govuk-button">
                {props.text}
            </button>
        </Link>
    )
}