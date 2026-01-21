import { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { getDescribedBy } from "@/utils/getDescribedBy";

import FieldWrapper from "../fieldWrapper/fieldWrapper";
import { HeadingSize } from "../heading/heading";

export interface TextAreaProps {
  id: string;
  label?: string;
  heading?: string;
  hint?: string;
  errorMessage: string;
  formValue: string;
  required: string | false;
  rows: number;
  defaultValue?: string;
  headingLevel?: 1 | 2 | 3 | 4;
  headingSize?: HeadingSize;
  headingStyle?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
  divStyle?: React.CSSProperties;
  maxWordCount?: number;
}

export default function TextArea(props: Readonly<TextAreaProps>) {
  const { maxWordCount = 150 } = props;
  const { register, control } = useFormContext();

  const getWordCount = (value?: string) => {
    return value ? value.trim().split(/\s+/).filter(Boolean).length : 0;
  };
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const fieldValue: string = useWatch({
    control,
    name: props.formValue,
  });
  const remainingWordCount = maxWordCount ? maxWordCount - getWordCount(fieldValue) : null;

  const [inputClass, setInputClass] = useState("govuk-textarea");

  useEffect(() => {
    setInputClass("govuk-textarea" + (props.errorMessage ? " govuk-textarea--error" : ""));
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
      <textarea
        aria-labelledby={props.heading && `${props.id}-field`}
        id={props.label && !props.heading ? `${props.id}-field` : undefined}
        aria-describedby={getDescribedBy(props.id, props.hint, props.heading, props.label)}
        className={inputClass}
        rows={props.rows}
        data-testid={props.id}
        {...register(props.formValue, {
          required: props.required,
          validate: maxWordCount
            ? {
                maxWords: (value: string) => {
                  if (maxWordCount && getWordCount(value) > maxWordCount) {
                    return `"${props.heading ?? props.label}" must be ${maxWordCount} words or fewer`;
                  } else {
                    return true;
                  }
                },
              }
            : undefined,
        })}
        defaultValue={props.defaultValue ?? ""}
        style={maxWordCount ? { margin: 0 } : {}}
      />
      {maxWordCount > 0 && (
        <div style={{ margin: 0, padding: 0 }}>
          <div
            id="word-count-info"
            className="govuk-hint govuk-character-count__message govuk-visually-hidden"
          >
            You can enter up to {maxWordCount} words
          </div>
          {remainingWordCount != null && remainingWordCount >= 0 && (
            <div className="govuk-hint govuk-character-count__message govuk-character-count__status">
              You have {remainingWordCount} word{remainingWordCount != 1 && "s"} remaining
            </div>
          )}
          {remainingWordCount != null && remainingWordCount < 0 && (
            <div className="govuk-character-count__message govuk-character-count__status govuk-error-message">
              You have {-1 * remainingWordCount} word{remainingWordCount != -1 && "s"} too many
            </div>
          )}
        </div>
      )}
    </FieldWrapper>
  );
}
