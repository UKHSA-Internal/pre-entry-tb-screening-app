import "./checkbox.scss";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import Heading, { HeadingSize } from "../heading/heading";
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

export default function Checkbox({
  headingLevel = 2,
  headingSize = "m",
  ...props
}: Readonly<CheckboxProps>) {
  const answerOptions: string[] = props.answerOptions;
  if (props.sortAnswersAlphabetically) {
    answerOptions.sort((a, b) => a.localeCompare(b));
  }
  const exclusiveAnswerOptions: string[] = props.exclusiveAnswerOptions ?? [];
  if (props.sortAnswersAlphabetically) {
    exclusiveAnswerOptions.sort((a, b) => a.localeCompare(b));
  }

  const { register } = useFormContext();
  const [errorText, setErrorText] = useState("");
  const [wrapperClass, setWrapperClass] = useState("govuk-form-group");

  useEffect(() => {
    setErrorText(props.errorMessage);
    setWrapperClass("govuk-form-group" + (props.errorMessage ? " govuk-form-group--error" : ""));
  }, [props.errorMessage]);

  return (
    <div id={props.id} className={wrapperClass}>
      <fieldset
        className="govuk-fieldset"
        aria-describedby={props.heading && props.label && `${props.id}-label`}
      >
        <legend className="govuk-fieldset__legend">
          {props.heading ? (
            <Heading
              title={props.heading}
              level={headingLevel}
              size={headingSize}
              style={{
                ...(props.heading && checkboxHeadingStyles),
              }}
            />
          ) : (
            props.label
          )}
        </legend>

        {props.heading && props.label && (
          <div className="govuk-label" id={`${props.id}-label`}>
            {props.label}
          </div>
        )}
        {props.hint && <div className="govuk-hint">{props.hint}</div>}
        {errorText && (
          <p className="govuk-error-message">
            <span className="govuk-visually-hidden">Error:</span> {errorText}
          </p>
        )}
        <div className="govuk-checkboxes" data-module="govuk-checkboxes">
          {answerOptions.map((answerOption: string, index: number) => {
            const optionId = `${props.id}-option-${index}`;
            return (
              <div className="govuk-checkboxes__item" key={optionId}>
                <input
                  id={optionId}
                  className="govuk-checkboxes__input"
                  type="checkbox"
                  data-testid={props.id}
                  value={answerOption}
                  {...register(props.formValue, {
                    required: props.required,
                  })}
                  defaultChecked={props.defaultValue?.includes(answerOption)}
                />
                <label className="govuk-label govuk-checkboxes__label" htmlFor={optionId}>
                  {answerOption}
                </label>
              </div>
            );
          })}
          {exclusiveAnswerOptions.map((exclusiveAnswerOption: string, index: number) => {
            const exclusiveOptionId = `${props.id}-exclusive-${index}`;
            return (
              <div key={exclusiveOptionId}>
                <div className="govuk-checkboxes__divider">or</div>
                <div className="govuk-checkboxes__item">
                  <input
                    id={exclusiveOptionId}
                    className="govuk-checkboxes__input"
                    type="checkbox"
                    data-testid={props.id}
                    value={exclusiveAnswerOption}
                    {...register(props.formValue, {
                      required: props.required,
                    })}
                    data-behaviour="exclusive"
                    defaultChecked={props.defaultValue?.includes(exclusiveAnswerOption)}
                  />
                  <label
                    className="govuk-label govuk-checkboxes__label"
                    htmlFor={exclusiveOptionId}
                  >
                    {exclusiveAnswerOption}
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
