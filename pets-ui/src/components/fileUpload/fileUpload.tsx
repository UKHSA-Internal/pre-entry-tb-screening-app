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
  setFileState?: Dispatch<SetStateAction<string | null>>;
  setFileName?: Dispatch<SetStateAction<string>>;
  existingFileName?: string;
}

export default function FileUpload(props: Readonly<FileUploadProps>) {
  const { register } = useFormContext();
  const [errorText, setErrorText] = useState("");
  const [wrapperClass, setWrapperClass] = useState("govuk-form-group");
  const [inputClass, setInputClass] = useState(
    props.existingFileName ? "govuk-file-upload hide-text" : "govuk-file-upload",
  );
  const [showExistingFileName, setShowExistingFileName] = useState(
    props.existingFileName && props.existingFileName.length > 0,
  );

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

  const readBlobAsText = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(blob); // Read the blob as text
    });
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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setInputClass("govuk-file-upload");
      setShowExistingFileName(false);
      const fileTypeError = validateFileType(files);
      const fileSizeError = validateFileSize(files);
      if (fileTypeError !== true) {
        // file type doesn't match
        displayError(fileTypeError);
        return;
      } else if (fileSizeError !== true) {
        // file size doesn't match
        displayError(fileSizeError);
        return;
      } else {
        // if everything is ok, don't display errors and callback
        displayError(null);

        // if set state callback is present
        // e.g. if page wants file to be set to a state
        if (props.setFileState && props.setFileName) {
          try {
            const fileBlob = await readBlobAsText(files[0]);
            props.setFileState(fileBlob);
            props.setFileName(files[0].name);
          } catch {
            displayError("There's been an error reading your file, please try a different file");
            props.setFileState(null);
          }
        }
      }
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
              className={inputClass}
              type="file"
              data-testid={props.id}
              accept={props.accept} // The file types accepted
              {...register(props.formValue, {
                required: props.required,
                validate: {
                  fileType: validateFileType,
                  fileSize: validateFileSize,
                },
              })}
              onChange={async (event) => {
                await handleFileChange(event);
              }}
            />
            {showExistingFileName && props.existingFileName}
          </div>
        </div>
      </fieldset>
    </div>
  );
}
