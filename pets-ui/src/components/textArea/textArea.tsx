import "./textArea.scss";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import Heading, { HeadingSize } from "../heading/heading";
import { textAreaHeadingStyles } from "./textArea.styles";

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
}

export default function TextArea({
  headingLevel = 2,
  headingSize = "m",
  ...props
}: Readonly<TextAreaProps>) {
  const { register } = useFormContext();
  const [errorText, setErrorText] = useState("");
  const [wrapperClass, setWrapperClass] = useState("govuk-form-group");
  const [inputClass, setInputClass] = useState("govuk-textarea");

  useEffect(() => {
    setErrorText(props.errorMessage);
    setWrapperClass("govuk-form-group" + (props.errorMessage ? " govuk-form-group--error" : ""));
    setInputClass("govuk-textarea" + (props.errorMessage ? " govuk-textarea--error" : ""));
  }, [props.errorMessage]);

  return (
    <div id={props.id} className={wrapperClass}>
      {props.heading && (
        <Heading
          title={props.heading}
          level={headingLevel}
          size={headingSize}
          style={{ ...textAreaHeadingStyles, ...props.headingStyle }}
          id={props.label ? `${props.id}-heading` : props.id}
        />
      )}
      {props.label && (
        <label className="govuk-label" htmlFor={props.id}>
          {props.label}
        </label>
      )}
      {props.hint && (
        <div className="govuk-hint" id={`${props.id}-hint`}>
          {props.hint}
        </div>
      )}
      {errorText && (
        <p className="govuk-error-message">
          <span className="govuk-visually-hidden">Error:</span> {errorText}
        </p>
      )}
      <textarea
        id={props.id}
        className={inputClass}
        rows={props.rows}
        data-testid={props.id}
        aria-labelledby={props.id}
        {...register(props.formValue, {
          required: props.required,
        })}
        defaultValue={props.defaultValue ?? ""}
      />
    </div>
  );
}
