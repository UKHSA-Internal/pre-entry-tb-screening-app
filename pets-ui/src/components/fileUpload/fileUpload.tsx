import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { FileType } from "@/utils/enums";
import validateFiles from "@/utils/validateFiles";

export interface FileUploadProps {
  id: string;
  legend?: string;
  hint?: string;
  // errorMessage prop ony required if it is a required field
  errorMessage?: string;
  formValue: string;
  required: string | false;
  heading?: string;
  type: FileType;
  setFileState: Dispatch<SetStateAction<File | undefined>>;
  setFileName: Dispatch<SetStateAction<string | undefined>>;
  existingFileName?: string;
}

export default function FileUpload(props: Readonly<FileUploadProps>) {
  const { register, setError, clearErrors, formState } = useFormContext();
  const [errorText, setErrorText] = useState("");
  const [wrapperClass, setWrapperClass] = useState("govuk-form-group");
  const [showExistingFileName, setShowExistingFileName] = useState(
    props.existingFileName && props.existingFileName.length > 0,
  );
  const inputClass = showExistingFileName ? "govuk-file-upload hide-text" : "govuk-file-upload";

  const displayError = (errorText: string | null) => {
    if (errorText) {
      setErrorText(errorText);
      setWrapperClass("govuk-form-group govuk-form-group--error");
    } else {
      setErrorText("");
      setWrapperClass("");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    props.setFileState(undefined);
    props.setFileName(undefined);
    clearErrors(props.formValue);

    const files = e.target.files ? Array.from(e.target.files) : [];
    const validation = await validateFiles(files, props.type);

    if (validation.errors.length > 0) {
      // Show only the first error
      const message = validation.errors[0].message;
      setError(props.formValue, { type: "validate", message });
      displayError(message);

      return validation.errors;
    }

    // No validation errors
    displayError(null);
    setShowExistingFileName(false);
    props.setFileState(files[0]);
    props.setFileName(files[0].name);
  };

  useEffect(() => {
    displayError(props.errorMessage || "");
  }, [props.errorMessage]);

  return (
    <>
      <label className="govuk-visually-hidden" htmlFor={props.id}>
        {`${props.id} file upload`}
      </label>
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
            <div key={props.id}>
              <input
                id={props.id}
                className={inputClass}
                type="file"
                data-testid={props.id}
                {...register(props.formValue, {
                  required: props.required,
                  validate: {
                    noFileErrors: () => !formState.errors[props.formValue],
                  },
                })}
                onChange={(e) => handleFileChange(e)}
              />
              {showExistingFileName && props.existingFileName}
            </div>
          </div>
        </fieldset>
      </div>
    </>
  );
}
