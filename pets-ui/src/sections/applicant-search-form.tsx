import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { validate as uuidValidate } from "uuid";

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
import { clearApplicationDetails } from "@/redux/applicationSlice";
import {
  clearApplicationsListDetails,
  setApplicationsListDetailsFromApiResponse,
} from "@/redux/applicationsListSlice";
import { clearChestXrayDetails } from "@/redux/chestXraySlice";
import { useAppDispatch } from "@/redux/hooks";
import { clearMedicalScreeningDetails } from "@/redux/medicalScreeningSlice";
import { clearRadiologicalOutcomeDetails } from "@/redux/radiologicalOutcomeSlice";
import { clearSputumDecision } from "@/redux/sputumDecisionSlice";
import { clearSputumDetails } from "@/redux/sputumSlice";
import { clearTbCertificateDetails } from "@/redux/tbCertificateSlice";
import { clearTravelDetails } from "@/redux/travelSlice";
import { ApplicantSearchFormType, ReceivedApplicantDetailsType } from "@/types";
import { fetchClinic } from "@/utils/clinic";
import { countryList } from "@/utils/countryList";
import { ButtonClass } from "@/utils/enums";
import { setGoogleAnalyticsParams } from "@/utils/google-analytics-utils";
import { formRegex } from "@/utils/records";
import { getUserProperties } from "@/utils/userProperties";

import { getApplicants } from "../api/api";

const ApplicantSearchForm = () => {
  const navigate = useNavigate();
  const methods = useForm<ApplicantSearchFormType>({ reValidateMode: "onSubmit" });
  const dispatch = useAppDispatch();
  const { setApplicantPhotoUrl } = useApplicantPhoto();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(clearApplicantDetails());
    dispatch(clearApplicationDetails());
    dispatch(clearApplicationsListDetails());
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

  const onSubmit: SubmitHandler<ApplicantSearchFormType> = async (passportDetails) => {
    setIsLoading(true);
    dispatch(setApplicantPassportDetails(passportDetails));
    setApplicantPhotoUrl(null);

    let applicantRes: AxiosResponse<ReceivedApplicantDetailsType> | null = null;
    try {
      applicantRes = await getApplicants(passportDetails);
      for (const application of applicantRes.data.applications) {
        const applicationId = application.applicationId;
        if (!uuidValidate(application.applicationId)) {
          throw new Error(`Application ID (${applicationId}) is in an invalid UUID format`);
        }
      }
      dispatch(setApplicantDetailsFromApiResponse(applicantRes.data));
      dispatch(setApplicationsListDetailsFromApiResponse(applicantRes.data.applications));
      navigate("/screening-history");
    } catch (error) {
      if (axios.isAxiosError(error) && error.status == 404) {
        await fetchClinic(dispatch);
        navigate("/no-visa-applicant-found");
        return;
      } else {
        console.error(error);
        navigate("/sorry-there-is-problem-with-service");
        return;
      }
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
            heading="Visa applicant's passport number"
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
