import { useEffect, useState } from "react";
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
}

export default function FileUpload(props: Readonly<FileUploadProps>) {
  const { register } = useFormContext();
  const [errorText, setErrorText] = useState("");
  const [wrapperClass, setWrapperClass] = useState("govuk-form-group");

  const validateFileType = (files: FileList) => {
    if (props.required) {
      if (files.length === 0) {
        return props.required;
      }

      const acceptedTypes = props.accept?.split(",").map((type) => type.trim()) || [];
      const fileType = files[0].type.split("/")[1];
      if (!acceptedTypes.includes(fileType)) {
        return `File type should be ${acceptedTypes.join(", ")}`;
      }
    }

    return true;
  };

  const validateFileSize = (files: FileList) => {
    if (props.required && props.maxSize && files[0]?.size > props.maxSize * 1024 * 1024) {
      return `File size should be less than ${props.maxSize} MB`;
    }
    return true;
  };

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
              accept={props.accept} // Set the accept attribute
              {...register(props.formValue, {
                required: props.required,
                validate: {
                  fileType: validateFileType,
                  fileSize: validateFileSize,
                },
              })}
            />
          </div>
        </div>
      </fieldset>
    </div>
  );
}
