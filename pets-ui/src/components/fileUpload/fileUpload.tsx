import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { ImageType } from "@/utils/enums";
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
  type: ImageType;
  setFileState: Dispatch<SetStateAction<File | undefined>>;
  setFileName: Dispatch<SetStateAction<string | undefined>>;
  existingFileName?: string;
}

export default function FileUpload(props: Readonly<FileUploadProps>) {
  const { register, clearErrors } = useFormContext();
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.setFileState(undefined);
    props.setFileName(undefined);

    if (e.target.files) {
      const files = e.target.files;
      setShowExistingFileName(false);

      props.setFileState(files[0]);
      props.setFileName(files[0].name);
      clearErrors(props.formValue);
      displayError(null);
    }
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
                  validate: async (files: File[]) => {
                    if (files.length) {
                      const validationResult = await validateFiles(files, props.type);
                      if (validationResult !== true) {
                        // Show only the first error
                        const message = validationResult[0];
                        displayError(message);
                        return message;
                      }
                    }
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
