import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormContext, useFormState } from "react-hook-form";

import { ImageType } from "@/utils/enums";
import validateFiles from "@/utils/validateFiles";

export interface FileUploadProps {
  id: string;
  legend?: string;
  hint?: string;
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
  const { errors, isSubmitted } = useFormState();

  const [errorText, setErrorText] = useState("");
  const [wrapperClass, setWrapperClass] = useState("govuk-form-group");
  const [showExistingFileName, setShowExistingFileName] = useState(
    props.existingFileName && props.existingFileName.length > 0,
  );
  const inputClass = showExistingFileName ? "govuk-file-upload hide-text" : "govuk-file-upload";
  const [lastFile, setLastFile] = useState<File | undefined>(undefined);

  const displayError = (errorText: string | null) => {
    if (errorText) {
      setErrorText(errorText);
      setWrapperClass("govuk-form-group govuk-form-group--error");
    } else {
      setErrorText("");
      setWrapperClass("govuk-form-group");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files && files.length > 0) {
      setShowExistingFileName(false);
      props.setFileState(files[0]);
      props.setFileName(files[0].name);
      setLastFile(files[0]);

      // clear existing error message
      clearErrors(props.formValue);
      displayError(null);
    }
  };

  useEffect(() => {
    const fieldError = errors[props.formValue];
    if (fieldError?.type === "required" && props.required) {
      displayError(props.required);
    }
  }, [errors, props.formValue, props.required, isSubmitted]);

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
          <div data-module="govuk-file-upload" className="govuk-body file-upload-existing-file">
            <div key={props.id}>
              <input
                id={props.id}
                className={inputClass}
                type="file"
                data-testid={props.id}
                {...register(props.formValue, {
                  required: showExistingFileName ? false : props.required,
                  validate: async (files: File[]) => {
                    let filesToValidate: File[] = [];
                    if (files.length > 0) {
                      filesToValidate = files;
                    } else if (lastFile) {
                      filesToValidate = [lastFile];
                    }

                    if (filesToValidate.length) {
                      const validationResult = await validateFiles(filesToValidate, props.type);

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
              {showExistingFileName ? props.existingFileName : lastFile?.name}
            </div>
          </div>
        </fieldset>
      </div>
    </>
  );
}
