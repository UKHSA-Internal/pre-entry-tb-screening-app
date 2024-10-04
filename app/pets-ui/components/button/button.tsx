'use client'
import Link from 'next/link'

export interface ButtonProps {
    id: string;
    type: "default" | "secondary" | "warning";
    text: string;
    href: string;
}

const buttonClassName = (type: string) => {
    if (type == "default") return "govuk-button"
    else if (type == "secondary") return "govuk-button govuk-button--secondary"
    else if (type == "warning") return "govuk-button govuk-button--warning"
    else return "govuk-button"
}

export default function Button(props: ButtonProps) {
    return (
        <div id={props.id} className="govuk-button-group">
            <Link href={props.href}>
                <button type="submit" className={buttonClassName(props.type)} data-module="govuk-button">
                    {props.text}
                </button>
            </Link>
        </div>
    )
}