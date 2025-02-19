import { useEffect, useRef } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { TravelDetailsType } from "@/applicant";
import Button from "@/components/button/button";
import Dropdown from "@/components/dropdown/dropdown";
import FreeText from "@/components/freeText/freeText";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectTravel, setTravelDetails } from "@/redux/travelSlice";
import { ButtonType } from "@/utils/enums";
import { attributeToComponentId, formRegex, visaOptions } from "@/utils/helpers";

const ApplicantTravelForm = () => {
  const navigate = useNavigate();

  const methods = useForm<TravelDetailsType>({ reValidateMode: "onSubmit" });
  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const dispatch = useAppDispatch();
  const updateReduxStore = (travelData: TravelDetailsType) => {
    dispatch(setTravelDetails(travelData));
  };
  const travelData = useAppSelector(selectTravel);

  const onSubmit: SubmitHandler<TravelDetailsType> = (data) => {
    updateReduxStore(data);
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
        {!!errorsToShow?.length && (
          <div className="govuk-error-summary" data-module="govuk-error-summary">
            <div role="alert">
              <h2 className="govuk-error-summary__title">There is a problem</h2>
              <div className="govuk-error-summary__body">
                <ul className="govuk-list govuk-error-summary__list">
                  {errorsToShow.map((error) => (
                    <li key={attributeToComponentId[error]}>
                      <a href={"#" + attributeToComponentId[error]}>
                        {errors[error as keyof typeof errors]?.message}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div ref={visaTypeRef}>
          <h2 className="govuk-label govuk-label--m">Visa type</h2>
          <Dropdown
            id="visa-type"
            options={visaOptions}
            errorMessage={errors?.visaType?.message ?? ""}
            formValue="visaType"
            required="Select a visa type."
            defaultValue={travelData.visaType}
          />
        </div>

        <h2 className="govuk-label govuk-label--m">Applicant&apos;s UK address</h2>

        <div ref={addressLine1Ref}>
          <FreeText
            id="address-1"
            label="Address line 1"
            errorMessage={errors?.applicantUkAddress1?.message ?? ""}
            formValue="applicantUkAddress1"
            required="Enter address line 1, typically the building and street."
            patternValue={formRegex.lettersNumbersSpacesAndPunctuation}
            patternError="Home address must contain only letters, numbers, spaces and punctuation."
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
            patternError="Home address must contain only letters, numbers, spaces and punctuation."
            defaultValue={travelData.applicantUkAddress2}
          />
        </div>

        <div ref={townRef}>
          <FreeText
            id="town-or-city"
            label="Town/City"
            errorMessage={errors?.townOrCity?.message ?? ""}
            formValue="townOrCity"
            required="Enter town or city."
            patternValue={formRegex.lettersSpacesAndPunctuation}
            patternError="Town name must contain only letters, spaces and punctuation."
            defaultValue={travelData.townOrCity}
          />
        </div>

        <div ref={postcodeRef}>
          <FreeText
            id="postcode"
            label="Postcode"
            errorMessage={errors?.postcode?.message ?? ""}
            formValue="postcode"
            required="Enter full UK postcode."
            patternValue={formRegex.lettersNumbersAndSpaces}
            patternError="Postcode must contain only letters, numbers and spaces."
            defaultValue={travelData.postcode}
          />
        </div>

        <div ref={mobileNumberRef}>
          <h2 className="govuk-label govuk-label--m">Applicant&apos;s UK phone number</h2>
          <FreeText
            id="mobile-number"
            errorMessage={errors?.ukMobileNumber?.message ?? ""}
            formValue="ukMobileNumber"
            required="Enter UK mobile number."
            patternValue={formRegex.numbersOnly}
            patternError="Full name must contain only letters and spaces."
            defaultValue={travelData.ukMobileNumber}
          />
        </div>

        <div ref={emailRef}>
          <h2 className="govuk-label govuk-label--m">Applicant&apos;s UK email</h2>
          <FreeText
            id="email"
            errorMessage={errors?.ukEmail?.message ?? ""}
            formValue="ukEmail"
            required="Enter UK email address."
            patternValue={formRegex.emailAddress}
            patternError="Email must be in correct format."
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
