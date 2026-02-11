import { useEffect, useRef, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate, useSearchParams } from "react-router";

import { putApplicantDetails } from "@/api/api";
import Dropdown from "@/components/dropdown/dropdown";
import ErrorSummary from "@/components/errorSummary/errorSummary";
import FreeText from "@/components/freeText/freeText";
import Heading from "@/components/heading/heading";
import Spinner from "@/components/spinner/spinner";
import SubmitButton from "@/components/submitButton/submitButton";
import {
  setApplicantHomeAddress1,
  setApplicantHomeAddress2,
  setApplicantHomeAddress3,
  setCountry,
  setPostcode,
  setProvinceOrState,
  setTownOrCity,
} from "@/redux/applicantSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectApplicant, selectApplication } from "@/redux/store";
import { ReduxApplicantDetailsType } from "@/types";
import { ApplicationStatus, ButtonClass } from "@/utils/enums";
import { sendGoogleAnalyticsFormErrorEvent } from "@/utils/google-analytics-utils";
import { countryList, formRegex } from "@/utils/records";

interface ApplicantContactDetailsData {
  applicantHomeAddress1: string;
  applicantHomeAddress2?: string;
  applicantHomeAddress3?: string;
  townOrCity: string;
  provinceOrState: string;
  postcode?: string;
  country: string;
}

