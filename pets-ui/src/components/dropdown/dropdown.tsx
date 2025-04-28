import "./dropdown.scss";

import { useFormContext } from "react-hook-form";

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
}

export default function Dropdown(props: Readonly<DropdownProps>) {
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
      <select
        aria-labelledby={props.heading && props.id}
        id={props.label && !props.heading ? props.id : undefined}
        className="govuk-select"
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
    </FieldWrapper>
  );
}
