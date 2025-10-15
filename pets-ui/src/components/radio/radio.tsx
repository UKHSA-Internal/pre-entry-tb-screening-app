import { Fragment, useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";

import { RadioIsInline } from "@/utils/enums";

import FieldWrapper from "../fieldWrapper/fieldWrapper";
import { HeadingSize } from "../heading/heading";

export interface ConditionalInputConfig {
  triggerValue: string;
  id: string;
  name: string;
  label?: string;
  required?: string | boolean;
}

export interface RadioProps {
  id: string;
  heading?: string;
  label?: string;
  hint?: string;
  isInline: RadioIsInline;
  answerOptions: string[];
  exclusiveAnswerOptions?: string[];
  sortAnswersAlphabetically: boolean;
  errorMessage: string;
  formValue: string;
  required: string | false;
  defaultValue?: string;
  headingLevel?: 1 | 2 | 3 | 4;
  headingSize?: HeadingSize;
  headingStyle?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
  divStyle?: React.CSSProperties;
  conditionalInput?: ConditionalInputConfig;
}

export default function Radio(props: Readonly<RadioProps>) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const { answerOptions, exclusiveOptions } = useMemo(() => {
    const answerOptions = [...props.answerOptions];
    const exclusiveOptions = [...(props.exclusiveAnswerOptions ?? [])];

    if (props.sortAnswersAlphabetically) {
      answerOptions.sort((a, b) => a.localeCompare(b));
      exclusiveOptions.sort((a, b) => a.localeCompare(b));
    }
    return { answerOptions: answerOptions, exclusiveOptions: exclusiveOptions };
  }, [props.answerOptions, props.exclusiveAnswerOptions, props.sortAnswersAlphabetically]);

  const [showConditionalInput, setShowConditionalInput] = useState(false);
  const watchedValue = watch(props.formValue) as string | undefined;

  useEffect(() => {
    if (!props.conditionalInput) {
      setShowConditionalInput(false);
      return;
    }

    const valueToCheck = watchedValue ?? props.defaultValue;
    const isTriggerSelected = valueToCheck === props.conditionalInput.triggerValue;
    setShowConditionalInput(Boolean(isTriggerSelected));
  }, [watchedValue, props.conditionalInput, props.defaultValue]);

  const getConditionalError = () => {
    if (!props.conditionalInput) return undefined;
    return errors[props.conditionalInput.name];
  };

  const conditionalError = getConditionalError();

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
      labelStyle={props.labelStyle}
      divStyle={props.divStyle}
    >
      <div className={props.isInline} data-module="govuk-radios">
        {answerOptions.map((option, index) => {
          const optionId = `${props.id}-${index}`;
          const isConditionalTrigger = props.conditionalInput?.triggerValue === option;
          return (
            <Fragment key={optionId}>
              <div className="govuk-radios__item">
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
              {isConditionalTrigger && props.conditionalInput && showConditionalInput && (
                <div
                  id={`conditional-${props.conditionalInput.id}`}
                  className={`govuk-radios__conditional ${
                    conditionalError ? "govuk-radios__conditional--error" : ""
                  }`}
                >
                  {conditionalError && (
                    <span className="govuk-error-message">
                      <span className="govuk-visually-hidden">Error:</span>
                      {conditionalError.message as string}
                    </span>
                  )}
                  <div className="govuk-form-group">
                    {props.conditionalInput.label && (
                      <label className="govuk-label" htmlFor={props.conditionalInput.id}>
                        {props.conditionalInput.label}
                      </label>
                    )}
                    <input
                      className={`govuk-input govuk-input--width-20 ${
                        conditionalError ? "govuk-input--error" : ""
                      }`}
                      id={props.conditionalInput.id}
                      type="text"
                      data-testid={props.conditionalInput.id}
                      {...register(props.conditionalInput.name, {
                        required: showConditionalInput
                          ? (props.conditionalInput.required ?? false)
                          : false,
                        setValueAs: (value: string) => value.trim(),
                      })}
                      defaultValue=""
                    />
                  </div>
                </div>
              )}
            </Fragment>
          );
        })}
        {exclusiveOptions.map((option, index) => {
          const optionId = `${props.id}-exclusive-${index}`;
          return (
            <div key={optionId}>
              <div className="govuk-radios__divider">or</div>
              <div className="govuk-radios__item">
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
            </div>
          );
        })}
      </div>
    </FieldWrapper>
  );
}
