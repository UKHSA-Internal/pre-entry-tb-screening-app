import "@/components/spinner/spinner.scss";

import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { ApplicantSearchFormType } from "@/applicant";
import Button from "@/components/button/button";
import Dropdown from "@/components/dropdown/dropdown";
import ErrorSummary from "@/components/errorSummary/errorSummary";
import FreeText from "@/components/freeText/freeText";
import Spinner from "@/components/spinner/spinner";
import {
  clearApplicantDetails,
  setApplicantDetailsFromApiResponse,
  setApplicantPassportDetails,
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

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(clearApplicantDetails());
    dispatch(clearApplicationDetails());
    dispatch(clearMedicalScreeningDetails());
    dispatch(clearTravelDetails());
    dispatch(clearChestXrayDetails());
    dispatch(clearTbCertificateDetails());
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

      const applicantRes = await getApplicants(passportDetails);
      if (applicantRes.data.length === 0) {
        navigate("/applicant-results");
        return;
      }
      dispatch(setApplicantDetailsFromApiResponse(applicantRes.data[0]));
      dispatch(setApplicationId(applicantRes.data[0].applicationId));

      const applicationRes = await getApplication(applicantRes.data);
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
    }
  };

  return (
    <div>
      <Spinner isLoading={isLoading} />
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {!!errorsToShow?.length && <ErrorSummary errorsToShow={errorsToShow} errors={errors} />}
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
            required="Select the country of issue."
          />

          <Button
            id="search"
            type={ButtonType.DEFAULT}
            text="Search"
            href="#"
            handleClick={() => {}}
          />
        </form>
      </FormProvider>
    </div>
  );
};

export default ApplicantSearchForm;
