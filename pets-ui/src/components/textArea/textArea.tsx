import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { getDescribedBy } from "@/utils/getDescribedBy";

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
  const [inputClass, setInputClass] = useState("govuk-textarea");

  useEffect(() => {
    setInputClass("govuk-textarea" + (props.errorMessage ? " govuk-textarea--error" : ""));
  }, [props.errorMessage]);

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
        aria-labelledby={props.heading && `${props.id}-field`}
        id={props.label && !props.heading ? `${props.id}-field` : undefined}
        aria-describedby={getDescribedBy(props.id, props.hint, props.heading, props.label)}
        className={inputClass}
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
