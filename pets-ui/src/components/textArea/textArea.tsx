import "./textArea.scss";

import { useFormContext } from "react-hook-form";

import FieldWrapper from "../fieldWrapper/fieldWrapper";
import { HeadingSize } from "../heading/heading";

export interface TextAreaProps {
  id: string;
  label?: string;
  heading?: string;
  hint?: string;
  errorMessage: string;
  formValue: string;
  required: string | false;
  rows: number;
  defaultValue?: string;
  headingLevel?: 1 | 2 | 3 | 4;
  headingSize?: HeadingSize;
  headingStyle?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
  divStyle?: React.CSSProperties;
}

export default function TextArea(props: Readonly<TextAreaProps>) {
  const { register } = useFormContext();

  return (
    <FieldWrapper
      id={props.id}
      heading={props.heading}
      label={props.label}
      hint={props.hint}
      errorMessage={props.errorMessage}
      headingLevel={props.headingLevel}
      headingSize={props.headingSize}
      headingStyle={props.headingStyle}
      useFieldset={false}
      labelStyle={props.labelStyle}
      divStyle={props.divStyle}
    >
      <textarea
        id={props.id}
        className="govuk-textarea"
        rows={props.rows}
        data-testid={props.id}
        {...register(props.formValue, {
          required: props.required,
        })}
        defaultValue={props.defaultValue ?? ""}
      />
    </FieldWrapper>
  );
}
