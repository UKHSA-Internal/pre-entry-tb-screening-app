import "./radio.scss";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { RadioIsInline } from "@/utils/enums";

import Heading, { HeadingSize } from "../heading/heading";
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

export default function Radio({
  headingLevel = 2,
  headingSize = "m",
  ...props
}: Readonly<RadioProps>) {
  const answerOptions: string[] = props.answerOptions;
  if (props.sortAnswersAlphabetically) {
    answerOptions.sort((a, b) => a.localeCompare(b));
  }

  const { register } = useFormContext();
  const [errorText, setErrorText] = useState("");
  const [wrapperClass, setWrapperClass] = useState("govuk-form-group");

  useEffect(() => {
    setErrorText(props.errorMessage);
    setWrapperClass("govuk-form-group" + (props.errorMessage ? " govuk-form-group--error" : ""));
  }, [props.errorMessage]);

  return (
    <div className={wrapperClass}>
      <fieldset
        className="govuk-fieldset"
        id={props.id}
        aria-describedby={props.heading && props.label && `${props.id}-label`}
      >
        <legend className="govuk-fieldset__legend">
          {props.heading ? (
            <Heading
              title={props.heading}
              level={headingLevel}
              size={headingSize}
              style={{
                ...(props.label ? radioHeadingWithLabelStyles : radioHeadingStyles),
                ...props.headingStyle,
              }}
            />
          ) : (
            props.label
          )}
        </legend>

        {props.heading && props.label && (
          <div className="govuk-label" id={`${props.id}-label`} style={radioLabelStyles}>
            {props.label}
          </div>
        )}
        {props.hint && <div className="govuk-hint">{props.hint}</div>}
        {errorText && (
          <p className="govuk-error-message">
            <span className="govuk-visually-hidden">Error:</span> {errorText}
          </p>
        )}
        <div className={props.isInline} data-module="govuk-radios">
          {answerOptions.map((answerOption, index) => {
            const optionId = `${props.id}-${index}`;
            return (
              <div className="govuk-radios__item" key={optionId}>
                <input
                  className="govuk-radios__input"
                  id={optionId}
                  type="radio"
                  data-testid={props.id}
                  value={answerOption}
                  {...register(props.formValue, {
                    required: props.required,
                  })}
                  defaultChecked={props.defaultValue == answerOption}
                />
                <label className="govuk-label govuk-radios__label" htmlFor={optionId}>
                  {answerOption}
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
