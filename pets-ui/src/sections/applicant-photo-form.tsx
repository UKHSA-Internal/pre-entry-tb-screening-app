import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router";

import ErrorSummary from "@/components/errorSummary/errorSummary";
import FileUpload from "@/components/fileUpload/fileUpload";
import Heading from "@/components/heading/heading";
import LinkLabel from "@/components/linkLabel/LinkLabel";
import List from "@/components/list/list";
import SubmitButton from "@/components/submitButton/submitButton";
import { useApplicantPhoto } from "@/context/applicantPhotoContext";
import { useAppSelector } from "@/redux/hooks";
import { selectApplicant } from "@/redux/store";
import { ReduxApplicantDetailsType } from "@/types";
import { ApplicationStatus, ButtonClass, ImageType } from "@/utils/enums";

const ApplicantPhotoForm = () => {
  const applicantData = useAppSelector(selectApplicant);
  const { applicantPhotoFile } = useApplicantPhoto();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [applicantPhoto, setApplicantPhoto] = useState<File>();
  const [applicantPhotoName, setApplicantPhotoName] = useState<string>();

  const methods = useForm<ReduxApplicantDetailsType>({
    criteriaMode: "all",
    reValidateMode: "onSubmit",
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const errorsToShow = Object.keys(errors);

  const onSubmit: SubmitHandler<ReduxApplicantDetailsType> = () => {
    if (applicantPhoto && applicantPhotoName) {
      navigate("/check-visa-applicant-photo", { state: { applicantPhoto } });
      return;
    }

    const fromParam = searchParams.get("from");
    let destination: string;

    if (applicantData.status === ApplicationStatus.COMPLETE) {
      if (fromParam === "tb-certificate-summary") {
        destination = "/tb-certificate-summary";
      } else if (fromParam === "check-visa-applicant-details") {
        destination = "/check-visa-applicant-details";
      } else {
        destination = "/check-visa-applicant-details";
      }
    } else {
      destination = "/check-visa-applicant-details";
    }

    navigate(destination);
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

            <p className="govuk-heading-m">The photo must:</p>
            <List
              items={[
                { key: "be a JPG, JPEG or PNG file", elem: "be a JPG, JPEG or PNG file" },
                { key: "be less than 10MB", elem: "be less than 10MB" },
                {
                  key: "be the correct way up - open it on your computer to check",
                  elem: "be the correct way up - open it on your computer to check",
                },
                {
                  key: "meet the rules for a passport digital photo",
                  elem: (
                    <>
                      meet the{" "}
                      <LinkLabel
                        title="rules for a passport digital photo (opens in new tab)"
                        to="https://www.gov.uk/photos-for-passports#rules-for-digital-photos"
                        externalLink
                        openInNewTab
                      />
                    </>
                  ),
                },
              ]}
            />

            <FileUpload
              id="applicant-photo"
              formValue="applicantPhotoFileName"
              required={false}
              type={ImageType.Photo}
              setFileState={setApplicantPhoto}
              setFileName={setApplicantPhotoName}
              existingFileName={applicantPhotoFile?.name ?? applicantData.applicantPhotoFileName}
            />

            <SubmitButton id="continue" class={ButtonClass.DEFAULT} text="Continue" />
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default ApplicantPhotoForm;
