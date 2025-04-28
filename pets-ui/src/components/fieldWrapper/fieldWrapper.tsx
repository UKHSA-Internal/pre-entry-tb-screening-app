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
  // useFieldset defaults to true. Set to false when wrapping a field that does not require being wrapped in <fieldset>
  useFieldset?: boolean;
  errorMessage: string;
  divStyle?: React.CSSProperties;
}

export default function FieldWrapper({
  headingLevel = 2,
  headingSize = "m",
  useFieldset = true,
  labelStyle = { marginBottom: 10 },
  ...props
}: Readonly<FieldWrapperProps>) {
  const [errorText, setErrorText] = useState("");
  const [wrapperClass, setWrapperClass] = useState("govuk-form-group");
  let describedBy: string | undefined;

  if (props.hint) {
    describedBy = `${props.id}-hint`;
  } else if (props.heading && props.label) {
    describedBy = `${props.id}-label`;
  } else {
    describedBy = undefined;
  }

  useEffect(() => {
    setErrorText(props.errorMessage);
    setWrapperClass(`govuk-form-group${props.errorMessage ? " govuk-form-group--error" : ""}`);
  }, [props.errorMessage]);

  return (
    <div
      id={useFieldset ? props.id : `${props.id}-container`}
      className={wrapperClass}
      style={props.divStyle}
    >
      {useFieldset ? (
        <fieldset className="govuk-fieldset" aria-describedby={describedBy}>
          <legend className="govuk-fieldset__legend">
            {props.heading ? (
              <Heading
                title={props.heading}
                level={headingLevel}
                size={headingSize}
                style={{ marginBottom: 10, ...props.headingStyle }}
              />
            ) : (
              props.label
            )}
          </legend>
          {props.heading && props.label && (
            <label className="govuk-label" id={`${props.id}-label`} style={labelStyle}>
              {props.label}
            </label>
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
          {props.heading ? (
            <Heading
              title={props.heading}
              level={headingLevel}
              size={headingSize}
              style={{ marginBottom: 10, ...props.headingStyle }}
              id={props.label ? `${props.id}-heading` : props.id}
            />
          ) : (
            <label
              className="govuk-label"
              htmlFor={props.heading ? `${props.id}-label` : props.id}
              style={labelStyle}
            >
              {props.label}
            </label>
          )}
          {props.heading && props.label && (
            <label className="govuk-label" id={`${props.id}-label`} style={labelStyle}>
              {props.label}
            </label>
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
        </>
      )}
    </div>
  );
}
