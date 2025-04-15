import "./fileUpload.scss";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

export interface FileUploadProps {
  id: string;
  legend?: string;
  hint?: string;
  errorMessage: string;
  formValue: string;
  required: string | false;
  heading?: string;
  accept?: string; // Add accept prop for file types
  maxSize?: number; // Size in MB
  setFileState: Dispatch<SetStateAction<File | undefined>>;
  setFileName: Dispatch<SetStateAction<string | undefined>>;
  existingFileName?: string;
}

export default function FileUpload(props: Readonly<FileUploadProps>) {
  const { register } = useFormContext();
  const [errorText, setErrorText] = useState("");
  const [wrapperClass, setWrapperClass] = useState("govuk-form-group");
  const [showExistingFileName, setShowExistingFileName] = useState(
    props.existingFileName && props.existingFileName.length > 0,
  );
  const inputClass = showExistingFileName ? "govuk-file-upload hide-text" : "govuk-file-upload";

  const validateFileSize = (files: FileList) => {
    if (props.maxSize && files[0]?.size > props.maxSize * 1024 * 1024) {
      return `File size should be less than ${props.maxSize} MB`;
    }
    return true;
  };

  const displayError = (errorText: string | null) => {
    if (errorText) {
      setErrorText(errorText);
      setWrapperClass("govuk-form-group govuk-form-group--error");
    } else {
      setErrorText("");
      setWrapperClass("");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setFileState(undefined);
    props.setFileName(undefined);

    const files = event.target.files;

    if (!files?.length) {
      if (props.required) displayError(props.required);
      return;
    }

    setShowExistingFileName(false);

    const fileSizeError = validateFileSize(files);

    if (fileSizeError !== true) {
      // file size doesn't match
      displayError(fileSizeError);
      return;
    }

    // if everything is ok, don't display errors and callback
    displayError(null);

    props.setFileState(files[0]);
    props.setFileName(files[0].name);
  };

  useEffect(() => {
    displayError(props.errorMessage);
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
                accept={props.accept} // The file types accepted
                {...register(props.formValue, {
                  required: props.required,
                  validate: {
                    fileSize: validateFileSize,
                  },
                })}
                onChange={(event) => handleFileChange(event)}
              />
              {showExistingFileName && props.existingFileName}
            </div>
          </div>
        </fieldset>
      </div>
    </>
  );
}
