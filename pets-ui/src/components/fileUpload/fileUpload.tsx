import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

export interface FileUploadProps {
  id: string;
  legend?: string;
  hint?: string;
  errorMessage: string;
  formValue: string;
  required: string | false;
  accept?: string; // Add accept prop for file types
  maxSize?: number; // Size in MB
  setFileState: Dispatch<SetStateAction<File | undefined>>;
  setFileName: Dispatch<SetStateAction<string>>;
}

export default function FileUpload(props: Readonly<FileUploadProps>) {
  const { register } = useFormContext();
  const [errorText, setErrorText] = useState("");
  const [wrapperClass, setWrapperClass] = useState("govuk-form-group");

  const validateFileSize = (files: FileList) => {
    if (props.maxSize && files[0]?.size > props.maxSize * 1024 * 1024) {
      return `File size should be less than ${props.maxSize} MB`;
    }
    return true;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files?.length) {
      props.setFileState(undefined);
      return;
    }

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

  const displayError = (errorText: string | null) => {
    if (errorText) {
      setErrorText(errorText);
      setWrapperClass("govuk-form-group govuk-form-group--error");
    } else {
      setErrorText("");
      setWrapperClass("");
    }
  };

  useEffect(() => {
    displayError(props.errorMessage);
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
          </div>
        </div>
      </fieldset>
    </div>
  );
}
