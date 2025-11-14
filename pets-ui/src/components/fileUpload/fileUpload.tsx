import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useFormContext, useFormState } from "react-hook-form";

import Button from "@/components/button/button";
import { ButtonClass, ImageType } from "@/utils/enums";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { register, clearErrors } = useFormContext();
  const { errors, isSubmitted } = useFormState();

  const [errorText, setErrorText] = useState("");
  const [wrapperClass, setWrapperClass] = useState("govuk-form-group");
  const [showExistingFileName, setShowExistingFileName] = useState(
    props.existingFileName && props.existingFileName.length > 0,
  );
  const [lastFile, setLastFile] = useState<File | undefined>(undefined);

  const inputClass = "govuk-file-upload govuk-visually-hidden";
  const displayError = (errorText: string | null) => {
    if (errorText) {
      setErrorText(errorText);
      setWrapperClass("govuk-form-group govuk-form-group--error");
    } else {
      setErrorText("");
      setWrapperClass("govuk-form-group");
    }
  };

  const preventDragDefaults = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const processFiles = (files: File[]) => {
    if (!files || files.length === 0) return;
    setShowExistingFileName(false);
    props.setFileState(files[0]);
    props.setFileName(files[0].name);
    setLastFile(files[0]);
    clearErrors(props.formValue);
    displayError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    processFiles(files);
  };

  useEffect(() => {
    const fieldError = errors[props.formValue];
    if (fieldError) {
      if (fieldError.type === "required" && props.required) {
        displayError(props.required);
      } else if (fieldError.message) {
        displayError(fieldError.message as string);
      }
    } else {
      displayError(null);
    }
  }, [errors, props.formValue, props.required, isSubmitted]);

  const handleDrop = (e: React.DragEvent) => {
    preventDragDefaults(e);
    const files = e.dataTransfer.files ? Array.from(e.dataTransfer.files) : [];
    processFiles(files);

    if (files.length > 0 && fileInputRef.current && typeof rhfOnChange === "function") {
      if (typeof DataTransfer === "undefined") {
        const syntheticEvent = {
          target: {
            files: files,
          },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        void rhfOnChange(syntheticEvent);
      } else {
        const dt = new DataTransfer();
        for (const file of files) {
          dt.items.add(file);
        }
        fileInputRef.current.files = dt.files;

        const syntheticEvent = {
          target: fileInputRef.current,
        } as React.ChangeEvent<HTMLInputElement>;
        void rhfOnChange(syntheticEvent);
      }
    }
  };

  const filesFromValue = (value: FileList | File[] | undefined | null): File[] =>
    Array.isArray(value) ? value : Array.from(value || []);

  const validateSelection = async (value: FileList | File[]) => {
    const files = filesFromValue(value);
    const filesToValidate = files.length === 0 && lastFile ? [lastFile] : files;
    if (filesToValidate.length) {
      const validationResult = await validateFiles(filesToValidate, props.type);
      if (validationResult !== true) {
        const message = validationResult[0];
        setTimeout(() => displayError(message), 0);
        return message;
      }
      setTimeout(() => displayError(null), 0);
      return true;
    }
    return true;
  };

  const {
    ref: rhfRef,
    onBlur,
    onChange: rhfOnChange,
    name,
    ...restInputProps
  } = register(props.formValue, {
    required: showExistingFileName ? false : props.required,
    validate: validateSelection,
  });

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    // Checks if user cancels file picker and if there is existing file that can be put back
    if (files.length === 0 && (lastFile || showExistingFileName)) {
      if (lastFile && fileInputRef.current) {
        const dt = new DataTransfer();
        dt.items.add(lastFile);
        fileInputRef.current.files = dt.files;
      }
      return;
    }
    handleFileChange(e);
    if (typeof rhfOnChange === "function") {
      void rhfOnChange(e);
    }
  };

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
          <div
            data-module="govuk-file-upload"
            className="govuk-body file-upload-existing-file"
            role="application"
            aria-label="File drop zone"
            onDrop={handleDrop}
            onDragOver={preventDragDefaults}
            onDragEnter={preventDragDefaults}
            onDragLeave={preventDragDefaults}
          >
            <div className="file-upload-blue-bar">
              {showExistingFileName ? props.existingFileName : lastFile?.name}
              {!showExistingFileName && !lastFile && (
                <span className="file-upload-no-file">No file chosen</span>
              )}
            </div>
            <div className="file-upload-row">
              <Button
                id={`choose-file-${props.id}`}
                class={ButtonClass.SECONDARY}
                text="Choose file"
                handleClick={(e) => {
                  e.preventDefault();
                  if (fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}
              />
              <span className="file-upload-or-drop">or drop file</span>
            </div>
            <input
              ref={(el) => {
                fileInputRef.current = el;
                if (typeof rhfRef === "function") rhfRef(el);
              }}
              id={props.id}
              className={inputClass}
              type="file"
              accept={props.type === ImageType.Dicom ? ".dcm" : ""}
              data-testid={props.id}
              name={name}
              onBlur={onBlur}
              {...restInputProps}
              onChange={onInputChange}
            />
          </div>
        </fieldset>
      </div>
    </>
  );
}
