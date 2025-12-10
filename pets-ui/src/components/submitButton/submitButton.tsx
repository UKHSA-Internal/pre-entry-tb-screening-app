import { MouseEventHandler } from "react";

import Button from "@/components/button/button";
import { ButtonClass } from "@/utils/enums";

export interface SubmitButtonProps {
  id: string;
  class: ButtonClass;
  text: string;
  handleClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function SubmitButton(props: Readonly<SubmitButtonProps>) {
  return (
    <Button id={props.id} class={props.class} text={props.text} handleClick={props.handleClick} />
  );
}
