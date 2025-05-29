import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { ApplicantSearchFormType } from "@/applicant";
import Dropdown from "@/components/dropdown/dropdown";
import ErrorSummary from "@/components/errorSummary/errorSummary";
import FreeText from "@/components/freeText/freeText";
import Heading from "@/components/heading/heading";
import Spinner from "@/components/spinner/spinner";
import SubmitButton from "@/components/submitButton/submitButton";
import { useApplicantPhoto } from "@/context/applicantPhotoContext";
import {
  clearApplicantDetails,
  setApplicantDetailsFromApiResponse,
  setApplicantPassportDetails,
  setApplicantPhotoFileName,
} from "@/redux/applicantSlice";
import { clearApplicationDetails, setApplicationId } from "@/redux/applicationSlice";
import { clearChestXrayDetails, setChestXrayFromApiResponse } from "@/redux/chestXraySlice";
import { useAppDispatch } from "@/redux/hooks";
import {
  clearMedicalScreeningDetails,
  setMedicalScreeningDetailsFromApiResponse,
} from "@/redux/medicalScreeningSlice";
import {
  clearTbCertificateDetails,
  setTbCertificateFromApiResponse,
} from "@/redux/tbCertificateSlice";
import { clearTravelDetails, setTravelDetailsFromApiResponse } from "@/redux/travelSlice";
import { ButtonType } from "@/utils/enums";
import { countryList, formRegex } from "@/utils/records";

import { getApplicants, getApplication } from "../api/api";

const ApplicantSearchForm = () => {
  const navigate = useNavigate();
  const methods = useForm<ApplicantSearchFormType>({ reValidateMode: "onSubmit" });
  const dispatch = useAppDispatch();
  const { setApplicantPhotoFile } = useApplicantPhoto();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(clearApplicantDetails());
    dispatch(clearApplicationDetails());
    dispatch(clearMedicalScreeningDetails());
    dispatch(clearTravelDetails());
    dispatch(clearChestXrayDetails());
    dispatch(clearTbCertificateDetails());
    dispatch(setApplicantPhotoFileName(""));
    setApplicantPhotoFile(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const errorsToShow = Object.keys(errors);

  const onSubmit: SubmitHandler<ApplicantSearchFormType> = async (passportDetails) => {
    setIsLoading(true);
    try {
      dispatch(setApplicantPassportDetails(passportDetails));
      setApplicantPhotoFile(null);

      const applicantRes = await getApplicants(passportDetails);
      if (applicantRes.data.length === 0) {
        navigate("/applicant-results");
        setIsLoading(false);
        return;
      }
      dispatch(setApplicantDetailsFromApiResponse(applicantRes.data[0]));
      dispatch(setApplicationId(applicantRes.data[0].applicationId));

      const applicationRes = await getApplication(applicantRes.data);
      if (applicationRes.data.applicantPhotoUrl) {
        try {
          const fixedUrl = applicationRes.data.applicantPhotoUrl.replace(
            /172\.\d+\.\d+\.\d+:4566/,
            "localhost:4566",
          );
          const response = await fetch(fixedUrl);
          const blob = await response.blob();
          const urlParts = applicationRes.data.applicantPhotoUrl.split("/");
          const filename = urlParts.pop()?.split("?")[0] || "applicant-photo.jpg";
          const photoFile = new File([blob], filename, { type: blob.type });
          setApplicantPhotoFile(photoFile);
          dispatch(setApplicantPhotoFileName(filename));
        } catch (photoError) {
          console.error("Error fetching or processing applicant photo:", photoError);
        }
      }

      if (applicationRes.data.travelInformation) {
        dispatch(setTravelDetailsFromApiResponse(applicationRes.data.travelInformation));
      }
      if (applicationRes.data.medicalScreening) {
        dispatch(setMedicalScreeningDetailsFromApiResponse(applicationRes.data.medicalScreening));
      }
      if (applicationRes.data.chestXray) {
        dispatch(setChestXrayFromApiResponse(applicationRes.data.chestXray));
      }
      if (applicationRes.data.tbCertificate) {
        dispatch(setTbCertificateFromApiResponse(applicationRes.data.tbCertificate));
      }
      navigate("/tracker");
    } catch (error) {
      console.error(error);
      navigate("/error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading && <Spinner />}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {!!errorsToShow?.length && <ErrorSummary errorsToShow={errorsToShow} errors={errors} />}

          <Heading level={1} size="l" title="Search for a visa applicant" />
          <p className="govuk-body" style={{ fontWeight: "bold" }}>
            Enter the applicant&apos;s passport number and the passport&apos;s country of issue.
          </p>

          <FreeText
            id="passport-number"
            label="Applicant's passport number"
            errorMessage={errors?.passportNumber?.message ?? ""}
            formValue="passportNumber"
            required="Enter the applicant's passport number"
            patternValue={formRegex.lettersAndNumbers}
            patternError="Passport number must contain only letters and numbers"
          />

          <Dropdown
            id="country-of-issue"
            label="Country of issue"
            hint="If you have more than one, use the nationality in the primary passport submitted by the applicant. Use the English spelling or the country code."
            options={countryList}
            errorMessage={errors?.countryOfIssue?.message ?? ""}
            formValue="countryOfIssue"
            required="Select the country of issue"
          />

          <SubmitButton id="search" type={ButtonType.DEFAULT} text="Search" />
        </form>
      </FormProvider>
    </div>
  );
};

export default ApplicantSearchForm;
