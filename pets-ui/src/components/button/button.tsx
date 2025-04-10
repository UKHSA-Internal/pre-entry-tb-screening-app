import "./button.scss";

import { MouseEventHandler } from "react";

import { ButtonType } from "@/utils/enums";

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
      onClick={props.handleClick}
      style={{ marginTop: 30 }}
    >
      {props.text}
    </button>
  );
}
