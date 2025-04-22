import { useEffect, useState } from "react";

import Heading, { HeadingSize } from "../heading/heading";

interface FieldWrapperProps {
  id: string;
  heading?: string;
  label?: string;
  hint?: string;
  headingLevel?: 1 | 2 | 3 | 4;
  headingSize?: HeadingSize;
  headingStyle?: React.CSSProperties;
  children: React.ReactNode;
  labelStyle?: React.CSSProperties;
  useFieldset?: boolean;
  errorMessage: string;
}

export default function FieldWrapper({
  headingLevel = 2,
  headingSize = "m",
  useFieldset = true,
  ...props
}: FieldWrapperProps) {
  const [errorText, setErrorText] = useState("");
  const [wrapperClass, setWrapperClass] = useState("govuk-form-group");

  useEffect(() => {
    setErrorText(props.errorMessage);
    setWrapperClass(`govuk-form-group${props.errorMessage ? " govuk-form-group--error" : ""}`);
  }, [props.errorMessage, wrapperClass]);

  return (
    <div id={props.id} className={wrapperClass}>
      {/* conditional fieldset as textarea, tables/non-input fields will not require fieldset... unless want to exclude them from this component,
          which also makes sense as they are not technically 'field elements' */}
      {useFieldset ? (
        <fieldset
          className="govuk-fieldset"
          aria-describedby={
            props.hint
              ? `${props.id}-hint`
              : props.heading && props.label
                ? `${props.id}-label`
                : undefined
          }
        >
          <legend className="govuk-fieldset__legend">
            {props.heading ? (
              <Heading
                title={props.heading}
                level={headingLevel}
                size={headingSize}
                style={props.headingStyle}
              />
            ) : (
              props.label
            )}
          </legend>
          {props.heading && props.label && (
            <div className="govuk-label" id={`${props.id}-label`} style={props.labelStyle}>
              {props.label}
            </div>
          )}
          {props.hint && (
            <div className="govuk-hint" id={`${props.id}-hint`}>
              {props.hint}
            </div>
          )}
          {errorText && (
            <p className="govuk-error-message">
              <span className="govuk-visually-hidden">Error:</span> {errorText}
            </p>
          )}
          {props.children}
        </fieldset>
      ) : (
        <>
          {errorText && (
            <p className="govuk-error-message">
              <span className="govuk-visually-hidden">Error:</span> {props.errorMessage}
            </p>
          )}
          {props.children}
        </>
      )}
    </div>
  );
}
