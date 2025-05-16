import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { getDescribedBy } from "@/utils/getDescribedBy";

import FieldWrapper from "../fieldWrapper/fieldWrapper";
import { HeadingSize } from "../heading/heading";

export interface FreeTextProps {
  id: string;
  label?: string;
  heading?: string;
  hint?: string;
  errorMessage: string;
  formValue: string;
  required: string | false;
  patternValue: RegExp;
  patternError: string;
  inputWidth?: number;
  suffixText?: string;
  defaultValue?: string;
  headingLevel?: 1 | 2 | 3 | 4;
  headingSize?: HeadingSize;
  headingStyle?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
  divStyle?: React.CSSProperties;
}

export default function FreeText(props: Readonly<FreeTextProps>) {
  const { register } = useFormContext();
  const [inputClass, setInputClass] = useState(
    `govuk-input govuk-input--width-${props.inputWidth}`,
  );

  useEffect(() => {
    setInputClass(
      `govuk-input govuk-input--width-${props.inputWidth} ` +
        (props.errorMessage ? "govuk-input--error" : ""),
    );
  }, [props.errorMessage, props.inputWidth]);

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
      <input
        className={inputClass}
        aria-labelledby={props.heading && `${props.id}-field`}
        id={props.label && !props.heading ? `${props.id}-field` : undefined}
        aria-describedby={getDescribedBy(props.id, props.hint, props.heading, props.label)}
        type="text"
        data-testid={props.id}
        {...register(props.formValue, {
          required: props.required,
          pattern: {
            value: props.patternValue,
            message: props.patternError,
          },
          setValueAs: (value: string) => value.trim(),
        })}
        defaultValue={props.defaultValue ?? ""}
      />
      {props.suffixText && (
        <div className="govuk-input__suffix" style={{ display: "inline-flex" }}>
          {props.suffixText}
        </div>
      )}
    </FieldWrapper>
  );
}
