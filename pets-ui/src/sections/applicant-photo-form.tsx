import { useState } from "react";
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
  const { setApplicantPhotoFile } = useApplicantPhoto();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [applicantPhoto, setApplicantPhoto] = useState<File>();
  const [applicantPhotoName, setApplicantPhotoName] = useState<string>();

  const methods = useForm<ReduxApplicantDetailsType>({
    reValidateMode: "onSubmit",
    criteriaMode: "all",
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const errorsToShow = Object.keys(errors);

  const onSubmit: SubmitHandler<ReduxApplicantDetailsType> = () => {
    // save only file name in redux
    if (applicantPhoto && applicantPhotoName) {
      dispatch(setApplicantPhotoFileName(applicantPhotoName));
      setApplicantPhotoFile(applicantPhoto);
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
                setFileState={setApplicantPhoto}
                setFileName={setApplicantPhotoName}
                existingFileName={applicantData.applicantPhotoFileName}
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
