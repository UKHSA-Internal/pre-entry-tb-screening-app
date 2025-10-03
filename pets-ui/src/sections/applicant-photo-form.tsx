import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { ReduxApplicantDetailsType } from "@/applicant";
import ErrorSummary from "@/components/errorSummary/errorSummary";
import FileUpload from "@/components/fileUpload/fileUpload";
import Heading from "@/components/heading/heading";
import SubmitButton from "@/components/submitButton/submitButton";
import { useApplicantPhoto } from "@/context/applicantPhotoContext";
import { setApplicantPhotoFileName } from "@/redux/applicantSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectApplicant } from "@/redux/store";
import { ButtonType, ImageType } from "@/utils/enums";

const ApplicantPhotoForm = () => {
  const applicantData = useAppSelector(selectApplicant);
  const { applicantPhotoFile, setApplicantPhotoFile } = useApplicantPhoto();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [applicantPhoto, setApplicantPhoto] = useState<File>();
  const [applicantPhotoName, setApplicantPhotoName] = useState<string>();

  const methods = useForm<ReduxApplicantDetailsType>({
    criteriaMode: "all",
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const errorsToShow = Object.keys(errors);

  const onSubmit: SubmitHandler<ReduxApplicantDetailsType> = () => {
    if (applicantPhoto && applicantPhotoName) {
      // save only file name in redux
      dispatch(setApplicantPhotoFileName(applicantPhotoName));
      setApplicantPhotoFile(applicantPhoto);
    }

    navigate("/check-applicant-details");
  };

  useEffect(() => {
    if (applicantPhotoFile) {
      setApplicantPhoto(applicantPhotoFile);
      setApplicantPhotoName(applicantPhotoFile.name);
    }
  }, [applicantPhotoFile]);

  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            {!!errorsToShow?.length && <ErrorSummary errorsToShow={errorsToShow} errors={errors} />}
            <Heading level={1} size="l" title="Upload visa applicant photo (optional)" />

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
                setFileState={setApplicantPhoto}
                setFileName={setApplicantPhotoName}
                existingFileName={applicantPhotoFile?.name ?? applicantData.applicantPhotoFileName}
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
