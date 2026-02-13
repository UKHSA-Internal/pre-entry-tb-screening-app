import { ChangeEvent, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { getDescribedBy } from "@/utils/getDescribedBy";

import FieldWrapper from "../fieldWrapper/fieldWrapper";
import { HeadingSize } from "../heading/heading";

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
  labelStyle?: React.CSSProperties;
  divStyle?: React.CSSProperties;
  selectStyle?: React.CSSProperties;
  disabled?: boolean;
  placeholder?: string;
}

export default function Dropdown(props: Readonly<DropdownProps>) {
  const { register } = useFormContext();
  const [selectClass, setSelectClass] = useState("govuk-select");
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    setSelectClass("govuk-select" + (props.errorMessage ? " govuk-select--error" : ""));
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
      {selectedOption && (
        <div className="govuk-visually-hidden" tabIndex={-1} aria-live="polite" aria-atomic="true">
          Selected option: {selectedOption}
        </div>
      )}
      <select
        id={`${props.id}-field`}
        aria-describedby={getDescribedBy(props.id, props.hint, props.heading, props.label)}
        className={selectClass}
        defaultValue={props.defaultValue ?? ""}
        disabled={props.disabled}
        style={props.selectStyle}
        {...register(props.formValue, {
          required: props.required,
        })}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          setSelectedOption(e.target.selectedOptions[0].text);
        }}
      >
        <option disabled value="">
          {props.placeholder ?? "Select an option"}
        </option>
        {props.options.map((optionItem: OptionItem, index: number) => (
          <option value={optionItem.value} key={`${props.id}-${index + 1}`}>
            {optionItem.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}
