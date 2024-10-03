'use client'
import Link from 'next/link'

export interface ButtonProps {
    id: string;
    text: string;
    href: string;
}

export default function Button(props: ButtonProps) {
    return (
        <div id={props.id} className="govuk-button-group">
            <Link href={props.href}>
                <button type="submit" className="govuk-button" data-module="govuk-button">
                    {props.text}
                </button>
            </Link>
        </div>
    )
}