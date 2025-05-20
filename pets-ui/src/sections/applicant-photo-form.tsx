import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { ReduxApplicantDetailsType } from "@/applicant";
import ApplicantDataHeader from "@/components/applicantDataHeader/applicantDataHeader";
import ErrorSummary from "@/components/errorSummary/errorSummary";
import FileUpload from "@/components/fileUpload/fileUpload";
import Heading from "@/components/heading/heading";
import SubmitButton from "@/components/submitButton/submitButton";
import { useApplicantPhoto } from "@/context/applicantPhotoContext";
import { selectApplicant, setApplicantPhotoFileName } from "@/redux/applicantSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ButtonType, ImageType } from "@/utils/enums";

const ApplicantPhotoForm = () => {
  const applicantData = useAppSelector(selectApplicant);
  const { applicantPhotoFile: contextPhotoFile, setApplicantPhotoFile: setContextPhotoFile } =
    useApplicantPhoto();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [localFileName, setLocalFileName] = useState<string | undefined>(() => {
    if (contextPhotoFile) return contextPhotoFile.name;
    if (applicantData.applicantPhotoFileName) return applicantData.applicantPhotoFileName;
    return undefined;
  });

  const [localFile, setLocalFile] = useState<File | undefined>(() => {
    if (contextPhotoFile && (contextPhotoFile.name === localFileName || !localFileName)) {
      return contextPhotoFile;
    }
    return undefined;
  });

  useEffect(() => {
    let currentName: string | undefined = undefined;
    let currentFile: File | undefined = undefined;

    if (contextPhotoFile) {
      currentName = contextPhotoFile.name;
      currentFile = contextPhotoFile;
    } else if (applicantData.applicantPhotoFileName) {
      currentName = applicantData.applicantPhotoFileName;
      currentFile = undefined;
    }

    if (currentName !== localFileName) {
      setLocalFileName(currentName);
    }

    if (currentFile !== localFile) {
      setLocalFile(currentFile);
    }
  }, [contextPhotoFile, applicantData.applicantPhotoFileName]);

  useEffect(() => {
    if (localFile) {
      setContextPhotoFile(localFile);
    } else {
      if (contextPhotoFile !== null) {
        setContextPhotoFile(null);
      }
    }
  }, [localFile, setContextPhotoFile, contextPhotoFile]);

  const methods = useForm<ReduxApplicantDetailsType>({
    criteriaMode: "all",
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const errorsToShow = Object.keys(errors);

  const onSubmit: SubmitHandler<ReduxApplicantDetailsType> = () => {
    if (localFile && localFileName) {
      dispatch(setApplicantPhotoFileName(localFileName));
    } else if (!localFile && !localFileName) {
      if (applicantData.applicantPhotoFileName) {
        dispatch(setApplicantPhotoFileName(""));
      }
      if (contextPhotoFile) {
        setContextPhotoFile(null);
      }
    }

    navigate("/applicant-summary");
  };

  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            {!!errorsToShow?.length && <ErrorSummary errorsToShow={errorsToShow} errors={errors} />}
            <Heading level={1} size="l" title="Upload visa applicant photo (optional)" />

            <ApplicantDataHeader applicantData={applicantData} />

            <div style={{ marginTop: 70, marginBottom: 100 }}>
              <p className="govuk-body">
                Select a file to upload. File type must be JPG, JPEG or PNG. Images must be less
                than 10MB.
              </p>

              <FileUpload
                id="applicant-photo"
                formValue="applicantPhotoFileName"
                required={false}
                type={ImageType.Photo}
                setFileState={setLocalFile}
                setFileName={setLocalFileName}
                existingFileName={localFileName}
              />
            </div>

            <SubmitButton id="continue" type={ButtonType.DEFAULT} text="Continue" />
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default ApplicantPhotoForm;
