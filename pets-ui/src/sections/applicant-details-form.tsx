/* eslint-disable @typescript-eslint/no-misused-promises */
import { useEffect } from "react";
import { useForm, SubmitHandler, FormProvider, Controller } from "react-hook-form"
import { useNavigate, useLocation } from "react-router-dom";
import { 
  attributeToComponentId, 
  formRegex, 
  countryList, 
  validateDate,
} from "@/utils/helpers"

import Button from "@/components/button/button"
import FreeText from "@/components/freeText/freeText"
import Radio from "@/components/radio/radio";
import DateTextInput, { DateType } from "@/components/dateTextInput/dateTextInput";
import Dropdown from "@/components/dropdown/dropdown";
import { ButtonType, RadioIsInline } from "@/utils/enums";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { 
  setFullName, 
  setApplicantHomeAddress1, 
  setApplicantHomeAddress2,
  setApplicantHomeAddress3,
  setCountry,
  setCountryOfIssue,
  setCountryOfNationality,
  setDob,
  setPassportExpiryDate,
  setPassportIssueDate,
  setPassportNumber,
  setPostcode,
  setProvinceOrState,
  setSex,
  setTownOrCity,
  selectApplicant
} from "@/redux/applicantSlice";

const ApplicantForm = () => {
  const navigate = useNavigate();

  const methods = useForm<ApplicantDetailsType>({reValidateMode: 'onSubmit'})
  const { control, handleSubmit, formState: { errors } } = methods;

  const dispatch = useAppDispatch()
  const updateReduxStore = (applicantData: ApplicantDetailsType) => {
    dispatch(setFullName(applicantData.fullName))
    dispatch(setSex(applicantData.sex))
    dispatch(setDob(applicantData.dateOfBirth))
    dispatch(setCountryOfNationality(applicantData.countryOfNationality))
    dispatch(setPassportNumber(applicantData.passportNumber))
    dispatch(setCountryOfIssue(applicantData.countryOfIssue))
    dispatch(setPassportIssueDate(applicantData.passportIssueDate))
    dispatch(setPassportExpiryDate(applicantData.passportExpiryDate))
    dispatch(setApplicantHomeAddress1(applicantData.applicantHomeAddress1))
    dispatch(setApplicantHomeAddress2(applicantData.applicantHomeAddress2 ?? ""))
    dispatch(setApplicantHomeAddress3(applicantData.applicantHomeAddress3 ?? ""))
    dispatch(setTownOrCity(applicantData.townOrCity))
    dispatch(setProvinceOrState(applicantData.provinceOrState))
    dispatch(setCountry(applicantData.country))
    dispatch(setPostcode(applicantData.postcode ?? ""))
  }

  const applicantData = useAppSelector(selectApplicant)

  const onSubmit: SubmitHandler<ApplicantDetailsType> = (data) => {
    updateReduxStore(data)
    navigate("/applicant-summary")
  }

  const errorsToShow = Object.keys(errors);

  // Required to scroll to the correct element when a change link on the summary page is clicked
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView();
      }
    }
  }, [location]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {!!errorsToShow?.length &&
          <div className="govuk-error-summary" data-module="govuk-error-summary">
            <div role="alert">
              <h2 className="govuk-error-summary__title">
              There is a problem
              </h2>
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
        }
        
        <h2 className="govuk-label govuk-label--m">
          Applicant&apos;s Personal Details
        </h2>

        <FreeText
          id="name"
          label="Full Name"
          errorMessage={errors?.fullName?.message ?? ""}
          formValue="fullName"
          required="Enter the applicant's full name."
          patternValue={formRegex.lettersAndSpaces}
          patternError="Full name must contain only letters and spaces."
          defaultValue={applicantData.fullName}
        />

        <Radio
          id="sex"
          legend="Sex"
          isInline={RadioIsInline.TRUE}
          answerOptions={["Female", "Male"]}
          sortAnswersAlphabetically={false}
          errorMessage={errors?.sex?.message ?? ""}
          formValue="sex"
          required="Select the applicant's sex."
          defaultValue={applicantData.sex}
        />

        <Dropdown
          id="country-of-nationality"
          label="Country of Nationality"
          options={countryList}
          errorMessage={errors?.countryOfNationality?.message ?? ""}
          formValue="countryOfNationality"
          required="Select a country."
          defaultValue={applicantData.countryOfNationality}
        />

        <Controller
          name="dateOfBirth"
          control={control}
          defaultValue={{
            day: applicantData.dateOfBirth.day,
            month: applicantData.dateOfBirth.month,
            year: applicantData.dateOfBirth.year
          }} 
          rules={{
            validate: (value: DateType) => validateDate(value, "dateOfBirth"),
          }}
          render={({ field: { value, onChange } }) => (
            <DateTextInput 
              legend="Date of Birth"
              hint="For example, 31 3 2019"
              value={value} 
              setDateValue={onChange}
              id={"birth-date"}
              autocomplete={false}
              errorMessage={errors?.dateOfBirth?.message ?? ""}
            />
          )}
        />

        <FreeText
          id="passportNumber"
          label="Applicant's Passport Number"
          errorMessage={errors?.passportNumber?.message ?? ""}
          formValue="passportNumber"
          required="Enter the applicant's passport number."
          patternValue={formRegex.lettersAndNumbers}
          patternError="Passport number must contain only letters and numbers."
          defaultValue={applicantData.passportNumber}
        />

        <Dropdown
          id="country-of-issue"
          label="Country of Issue"
          hint="This is usually shown on the first page of the passport, at the top. Use the English spelling or the country code."
          options={countryList}
          errorMessage={errors?.countryOfIssue?.message ?? ""}
          formValue="countryOfIssue"
          required="Select a country."
          defaultValue={applicantData.countryOfIssue}
        />

        <Controller
          name="passportIssueDate"
          control={control}
          defaultValue={{
            day: applicantData.passportIssueDate.day,
            month: applicantData.passportIssueDate.month,
            year: applicantData.passportIssueDate.year
          }} 
          rules={{
            validate: (value: DateType) => validateDate(value, "passportIssueDate"),
          }}
          render={({ field: { value, onChange } }) => (
            <DateTextInput 
              legend="Issue Date"
              hint="For example, 31 3 2019"
              value={value} 
              setDateValue={onChange}
              id={"passport-issue-date"}
              autocomplete={false}
              errorMessage={errors?.passportIssueDate?.message ?? ""}
            />
          )}
        />

        <Controller
          name="passportExpiryDate"
          control={control}
          defaultValue={{
            day: applicantData.passportExpiryDate.day,
            month: applicantData.passportExpiryDate.month,
            year: applicantData.passportExpiryDate.year
          }} 
          rules={{
            validate: (value: DateType) => validateDate(value, "passportExpiryDate"),
          }}
          render={({ field: { value, onChange } }) => (
            <DateTextInput 
              legend="Expiry Date"
              hint="For example, 31 3 2019"
              value={value} 
              setDateValue={onChange}
              id="passport-expiry-date"
              autocomplete={false}
              errorMessage={errors?.passportExpiryDate?.message ?? ""}
            />
          )}
        />

        <FreeText
          id="address-1"
          label="Address line 1"
          errorMessage={errors?.applicantHomeAddress1?.message ?? ""}
          formValue="applicantHomeAddress1"
          required="Enter the first line of the applicant's home address."
          patternValue={formRegex.lettersNumbersSpacesAndPunctuation}
          patternError="Home address must contain only letters, numbers, spaces and punctuation."
          defaultValue={applicantData.applicantHomeAddress1}
        />

        <FreeText
          id="address-2"
          label="Address line 2"
          errorMessage={errors?.applicantHomeAddress2?.message ?? ""}
          formValue="applicantHomeAddress2"
          required={false}
          patternValue={formRegex.lettersNumbersSpacesAndPunctuation}
          patternError="Home address must contain only letters, numbers, spaces and punctuation."
          defaultValue={applicantData.applicantHomeAddress2}
        />

        <FreeText
          id="address-3"
          label="Address line 3"
          errorMessage={errors?.applicantHomeAddress3?.message ?? ""}
          formValue="applicantHomeAddress3"
          required={false}
          patternValue={formRegex.lettersNumbersSpacesAndPunctuation}
          patternError="Home address must contain only letters, numbers, spaces and punctuation."
          defaultValue={applicantData.applicantHomeAddress3}
        />

        <FreeText
          id="town-or-city"
          label="Town/City"
          errorMessage={errors?.townOrCity?.message ?? ""}
          formValue="townOrCity"
          required="Enter the town or city of the applicant's home address."
          patternValue={formRegex.lettersSpacesAndPunctuation}
          patternError="Town name must contain only letters, spaces and punctuation."
          defaultValue={applicantData.townOrCity}
        />
        
        <FreeText
          id="province-or-state"
          label="Province/State"
          errorMessage={errors?.provinceOrState?.message ?? ""}
          formValue="provinceOrState"
          required="Enter the province or state of the applicant's home address."
          patternValue={formRegex.lettersSpacesAndPunctuation}
          patternError="Province/state name must contain only letters, spaces and punctuation."
          defaultValue={applicantData.provinceOrState}
        />

        <Dropdown
          id="address-country"
          label="Country"
          options={countryList}
          errorMessage={errors?.country?.message ?? ""}
          formValue="country"
          required="Select a country."
          defaultValue={applicantData.country}
        />

        <FreeText
          id="postcode"
          label="Postcode"
          errorMessage={errors?.postcode?.message ?? ""}
          formValue="postcode"
          required={false}
          patternValue={formRegex.lettersNumbersAndSpaces}
          patternError="Postcode must contain only letters, numbers and spaces."
          defaultValue={applicantData.postcode}
        />

        <Button
          id="save-and-continue"
          type={ButtonType.DEFAULT}
          text="Save and continue"
          href="/applicant-summary"
          handleClick={() => {}}
        />
      </form>
    </FormProvider>
  )
}

export default ApplicantForm;
