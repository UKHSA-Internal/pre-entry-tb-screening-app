import { useEffect, useRef } from "react";
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { DateType, ReduxApplicantDetailsType } from "@/applicant";
import DateTextInput from "@/components/dateTextInput/dateTextInput";
import Dropdown from "@/components/dropdown/dropdown";
import ErrorSummary from "@/components/errorSummary/errorSummary";
import FreeText from "@/components/freeText/freeText";
import Radio from "@/components/radio/radio";
import SubmitButton from "@/components/submitButton/submitButton";
import { selectApplicant, setApplicantDetails } from "@/redux/applicantSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ButtonType, RadioIsInline } from "@/utils/enums";
import { validateDate } from "@/utils/helpers";
import { countryList, formRegex } from "@/utils/records";

const ApplicantForm = () => {
  const applicantData = useAppSelector(selectApplicant);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const methods = useForm<ReduxApplicantDetailsType>({ reValidateMode: "onSubmit" });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<ReduxApplicantDetailsType> = (applicantData) => {
    dispatch(setApplicantDetails(applicantData));
    navigate("/applicant-summary");
  };

  const errorsToShow = Object.keys(errors);

  // Required to scroll to the correct element when a change link on the summary page is clicked
  const location = useLocation();
  const nameRef = useRef<HTMLDivElement | null>(null);
  const sexRef = useRef<HTMLDivElement | null>(null);
  const countryOfNationalityRef = useRef<HTMLDivElement | null>(null);
  const dateOfBirthRef = useRef<HTMLDivElement | null>(null);
  const passportNumberRef = useRef<HTMLDivElement | null>(null);
  const countryOfIssueRef = useRef<HTMLDivElement | null>(null);
  const passportIssueDateRef = useRef<HTMLDivElement | null>(null);
  const passportExpiryDateRef = useRef<HTMLDivElement | null>(null);
  const addressLine1Ref = useRef<HTMLDivElement | null>(null);
  const addressLine2Ref = useRef<HTMLDivElement | null>(null);
  const addressLine3Ref = useRef<HTMLDivElement | null>(null);
  const townRef = useRef<HTMLDivElement | null>(null);
  const provinceRef = useRef<HTMLDivElement | null>(null);
  const addressCountryRef = useRef<HTMLDivElement | null>(null);
  const postcodeRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (location.hash) {
      const target = location.hash.substring(1);
      const refMap: { [key: string]: HTMLElement | null } = {
        name: nameRef.current,
        sex: sexRef.current,
        "country-of-nationality": countryOfNationalityRef.current,
        "birth-date": dateOfBirthRef.current,
        "passport-number": passportNumberRef.current,
        "country-of-issue": countryOfIssueRef.current,
        "passport-issue-date": passportIssueDateRef.current,
        "passport-expiry-date": passportExpiryDateRef.current,
        "address-1": addressLine1Ref.current,
        "address-2": addressLine2Ref.current,
        "address-3": addressLine3Ref.current,
        "town-or-city": townRef.current,
        "province-or-state": provinceRef.current,
        "address-country": addressCountryRef.current,
        postcode: postcodeRef.current,
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

        <div ref={nameRef}>
          <FreeText
            id="name"
            label="Full name"
            heading="Applicant's personal details"
            headingStyle={{ marginBottom: 20 }}
            errorMessage={errors?.fullName?.message ?? ""}
            formValue="fullName"
            required="Enter the applicant's full name"
            patternValue={formRegex.fullName}
            patternError="Full name must contain only letters and spaces"
            defaultValue={applicantData.fullName}
          />
        </div>

        <div ref={sexRef}>
          <Radio
            id="sex"
            legend="Sex"
            isInline={RadioIsInline.TRUE}
            answerOptions={["Female", "Male", "Other"]}
            sortAnswersAlphabetically={false}
            errorMessage={errors?.sex?.message ?? ""}
            formValue="sex"
            required="Select the applicant's sex"
            defaultValue={applicantData.sex}
          />
        </div>

        <div ref={countryOfNationalityRef}>
          <Dropdown
            id="country-of-nationality"
            label="Country of nationality"
            options={countryList}
            errorMessage={errors?.countryOfNationality?.message ?? ""}
            formValue="countryOfNationality"
            required="Select the country of nationality"
            defaultValue={applicantData.countryOfNationality}
          />
        </div>

        <div ref={dateOfBirthRef}>
          <Controller
            name="dateOfBirth"
            control={control}
            defaultValue={{
              day: applicantData.dateOfBirth.day,
              month: applicantData.dateOfBirth.month,
              year: applicantData.dateOfBirth.year,
            }}
            rules={{
              validate: (value: DateType) => validateDate(value, "dateOfBirth"),
            }}
            render={({ field: { value, onChange } }) => (
              <DateTextInput
                legend="Date of birth"
                hint="For example, 31 3 2019"
                value={value}
                setDateValue={onChange}
                id={"birth-date"}
                autocomplete={false}
                errorMessage={errors?.dateOfBirth?.message ?? ""}
              />
            )}
          />
        </div>
        <div ref={passportNumberRef}>
          <FreeText
            id="passport-number"
            label="Applicant's passport number"
            errorMessage={errors?.passportNumber?.message ?? ""}
            formValue="passportNumber"
            required="Enter the applicant's passport number"
            patternValue={formRegex.lettersAndNumbers}
            patternError="Passport number must contain only letters and numbers"
            defaultValue={applicantData.passportNumber}
          />
        </div>

        <div ref={countryOfIssueRef}>
          <Dropdown
            id="country-of-issue"
            label="Country of issue"
            hint="This is usually shown on the first page of the passport, at the top. Use the English spelling or the country code."
            options={countryList}
            errorMessage={errors?.countryOfIssue?.message ?? ""}
            formValue="countryOfIssue"
            required="Select the country of issue"
            defaultValue={applicantData.countryOfIssue}
          />
        </div>

        <div ref={passportIssueDateRef}>
          <Controller
            name="passportIssueDate"
            control={control}
            defaultValue={{
              day: applicantData.passportIssueDate.day,
              month: applicantData.passportIssueDate.month,
              year: applicantData.passportIssueDate.year,
            }}
            rules={{
              validate: (value: DateType) => validateDate(value, "passportIssueDate"),
            }}
            render={({ field: { value, onChange } }) => (
              <DateTextInput
                legend="Issue date"
                hint="For example, 31 3 2019"
                value={value}
                setDateValue={onChange}
                id={"passport-issue-date"}
                autocomplete={false}
                errorMessage={errors?.passportIssueDate?.message ?? ""}
              />
            )}
          />
        </div>

        <div ref={passportExpiryDateRef}>
          <Controller
            name="passportExpiryDate"
            control={control}
            defaultValue={{
              day: applicantData.passportExpiryDate.day,
              month: applicantData.passportExpiryDate.month,
              year: applicantData.passportExpiryDate.year,
            }}
            rules={{
              validate: (value: DateType) => validateDate(value, "passportExpiryDate"),
            }}
            render={({ field: { value, onChange } }) => (
              <DateTextInput
                legend="Expiry date"
                hint="For example, 31 3 2019"
                value={value}
                setDateValue={onChange}
                id="passport-expiry-date"
                autocomplete={false}
                errorMessage={errors?.passportExpiryDate?.message ?? ""}
              />
            )}
          />
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
            label="Address line 2"
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
            label="Address line 3"
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
            label="Town/city"
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
            label="Province/state"
            errorMessage={errors?.provinceOrState?.message ?? ""}
            formValue="provinceOrState"
            required="Enter the province or state of the applicant's home address"
            patternValue={formRegex.lettersSpacesAndPunctuation}
            patternError="Province/state name must contain only letters, spaces and punctuation"
            defaultValue={applicantData.provinceOrState}
          />
        </div>

        <div ref={addressCountryRef}>
          <Dropdown
            id="address-country"
            label="Country"
            options={countryList}
            errorMessage={errors?.country?.message ?? ""}
            formValue="country"
            required="Enter the country of the applicant's home address"
            defaultValue={applicantData.country}
          />
        </div>

        <div ref={postcodeRef}>
          <FreeText
            id="postcode"
            label="Postcode"
            errorMessage={errors?.postcode?.message ?? ""}
            formValue="postcode"
            required={false}
            patternValue={formRegex.lettersNumbersAndSpaces}
            patternError="Postcode must contain only letters, numbers and spaces"
            defaultValue={applicantData.postcode}
          />
        </div>

        <SubmitButton id="save-and-continue" type={ButtonType.DEFAULT} text="Save and continue" />
      </form>
    </FormProvider>
  );
};

export default ApplicantForm;
