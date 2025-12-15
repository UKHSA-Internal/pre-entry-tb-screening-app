import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";

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
  clearRadiologicalOutcomeDetails,
  setRadiologicalOutcomeFromApiResponse,
} from "@/redux/radiologicalOutcomeSlice";
import {
  clearSputumDecision,
  setSputumDecisionRequired,
  setSputumDecisionStatus,
} from "@/redux/sputumDecisionSlice";
import {
  clearSputumDetails,
  setSputumDetailsFromApiResponse,
  setSputumStatus,
} from "@/redux/sputumSlice";
import {
  clearTbCertificateDetails,
  setTbCertificateFromApiResponse,
} from "@/redux/tbCertificateSlice";
import { clearTravelDetails, setTravelDetailsFromApiResponse } from "@/redux/travelSlice";
import { ApplicantSearchFormType } from "@/types";
import { fetchClinic } from "@/utils/clinic";
import { ApplicationStatus, ButtonClass, YesOrNo } from "@/utils/enums";
import { setGoogleAnalyticsParams } from "@/utils/google-analytics-utils";
import { countryList, formRegex } from "@/utils/records";
import { getUserProperties } from "@/utils/userProperties";

import { getApplicants, getApplication } from "../api/api";

const ApplicantSearchForm = () => {
  const navigate = useNavigate();
  const methods = useForm<ApplicantSearchFormType>({ reValidateMode: "onSubmit" });
  const dispatch = useAppDispatch();
  const { setApplicantPhotoUrl, setApplicantPhotoFile } = useApplicantPhoto();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(clearApplicantDetails());
    dispatch(clearApplicationDetails());
    dispatch(clearMedicalScreeningDetails());
    dispatch(clearTravelDetails());
    dispatch(clearChestXrayDetails());
    dispatch(clearRadiologicalOutcomeDetails());
    dispatch(clearSputumDetails());
    dispatch(clearSputumDecision());
    dispatch(clearTbCertificateDetails());
    dispatch(setApplicantPhotoFileName(""));
    setApplicantPhotoUrl(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const setUserProperties = async () => {
      const userProperties = await getUserProperties();
      setGoogleAnalyticsParams("user_properties", {
        user_role: userProperties.jobTitle,
        clinic_id: userProperties.clinicId,
      });
    };
    void setUserProperties();
  }, []);

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const errorsToShow = Object.keys(errors);

  const handleApplicantPhoto = async (photoUrl: string) => {
    const env = import.meta.env.VITE_ENVIRONMENT as string | undefined;
    const fixedUrl =
      env === "local" ? photoUrl.replace(/172\.\d+\.\d+\.\d+:4566/, "localhost:4566") : photoUrl;

    const urlParts = photoUrl.split("/");
    const filename = urlParts.pop()?.split("?")[0] ?? "applicant-photo.jpg";
    dispatch(setApplicantPhotoFileName(filename));
    const response = await fetch(fixedUrl);
    const blob = await response.blob();
    if (typeof File !== "undefined") {
      try {
        const file = new File([blob], filename, { type: blob.type });
        setApplicantPhotoFile(file);
      } catch {
        setApplicantPhotoUrl(fixedUrl);
      }
    } else {
      setApplicantPhotoUrl(fixedUrl);
    }
  };

  const onSubmit: SubmitHandler<ApplicantSearchFormType> = async (passportDetails) => {
    setIsLoading(true);
    try {
      await fetchClinic(dispatch);
      dispatch(setApplicantPassportDetails(passportDetails));
      setApplicantPhotoUrl(null);

      const applicantRes = await getApplicants(passportDetails);
      if (applicantRes.data.length === 0) {
        navigate("/no-matching-record-found");
        return;
      }
      dispatch(setApplicantDetailsFromApiResponse(applicantRes.data[0]));
      dispatch(setApplicationId(applicantRes.data[0].applicationId));

      const applicationRes = await getApplication(applicantRes.data);
      if (applicationRes.data.applicantPhotoUrl) {
        await handleApplicantPhoto(applicationRes.data.applicantPhotoUrl);
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
      if (applicationRes.data.radiologicalOutcome) {
        dispatch(setRadiologicalOutcomeFromApiResponse(applicationRes.data.radiologicalOutcome));
      }
      if (applicationRes.data.sputumRequirement) {
        dispatch(setSputumDecisionRequired(applicationRes.data.sputumRequirement.sputumRequired));
        dispatch(setSputumDecisionStatus(ApplicationStatus.COMPLETE));
        if (applicationRes.data.sputumRequirement.sputumRequired === YesOrNo.NO) {
          dispatch(setSputumStatus(ApplicationStatus.NOT_REQUIRED));
        }
      }
      if (
        applicationRes.data.sputumDetails &&
        applicationRes.data.sputumRequirement?.sputumRequired !== YesOrNo.NO
      ) {
        dispatch(setSputumDetailsFromApiResponse(applicationRes.data.sputumDetails));
      }
      if (applicationRes.data.tbCertificate) {
        dispatch(setTbCertificateFromApiResponse(applicationRes.data.tbCertificate));
      }
      navigate("/tracker");
    } catch (error) {
      console.error(error);
      navigate("/sorry-there-is-problem-with-service");
    }
  };

  return (
    <div>
      {isLoading && <Spinner />}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {!!errorsToShow?.length && <ErrorSummary errorsToShow={errorsToShow} errors={errors} />}

          <Heading level={1} size="l" title="Search for a visa applicant" />

          <FreeText
            id="passport-number"
            heading="Visa applicant’s passport number"
            headingSize="m"
            hint="For example, 1208297A"
            errorMessage={errors?.passportNumber?.message ?? ""}
            formValue="passportNumber"
            required="Enter the applicant's passport number"
            patternValue={formRegex.lettersAndNumbers}
            patternError="Passport number must contain only letters and numbers"
          />

          <Dropdown
            id="country-of-issue"
            heading="Country of issue"
            headingSize="m"
            hint="As shown on passport, at the top of the first page"
            options={countryList}
            errorMessage={errors?.countryOfIssue?.message ?? ""}
            formValue="countryOfIssue"
            required="Select the country of issue"
          />

          <SubmitButton id="search" class={ButtonClass.DEFAULT} text="Search" />
        </form>
      </FormProvider>
    </div>
  );
};

export default ApplicantSearchForm;
