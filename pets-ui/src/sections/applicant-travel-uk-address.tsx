import { useEffect, useRef } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { putTravelDetails } from "@/api/api";
import ErrorSummary from "@/components/errorSummary/errorSummary";
import FreeText from "@/components/freeText/freeText";
import Heading from "@/components/heading/heading";
import SubmitButton from "@/components/submitButton/submitButton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectApplication, selectTravel } from "@/redux/store";
import {
  setApplicantUkAddress1,
  setApplicantUkAddress2,
  setApplicantUkAddress3,
  setPostcode,
  setTownOrCity,
  setTravelDetailsStatus,
  setUkEmail,
  setUkMobileNumber,
} from "@/redux/travelSlice";
import { ReduxTravelDetailsType } from "@/types";
import { ApplicationStatus, ButtonType } from "@/utils/enums";
import { sendGoogleAnalyticsFormErrorEvent } from "@/utils/helpers";
import { formRegex } from "@/utils/records";

type TravelAddressAndContactDetailsData = Omit<ReduxTravelDetailsType, "visaCategory">;

const ApplicantTravelAddressAndContactDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const travelData = useAppSelector(selectTravel);
  const applicationData = useAppSelector(selectApplication);
  const methods = useForm<TravelAddressAndContactDetailsData>({ reValidateMode: "onSubmit" });
  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<TravelAddressAndContactDetailsData> = async (
    travelAddressAndContactDetailsData,
  ) => {
    dispatch(setApplicantUkAddress1(travelAddressAndContactDetailsData.applicantUkAddress1 ?? ""));
    dispatch(setApplicantUkAddress2(travelAddressAndContactDetailsData.applicantUkAddress2 ?? ""));
    dispatch(setApplicantUkAddress3(travelAddressAndContactDetailsData.applicantUkAddress3 ?? ""));
    dispatch(setTownOrCity(travelAddressAndContactDetailsData.townOrCity ?? ""));
    dispatch(setPostcode(travelAddressAndContactDetailsData.postcode ?? ""));
    dispatch(setUkMobileNumber(travelAddressAndContactDetailsData.ukMobileNumber ?? ""));
    dispatch(setUkEmail(travelAddressAndContactDetailsData.ukEmail ?? ""));

    if (travelData.status === ApplicationStatus.COMPLETE && applicationData.applicationId) {
      try {
        await putTravelDetails(applicationData.applicationId, {
          ukAddressLine1: travelAddressAndContactDetailsData.applicantUkAddress1,
          ukAddressLine2: travelAddressAndContactDetailsData.applicantUkAddress2,
          ukAddressTownOrCity: travelAddressAndContactDetailsData.townOrCity,
          ukAddressPostcode: travelAddressAndContactDetailsData.postcode,
          ukMobileNumber: travelAddressAndContactDetailsData.ukMobileNumber,
          ukEmailAddress: travelAddressAndContactDetailsData.ukEmail,
        });

        navigate("/tb-certificate-summary");
      } catch (error) {
        console.error(error);
        navigate("/error");
      }
    } else {
      dispatch(setTravelDetailsStatus(ApplicationStatus.IN_PROGRESS));
      navigate("/check-travel-information");
    }
  };

  const errorsToShow = Object.keys(errors);
  useEffect(() => {
    if (errorsToShow.length > 0) {
      sendGoogleAnalyticsFormErrorEvent("Visa applicant's proposed UK address", errorsToShow);
    }
  }, [errorsToShow]);

  // Required to scroll to the correct element when a change link on the summary page is clicked
  const addressLine1Ref = useRef<HTMLDivElement | null>(null);
  const addressLine2Ref = useRef<HTMLDivElement | null>(null);
  const addressLine3Ref = useRef<HTMLDivElement | null>(null);
  const townRef = useRef<HTMLDivElement | null>(null);
  const postcodeRef = useRef<HTMLDivElement | null>(null);
  const mobileNumberRef = useRef<HTMLDivElement | null>(null);
  const emailRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (location.hash) {
      const target = location.hash.substring(1);
      const refMap: { [key: string]: HTMLElement | null } = {
        "address-1": addressLine1Ref.current,
        "address-2": addressLine2Ref.current,
        "address-3": addressLine3Ref.current,
        "town-or-city": townRef.current,
        postcode: postcodeRef.current,
        "mobile-number": mobileNumberRef.current,
        email: emailRef.current,
      };

      const targetRef = refMap[target];
      if (targetRef) {
        targetRef.scrollIntoView();
      }
    }
  }, [location]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {!!errorsToShow?.length && <ErrorSummary errorsToShow={errorsToShow} errors={errors} />}

        <Heading level={1} size="l" title="Visa applicant's proposed UK address" />

        <div ref={addressLine1Ref}>
          <FreeText
            id="address-1"
            label="Address line 1 (optional)"
            headingStyle={{ marginBottom: 20 }}
            errorMessage={errors?.applicantUkAddress1?.message ?? ""}
            formValue="applicantUkAddress1"
            required={false}
            patternValue={formRegex.lettersNumbersSpacesAndPunctuation}
            patternError="Home address must contain only letters, numbers, spaces and punctuation"
            defaultValue={travelData.applicantUkAddress1}
          />
        </div>

        <div ref={addressLine2Ref}>
          <FreeText
            id="address-2"
            label="Address line 2 (optional)"
            errorMessage={errors?.applicantUkAddress2?.message ?? ""}
            formValue="applicantUkAddress2"
            required={false}
            patternValue={formRegex.lettersNumbersSpacesAndPunctuation}
            patternError="Home address must contain only letters, numbers, spaces and punctuation"
            defaultValue={travelData.applicantUkAddress2}
          />
        </div>

        <div ref={addressLine3Ref}>
          <FreeText
            id="address-3"
            label="Address line 3 (optional)"
            errorMessage={errors?.applicantUkAddress3?.message ?? ""}
            formValue="applicantUkAddress3"
            required={false}
            patternValue={formRegex.lettersNumbersSpacesAndPunctuation}
            patternError="Home address must contain only letters, numbers, spaces and punctuation"
            defaultValue={travelData.applicantUkAddress3}
          />
        </div>

        <div ref={townRef}>
          <FreeText
            id="town-or-city"
            label="Town/city (optional)"
            errorMessage={errors?.townOrCity?.message ?? ""}
            formValue="townOrCity"
            required={false}
            patternValue={formRegex.lettersSpacesAndPunctuation}
            patternError="Town name must contain only letters, spaces and punctuation"
            defaultValue={travelData.townOrCity}
          />
        </div>

        <div ref={postcodeRef}>
          <FreeText
            id="postcode"
            label="Postcode (optional)"
            errorMessage={errors?.postcode?.message ?? ""}
            formValue="postcode"
            required={false}
            patternValue={formRegex.lettersNumbersAndSpaces}
            patternError="Postcode must contain only letters, numbers and spaces"
            defaultValue={travelData.postcode}
          />
        </div>

        <div ref={mobileNumberRef}>
          <FreeText
            id="mobile-number"
            errorMessage={errors?.ukMobileNumber?.message ?? ""}
            heading="UK phone number (optional)"
            headingSize="s"
            formValue="ukMobileNumber"
            required={false}
            patternValue={formRegex.numbersOnly}
            patternError="Enter applicant's UK phone number"
            defaultValue={travelData.ukMobileNumber}
          />
        </div>

        <div ref={emailRef}>
          <FreeText
            id="email"
            errorMessage={errors?.ukEmail?.message ?? ""}
            heading="UK email address (optional)"
            headingSize="s"
            formValue="ukEmail"
            required={false}
            patternValue={formRegex.emailAddress}
            patternError="Email must be in correct format"
            defaultValue={travelData.ukEmail}
          />
        </div>

        <SubmitButton id="save-and-continue" type={ButtonType.DEFAULT} text="Continue" />
      </form>
    </FormProvider>
  );
};

export default ApplicantTravelAddressAndContactDetails;
