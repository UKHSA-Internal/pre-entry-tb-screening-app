import { MouseEventHandler } from "react";

import { ButtonClass, ButtonType } from "@/utils/enums";

export interface ButtonProps {
  id: string;
  class: ButtonClass;
  text: string;
  type?: ButtonType;
  handleClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function Button(props: Readonly<ButtonProps>) {
  return (
    <button
      type={props.type ?? "submit"}
      className={props.class}
      data-module="govuk-button"
      onClick={props.handleClick}
      style={{ marginTop: 30 }}
    >
      {props.text}
    </button>
  );
}
