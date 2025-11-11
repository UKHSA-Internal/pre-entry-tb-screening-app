import { MouseEventHandler } from "react";

import { ButtonClass } from "@/utils/enums";

export interface ButtonProps {
  id: string;
  class: ButtonClass;
  text: string;
  handleClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function Button(props: Readonly<ButtonProps>) {
  return (
    <button
      type="submit"
      className={props.class}
      data-module="govuk-button"
      onClick={props.handleClick}
      style={{ marginTop: 30 }}
    >
      {props.text}
    </button>
  );
}
