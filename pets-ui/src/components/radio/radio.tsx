import "./radio.scss";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { RadioIsInline } from "@/utils/enums";

export interface RadioProps {
  id: string;
  legend?: string;
  hint?: string;
  isInline: RadioIsInline;
  answerOptions: string[];
  sortAnswersAlphabetically: boolean;
  errorMessage: string;
  formValue: string;
  required: string | false;
  defaultValue?: string;
}

export default function Radio(props: Readonly<RadioProps>) {
  const answerOptions: string[] = props.answerOptions;
  if (props.sortAnswersAlphabetically) {
    answerOptions.sort((a, b) => a.localeCompare(b));
  }

  const { register } = useFormContext();
  const [errorText, setErrorText] = useState("");
  const [wrapperClass, setWrapperClass] = useState("govuk-form-group");

  useEffect(() => {
    setErrorText(props.errorMessage);
    setWrapperClass("govuk-form-group " + (props.errorMessage ? "govuk-form-group--error" : ""));
  }, [props.errorMessage]);

  return (
    <div id={props.id} className={wrapperClass}>
      <fieldset className="govuk-fieldset">
        {props.legend && <legend className="govuk-fieldset__legend">{props.legend}</legend>}
        {props.hint && <div className="govuk-hint">{props.hint}</div>}
        {errorText && (
          <p className="govuk-error-message">
            <span className="govuk-visually-hidden">Error:</span> {errorText}
          </p>
        )}
        <div className={props.isInline} data-module="govuk-radios">
          {answerOptions.map((answerOption: string, index: number) => {
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
