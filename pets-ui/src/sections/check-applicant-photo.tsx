import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";

import ErrorSummary from "@/components/errorSummary/errorSummary";
import Heading from "@/components/heading/heading";
import LinkLabel from "@/components/linkLabel/LinkLabel";
import Radio from "@/components/radio/radio";
import Spinner from "@/components/spinner/spinner";
import SubmitButton from "@/components/submitButton/submitButton";
import { useApplicantPhoto } from "@/context/applicantPhotoContext";
import { setApplicantPhotoFileName } from "@/redux/applicantSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectApplicant, selectApplication } from "@/redux/store";
import { ApplicationStatus, ButtonClass, ImageType, RadioIsInline } from "@/utils/enums";
import uploadFile from "@/utils/uploadFile";

type CheckApplicantPhotoFormType = {
  confirmPhoto: string;
};

const CheckApplicantPhoto = () => {
  const { setApplicantPhotoFile } = useApplicantPhoto();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const applicantData = useAppSelector(selectApplicant);
  const applicationData = useAppSelector(selectApplication);
  const [isLoading, setIsLoading] = useState(false);
  const [candidatePhotoDataUrl, setCandidatePhotoDataUrl] = useState<string | null>(null);

  const candidatePhoto = (location.state as { applicantPhoto?: File } | null)?.applicantPhoto;

  const methods = useForm<CheckApplicantPhotoFormType>({
    reValidateMode: "onSubmit",
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const errorsToShow = Object.keys(errors);

  useEffect(() => {
    if (!candidatePhoto) {
      navigate("/upload-visa-applicant-photo");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setCandidatePhotoDataUrl(reader.result as string);
    reader.readAsDataURL(candidatePhoto);
  }, [candidatePhoto, navigate]);

  const onSubmit: SubmitHandler<CheckApplicantPhotoFormType> = async (data) => {
    if (data.confirmPhoto === "Yes, add this photo") {
      if (candidatePhoto) {
        // save only file name in redux
        dispatch(setApplicantPhotoFileName(candidatePhoto.name));
        setApplicantPhotoFile(candidatePhoto);

        if (applicantData.status === ApplicationStatus.COMPLETE) {
          setIsLoading(true);
          try {
            const fileType = candidatePhoto.name.split(".").pop();
            await uploadFile(
              candidatePhoto,
              `applicant-photo.${fileType}`,
              applicationData.applicationId,
              ImageType.Photo,
            );
          } catch (error) {
            console.error(error);
            navigate("/sorry-there-is-problem-with-service");
            return;
          }
          setIsLoading(false);
        }
      }
      navigate("/check-visa-applicant-details");
    } else {
      navigate("/upload-visa-applicant-photo");
    }
  };

  if (!candidatePhoto) return null;

  return (
    <div>
      {isLoading && <Spinner />}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {!!errorsToShow?.length && <ErrorSummary errorsToShow={errorsToShow} errors={errors} />}
          <Heading level={1} size="l" title="Check visa applicant photo" />

          <div className="govuk-grid-row">
            <div className="govuk-grid-column-one-half">
              {candidatePhotoDataUrl && (
                <img
                  src={candidatePhotoDataUrl}
                  alt="Applicant photo preview"
                  style={{ maxWidth: "100%", maxHeight: "400px" }}
                />
              )}
              <p className="govuk-body">
                {candidatePhoto.name}, {(candidatePhoto.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>

          <Radio
            id="confirm-photo"
            isInline={RadioIsInline.FALSE}
            answerOptions={["Yes, add this photo", "No, choose a different photo"]}
            sortAnswersAlphabetically={false}
            errorMessage={(errors?.confirmPhoto?.message as string) ?? ""}
            formValue="confirmPhoto"
            required="Select if you want to add this photo"
            divStyle={{ marginTop: 40 }}
          />

          <p className="govuk-body">
            Check the &nbsp;
            <LinkLabel
              title="rules for digital photos (opens in new tab)"
              to="https://www.gov.uk/photos-for-passports#rules-for-digital-photos"
              externalLink
              openInNewTab
            />
          </p>

          <SubmitButton id="continue" class={ButtonClass.DEFAULT} text="Continue" />
        </form>
      </FormProvider>
    </div>
  );
};

export default CheckApplicantPhoto;
