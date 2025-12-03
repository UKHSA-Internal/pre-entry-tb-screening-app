import Button from "@/components/button/button";
import { ButtonClass } from "@/utils/enums";

export interface SubmitButtonProps {
  id: string;
  class: ButtonClass;
  text: string;
}

export default function SubmitButton(props: Readonly<SubmitButtonProps>) {
  return <Button id={props.id} class={props.class} text={props.text} />;
}
