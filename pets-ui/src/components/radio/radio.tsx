import "./radio.scss";

import { useFormContext } from "react-hook-form";

import { RadioIsInline } from "@/utils/enums";

import FieldWrapper from "../fieldWrapper/fieldWrapper";
import { HeadingSize } from "../heading/heading";
import { radioHeadingStyles, radioHeadingWithLabelStyles, radioLabelStyles } from "./radio.styles";

export interface RadioProps {
  id: string;
  heading?: string;
  label?: string;
  hint?: string;
  isInline: RadioIsInline;
  answerOptions: string[];
  sortAnswersAlphabetically: boolean;
  errorMessage: string;
  formValue: string;
  required: string | false;
  defaultValue?: string;
  headingLevel?: 1 | 2 | 3 | 4;
  headingSize?: HeadingSize;
  headingStyle?: React.CSSProperties;
}

export default function Radio(props: Readonly<RadioProps>) {
  const { register } = useFormContext();

  const answerOptions = [...props.answerOptions];
  if (props.sortAnswersAlphabetically) {
    answerOptions.sort((a, b) => a.localeCompare(b));
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
        ...(props.label ? radioHeadingWithLabelStyles : radioHeadingStyles),
        ...props.headingStyle,
      }}
      labelStyle={radioLabelStyles}
    >
      <div className={props.isInline} data-module="govuk-radios">
        {answerOptions.map((option, index) => {
          const optionId = `${props.id}-${index}`;
          return (
            <div className="govuk-radios__item" key={optionId}>
              <input
                className="govuk-radios__input"
                id={optionId}
                type="radio"
                data-testid={props.id}
                value={option}
                {...register(props.formValue, {
                  required: props.required,
                })}
                defaultChecked={props.defaultValue === option}
              />
              <label className="govuk-label govuk-radios__label" htmlFor={optionId}>
                {option}
              </label>
            </div>
          );
        })}
      </div>
    </FieldWrapper>
  );
}
