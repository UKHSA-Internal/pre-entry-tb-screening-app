import Button from "@/components/button/button";
import { ButtonType } from "@/utils/enums";

export interface SubmitButtonProps {
  id: string;
  type: ButtonType;
  text: string;
}

export default function SubmitButton(props: Readonly<SubmitButtonProps>) {
  return <Button id={props.id} type={props.type} text={props.text} />;
}
