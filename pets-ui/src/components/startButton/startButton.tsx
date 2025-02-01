import { MouseEventHandler } from "react";

export interface StartButtonProps {
  id: string;
  text: string;
  href: string;
  handleClick: MouseEventHandler<HTMLButtonElement>;
}

export default function StartButton(props: Readonly<StartButtonProps>) {
  return (
    <button
      id={props.id}
      onClick={props.handleClick}
      draggable="false"
      className="govuk-button govuk-button--start"
      data-module="govuk-button"
    >
      {props.text}
      <svg
        className="govuk-button__start-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="17.5"
        height="19"
        viewBox="0 0 33 40"
        aria-hidden="true"
        focusable="false"
      >
        <path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z" />
      </svg>
    </button>
  );
}