const ApplicantContactDetailsForm = () => {
  const applicantData = useAppSelector(selectApplicant);
  const applicationData = useAppSelector(selectApplication);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const isComplete = applicantData.status === ApplicationStatus.COMPLETE;

  const methods = useForm<ReduxApplicantDetailsType>({ reValidateMode: "onSubmit" });
  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<ApplicantContactDetailsData> = async (formData) => {
    const fromParam = searchParams.get("from");

    dispatch(setApplicantHomeAddress1(formData.applicantHomeAddress1));
    dispatch(setApplicantHomeAddress2(formData.applicantHomeAddress2 ?? ""));
    dispatch(setApplicantHomeAddress3(formData.applicantHomeAddress3 ?? ""));
    dispatch(setTownOrCity(formData.townOrCity));
    dispatch(setProvinceOrState(formData.provinceOrState));
    dispatch(setPostcode(formData.postcode ?? ""));
    dispatch(setCountry(formData.country));

    if (isComplete && applicationData.applicationId) {
      setIsLoading(true);
      try {
        await putApplicantDetails(applicationData.applicationId, {
          applicantHomeAddress1: formData.applicantHomeAddress1,
          applicantHomeAddress2: formData.applicantHomeAddress2,
          applicantHomeAddress3: formData.applicantHomeAddress3,
          townOrCity: formData.townOrCity,
          provinceOrState: formData.provinceOrState,
          postcode: formData.postcode,
          country: formData.country,
        });

        if (fromParam === "tb-certificate-summary") {
          navigate("/tb-certificate-summary");
        } else if (fromParam === "check-visa-applicant-details") {
          navigate("/check-visa-applicant-details");
        } else {
          navigate("/tb-certificate-summary");
        }
      } catch (error) {
        console.error(error);
        navigate("/sorry-there-is-problem-with-service");
      }
    } else {
      navigate("/upload-visa-applicant-photo");
    }
  };

  const errorsToShow = Object.keys(errors);
  useEffect(() => {
    if (errorsToShow.length > 0) {
      sendGoogleAnalyticsFormErrorEvent("Visa applicant contact information", errorsToShow);
    }
  }, [errorsToShow]);

  // Required to scroll to the correct element when a change link on the summary page is clicked
  const addressLine1Ref = useRef<HTMLDivElement | null>(null);
  const addressLine2Ref = useRef<HTMLDivElement | null>(null);
  const addressLine3Ref = useRef<HTMLDivElement | null>(null);
  const townRef = useRef<HTMLDivElement | null>(null);
  const provinceRef = useRef<HTMLDivElement | null>(null);
  const postcodeRef = useRef<HTMLDivElement | null>(null);
  const addressCountryRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (location.hash) {
      const target = location.hash.substring(1);
      const refMap: { [key: string]: HTMLElement | null } = {
        "address-1": addressLine1Ref.current,
        "address-2": addressLine2Ref.current,
        "address-3": addressLine3Ref.current,
        "town-or-city": townRef.current,
        "province-or-state": provinceRef.current,
        postcode: postcodeRef.current,
        "address-country": addressCountryRef.current,
      };

      const targetRef = refMap[target];
      if (targetRef && typeof targetRef.scrollIntoView === "function") {
        targetRef.scrollIntoView();
      }
    }
  }, [location]);

  return (
    <FormProvider {...methods}>
      {isLoading && <Spinner />}

      <form onSubmit={handleSubmit(onSubmit)}>
        {!!errorsToShow?.length && <ErrorSummary errorsToShow={errorsToShow} errors={errors} />}

        <Heading level={1} size="l" title="Visa applicant contact information" />

        <Heading level={2} size="m" title="Home address" style={{ marginBottom: 9 }} />
        <div className="govuk-hint" id={"home-address-hint"}>
          Enter the visa applicant&apos;s address in their home country
        </div>

        <div ref={addressLine1Ref}>
          <FreeText
            id="address-1"
            label="Address line 1"
            errorMessage={errors?.applicantHomeAddress1?.message ?? ""}
            formValue="applicantHomeAddress1"
            required="Enter the first line of the applicant's home address"
            patternValue={formRegex.lettersNumbersSpacesAndPunctuation}
            patternError="Home address must contain only letters, numbers, spaces and punctuation"
            defaultValue={applicantData.applicantHomeAddress1}
          />
        </div>

        <div ref={addressLine2Ref}>
          <FreeText
            id="address-2"
            label="Address line 2 (optional)"
            errorMessage={errors?.applicantHomeAddress2?.message ?? ""}
            formValue="applicantHomeAddress2"
            required={false}
            patternValue={formRegex.lettersNumbersSpacesAndPunctuation}
            patternError="Home address must contain only letters, numbers, spaces and punctuation"
            defaultValue={applicantData.applicantHomeAddress2}
          />
        </div>

        <div ref={addressLine3Ref}>
          <FreeText
            id="address-3"
            label="Address line 3 (optional)"
            errorMessage={errors?.applicantHomeAddress3?.message ?? ""}
            formValue="applicantHomeAddress3"
            required={false}
            patternValue={formRegex.lettersNumbersSpacesAndPunctuation}
            patternError="Home address must contain only letters, numbers, spaces and punctuation"
            defaultValue={applicantData.applicantHomeAddress3}
          />
        </div>

        <div ref={townRef}>
          <FreeText
            id="town-or-city"
            label="Town or city"
            errorMessage={errors?.townOrCity?.message ?? ""}
            formValue="townOrCity"
            required="Enter the town or city of the applicant's home address"
            patternValue={formRegex.lettersSpacesAndPunctuation}
            patternError="Town name must contain only letters, spaces and punctuation"
            defaultValue={applicantData.townOrCity}
          />
        </div>

        <div ref={provinceRef}>
          <FreeText
            id="province-or-state"
            label="Province or state"
            errorMessage={errors?.provinceOrState?.message ?? ""}
            formValue="provinceOrState"
            required="Enter the province or state of the applicant's home address"
            patternValue={formRegex.lettersSpacesAndPunctuation}
            patternError="Province or state name must contain only letters, spaces and punctuation"
            defaultValue={applicantData.provinceOrState}
          />
        </div>

        <div ref={postcodeRef}>
          <FreeText
            id="postcode"
            label="Postal code (optional)"
            errorMessage={errors?.postcode?.message ?? ""}
            formValue="postcode"
            required={false}
            patternValue={formRegex.lettersNumbersAndSpaces}
            patternError="Postcode must contain only letters, numbers and spaces"
            defaultValue={applicantData.postcode}
          />
        </div>

        <div ref={addressCountryRef}>
          <Dropdown
            id="address-country"
            label="Country"
            options={countryList}
            errorMessage={errors?.country?.message ?? ""}
            formValue="country"
            placeholder="Select country"
            required="Enter the country of the applicant's home address"
            defaultValue={applicantData.country}
          />
        </div>

        <SubmitButton id="continue" class={ButtonClass.DEFAULT} text="Continue" />
      </form>
    </FormProvider>
  );
};

export default ApplicantContactDetailsForm;
