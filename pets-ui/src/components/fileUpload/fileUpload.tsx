import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

export interface FileUploadProps {
  id: string;
  legend?: string;
  hint?: string;
  errorMessage: string;
  formValue: string;
  required: string | false;
}

export default function FileUpload(props: Readonly<FileUploadProps>) {
  const { register } = useFormContext();
  const [errorText, setErrorText] = useState("");
  const [wrapperClass, setWrapperClass] = useState("govuk-form-group");

  useEffect(() => {
    setErrorText(props.errorMessage);
    setWrapperClass("govuk-form-group " + `${props.errorMessage && "govuk-form-group--error"}`);
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
        <div data-module="govuk-file-upload">
          <div key={`file-upload-${props.id}`}>
            <input
              id="fileInput"
              className="govuk-file-upload"
              type="file"
              {...register(props.formValue, {
                required: props.required,
                validate: (files) => {
                  if (files.length === 0) {
                    return props.required;
                  }
                  return true;
                },
              })}
            />
          </div>
        </div>
      </fieldset>
    </div>
  );
}
