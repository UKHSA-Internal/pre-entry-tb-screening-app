import "./checkbox.scss";

import { useFormContext } from "react-hook-form";

import FieldWrapper from "../fieldWrapper/fieldWrapper";
import { HeadingSize } from "../heading/heading";
import { checkboxHeadingStyles } from "./checkbox.styles";

export interface CheckboxProps {
  id: string;
  heading?: string;
  label?: string;
  hint?: string;
  answerOptions: string[];
  exclusiveAnswerOptions?: string[];
  sortAnswersAlphabetically: boolean;
  errorMessage: string;
  formValue: string;
  required: string | false;
  defaultValue?: string[];
  headingLevel?: 1 | 2 | 3 | 4;
  headingSize?: HeadingSize;
  headingStyle?: React.CSSProperties;
}

export default function Checkbox(props: Readonly<CheckboxProps>) {
  const { register } = useFormContext();

  const answerOptions = [...props.answerOptions];
  const exclusiveOptions = [...(props.exclusiveAnswerOptions ?? [])];

  if (props.sortAnswersAlphabetically) {
    answerOptions.sort((a, b) => a.localeCompare(b));
    exclusiveOptions.sort((a, b) => a.localeCompare(b));
  }

  return (
    <FieldWrapper
      id={props.id}
      heading={props.heading}
      label={props.label}
      hint={props.hint}
      errorMessage={props.errorMessage}
      headingLevel={props.headingLevel}
      headingSize={props.headingSize}
      headingStyle={{
        ...(props.heading && checkboxHeadingStyles),
        ...props.headingStyle,
      }}
    >
      <div className="govuk-checkboxes" data-module="govuk-checkboxes">
        {answerOptions.map((option, index) => {
          const optionId = `${props.id}-option-${index}`;
          return (
            <div className="govuk-checkboxes__item" key={optionId}>
              <input
                id={optionId}
                className="govuk-checkboxes__input"
                type="checkbox"
                data-testid={props.id}
                value={option}
                {...register(props.formValue, {
                  required: props.required,
                })}
                defaultChecked={props.defaultValue?.includes(option)}
              />
              <label className="govuk-label govuk-checkboxes__label" htmlFor={optionId}>
                {option}
              </label>
            </div>
          );
        })}
        {exclusiveOptions.map((option, index) => {
          const optionId = `${props.id}-exclusive-${index}`;
          return (
            <div key={optionId}>
              <div className="govuk-checkboxes__divider">or</div>
              <div className="govuk-checkboxes__item">
                <input
                  id={optionId}
                  className="govuk-checkboxes__input"
                  type="checkbox"
                  data-testid={props.id}
                  value={option}
                  {...register(props.formValue, {
                    required: props.required,
                  })}
                  data-behaviour="exclusive"
                  defaultChecked={props.defaultValue?.includes(option)}
                />
                <label className="govuk-label govuk-checkboxes__label" htmlFor={optionId}>
                  {option}
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </FieldWrapper>
  );
}
