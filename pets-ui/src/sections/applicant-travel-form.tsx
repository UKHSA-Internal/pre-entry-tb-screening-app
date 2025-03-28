import { useEffect, useRef } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { ReduxTravelDetailsType } from "@/applicant";
import Button from "@/components/button/button";
import Dropdown from "@/components/dropdown/dropdown";
import ErrorSummary from "@/components/errorSummary/errorSummary";
import FreeText from "@/components/freeText/freeText";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectTravel, setTravelDetails } from "@/redux/travelSlice";
import { ButtonType } from "@/utils/enums";
import { formRegex, visaOptions } from "@/utils/records";

const ApplicantTravelForm = () => {
  const navigate = useNavigate();

  const methods = useForm<ReduxTravelDetailsType>({ reValidateMode: "onSubmit" });
  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const dispatch = useAppDispatch();
  const travelData = useAppSelector(selectTravel);

  const onSubmit: SubmitHandler<ReduxTravelDetailsType> = (travelData) => {
    dispatch(setTravelDetails(travelData));
    navigate("/travel-summary");
  };

  const errorsToShow = Object.keys(errors);

  // Required to scroll to the correct element when a change link on the summary page is clicked
  const location = useLocation();
  const visaTypeRef = useRef<HTMLDivElement | null>(null);
  const addressLine1Ref = useRef<HTMLDivElement | null>(null);
  const addressLine2Ref = useRef<HTMLDivElement | null>(null);
  const townRef = useRef<HTMLDivElement | null>(null);
  const postcodeRef = useRef<HTMLDivElement | null>(null);
  const mobileNumberRef = useRef<HTMLDivElement | null>(null);
  const emailRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (location.hash) {
      const target = location.hash.substring(1);
      const refMap: { [key: string]: HTMLElement | null } = {
        "visa-type": visaTypeRef.current,
        "address-1": addressLine1Ref.current,
        "address-2": addressLine2Ref.current,
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

        <div ref={visaTypeRef}>
          <Dropdown
            id="visa-type"
            heading="Visa type"
            options={visaOptions}
            errorMessage={errors?.visaType?.message ?? ""}
            formValue="visaType"
            required="Select a visa type"
            defaultValue={travelData.visaType}
          />
        </div>

        <div ref={addressLine1Ref}>
          <FreeText
            id="address-1"
            label="Address line 1"
            heading="Applicant's UK address"
            headingStyle={{ marginBottom: 20 }}
            errorMessage={errors?.applicantUkAddress1?.message ?? ""}
            formValue="applicantUkAddress1"
            required="Enter address line 1, typically the building and street"
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

        <div ref={townRef}>
          <FreeText
            id="town-or-city"
            label="Town/city"
            errorMessage={errors?.townOrCity?.message ?? ""}
            formValue="townOrCity"
            required="Enter town or city"
            patternValue={formRegex.lettersSpacesAndPunctuation}
            patternError="Town name must contain only letters, spaces and punctuation"
            defaultValue={travelData.townOrCity}
          />
        </div>

        <div ref={postcodeRef}>
          <FreeText
            id="postcode"
            label="Postcode"
            errorMessage={errors?.postcode?.message ?? ""}
            formValue="postcode"
            required="Enter full UK postcode"
            patternValue={formRegex.lettersNumbersAndSpaces}
            patternError="Postcode must contain only letters, numbers and spaces"
            defaultValue={travelData.postcode}
          />
        </div>

        <div ref={mobileNumberRef}>
          <FreeText
            id="mobile-number"
            errorMessage={errors?.ukMobileNumber?.message ?? ""}
            heading="Applicant's UK phone number"
            formValue="ukMobileNumber"
            required="Enter UK mobile number"
            patternValue={formRegex.numbersOnly}
            patternError="Full name must contain only letters and spaces"
            defaultValue={travelData.ukMobileNumber}
          />
        </div>

        <div ref={emailRef}>
          <FreeText
            id="email"
            errorMessage={errors?.ukEmail?.message ?? ""}
            heading="Applicant's UK email"
            formValue="ukEmail"
            required="Enter UK email address"
            patternValue={formRegex.emailAddress}
            patternError="Email must be in correct format"
            defaultValue={travelData.ukEmail}
          />
        </div>

        <Button
          id="save-and-continue"
          type={ButtonType.DEFAULT}
          text="Save and continue"
          href="/travel-confirmation"
          handleClick={() => {}}
        />
      </form>
    </FormProvider>
  );
};

export default ApplicantTravelForm;
