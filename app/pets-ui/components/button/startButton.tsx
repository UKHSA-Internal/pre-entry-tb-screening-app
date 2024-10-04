'use client'
import Link from 'next/link'

export interface StartButtonProps {
    id: string;
    text: string;
    href: string;
}

export default function StartButton(props: Readonly<StartButtonProps>) {
    return (
        <Link id={props.id} href={props.href}>
            <button id={props.id} draggable="false" className="govuk-button govuk-button--start" data-module="govuk-button">
                {props.text}
                <svg className="govuk-button__start-icon" xmlns="http://www.w3.org/2000/svg" width="17.5" height="19" viewBox="0 0 33 40" aria-hidden="true" focusable="false">
                    <path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z" />
                </svg>
            </button>
        </Link>
    )
}