import "./dropdown.scss";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import Heading, { HeadingSize } from "../heading/heading";
import { dropdownHeadingStyles } from "./dropdown.styles";

interface OptionItem {
  label: string;
  value: string;
}

interface DropdownProps {
  id: string;
  label?: string;
  heading?: string;
  hint?: string;
  options: OptionItem[];
  errorMessage: string;
  formValue: string;
  required: string | false;
  defaultValue?: string;
  headingLevel?: 1 | 2 | 3 | 4;
  headingSize?: HeadingSize;
  headingStyle?: React.CSSProperties;
}

export default function Dropdown({
  headingLevel = 2,
  headingSize = "m",
  ...props
}: Readonly<DropdownProps>) {
  const { register } = useFormContext();
  const [errorText, setErrorText] = useState("");
  const [wrapperClass, setWrapperClass] = useState("govuk-form-group");
  const [selectClass, setSelectClass] = useState("govuk-select");

  useEffect(() => {
    setErrorText(props.errorMessage);
    setWrapperClass("govuk-form-group" + (props.errorMessage ? " govuk-form-group--error" : ""));
    setSelectClass("govuk-select" + (props.errorMessage ? " govuk-select--error" : ""));
  }, [props.errorMessage]);

  return (
    <div id={props.id} className={wrapperClass}>
      {props.heading && (
        <Heading
          title={props.heading}
          level={headingLevel}
          size={headingSize}
          style={{ ...dropdownHeadingStyles, ...props.headingStyle }}
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
      <select
        id={props.id}
        aria-labelledby={props.id}
        className={selectClass}
        defaultValue={props.defaultValue ?? ""}
        {...register(props.formValue, {
          required: props.required,
        })}
      >
        <option disabled value="">
          Select an option
        </option>
        {props.options.map((optionItem: OptionItem, index: number) => (
          <option value={optionItem.value} key={`${props.id}-${index + 1}`}>
            {optionItem.label}
          </option>
        ))}
      </select>
    </div>
  );
}
