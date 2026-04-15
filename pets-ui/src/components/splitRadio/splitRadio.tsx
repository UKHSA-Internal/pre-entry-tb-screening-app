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

export interface SplitRadioProps {
  id: string;
  heading?: string;
  label?: string;
  hintOne?: string;
  hintTwo?: string;
  isInline: RadioIsInline;
  answerOptionsOne: string[];
  answerOptionsTwo: string[];
  exclusiveAnswerOptionsOne?: string[];
  exclusiveAnswerOptionsTwo?: string[];
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

export default function SplitRadio(props: Readonly<SplitRadioProps>) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const { answerOptionsOne, exclusiveOptionsOne, answerOptionsTwo, exclusiveOptionsTwo } =
    useMemo(() => {
      const answerOptionsOne = [...props.answerOptionsOne];
      const exclusiveOptionsOne = [...(props.exclusiveAnswerOptionsOne ?? [])];
      const answerOptionsTwo = [...props.answerOptionsTwo];
      const exclusiveOptionsTwo = [...(props.exclusiveAnswerOptionsTwo ?? [])];

      if (props.sortAnswersAlphabetically) {
        answerOptionsOne.sort((a, b) => a.localeCompare(b));
        exclusiveOptionsOne.sort((a, b) => a.localeCompare(b));
        answerOptionsTwo.sort((a, b) => a.localeCompare(b));
        exclusiveOptionsTwo.sort((a, b) => a.localeCompare(b));
      }
      return {
        answerOptionsOne: answerOptionsOne,
        exclusiveOptionsOne: exclusiveOptionsOne,
        answerOptionsTwo: answerOptionsTwo,
        exclusiveOptionsTwo: exclusiveOptionsTwo,
      };
    }, [
      props.answerOptionsOne,
      props.exclusiveAnswerOptionsOne,
      props.answerOptionsTwo,
      props.exclusiveAnswerOptionsTwo,
      props.sortAnswersAlphabetically,
    ]);

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
      errorMessage={props.errorMessage}
      headingLevel={props.headingLevel}
      headingSize={props.headingSize}
      headingStyle={props.headingStyle}
      labelStyle={props.labelStyle}
      divStyle={props.divStyle}
    >
      <div className="govuk-hint" id={`${props.id}-hint-one`}>
        {props.hintOne}
      </div>
      <div className={props.isInline} data-module="govuk-radios">
        {answerOptionsOne.map((option, index) => {
          const optionId = `${props.id}-1-${index}`;
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
            </Fragment>
          );
        })}
        {exclusiveOptionsOne.map((option, index) => {
          const optionId = `${props.id}-1-exclusive-${index}`;
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

      <br />
      <br />

      <div className="govuk-hint" id={`${props.id}-hint-two`}>
        {props.hintTwo}
      </div>
      <div className={props.isInline} data-module="govuk-radios">
        {answerOptionsTwo.map((option, index) => {
          const optionId = `${props.id}-2-${index}`;
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
            </Fragment>
          );
        })}
        {exclusiveOptionsTwo.map((option, index) => {
          const optionId = `${props.id}-2-exclusive-${index}`;
          const isConditionalTrigger = props.conditionalInput?.triggerValue === option;
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
            </div>
          );
        })}
      </div>
    </FieldWrapper>
  );
}
