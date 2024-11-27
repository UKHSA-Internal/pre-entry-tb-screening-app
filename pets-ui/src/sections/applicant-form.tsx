/* eslint-disable @typescript-eslint/no-misused-promises */
import { useForm, SubmitHandler, FormProvider, Controller } from "react-hook-form"
import { useNavigate } from "react-router-dom";
import { 
  attributeToComponentId, 
  formRegex, 
  countryList, 
  dateValidationMessages, 
  validMonthValues, 
  isValidDate 
} from "@/utils/helpers"
import Button, { ButtonType } from "@/components/button/button"
import FreeText from "@/components/freeText/freeText"
import Radio, { RadioIsInline } from "@/components/radio/radio";
import DateTextInput, { DateType } from "@/components/dateTextInput/dateTextInput";
import Dropdown from "@/components/dropdown/dropdown";

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
  setTownOrCity
} from "@/redux/applicantSlice";
// import { useDispatch } from "react-redux";
// import { AppDispatch, RootState } from "@redux/store";

export type ApplicantDetailsType = {
  fullName: string
  sex: string
  dateOfBirth: DateType
  countryOfNationality: string
  passportNumber: string
  countryOfIssue: string
  passportIssueDate: DateType
  passportExpiryDate: DateType 
  applicantHomeAddress1: string
  applicantHomeAddress2?: string
  applicantHomeAddress3?: string
  townOrCity: string
  provinceOrState: string
  country: string
  postcode?: string
}

const ApplicantForm = () => {
  const navigate = useNavigate();

  const methods = useForm<ApplicantDetailsType>({reValidateMode: 'onSubmit'})

  const { control, handleSubmit, formState: { errors } } = methods;

  // const dispatch = useDispatch<AppDispatch>();
  // const applicant = useSelector((state: RootState) => state.applicant);

  const updateReduxStore = (applicantData: ApplicantDetailsType) => {
    // dispatch(setPassportExpiryDate(applicantData.passportExpiryDate));
    // useAppDispatch(setPassportNumber(applicantData.passportNumber))
    // useAppDispatch(setDob(dob));
    // useAppDispatch(setSex(sex));
  }

  const onSubmit: SubmitHandler<ApplicantDetailsType> = async (data) => {
    console.log(data)
    updateReduxStore(data);
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      await fetch("http://localhost:3005/dev/register-applicant", {
          method: "POST",
          body: JSON.stringify(data),
          headers: myHeaders,
      })
      navigate("/applicant/confirmation")
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error submitting POST request:")
        console.error(error?.message);
      } else {
        console.error("Error submitting POST request: unknown error type")
        console.error(error);
      }
    }
  }

  const errorsToShow = Object.keys(errors);

  const validateDate = (value: DateType, fieldName: string) => {
    const { day, month, year } = value;

    if (!day || !month || !year) {
      return dateValidationMessages[fieldName as keyof typeof dateValidationMessages].emptyFieldError;
    } else if ( isNaN(parseInt(day)) || isNaN(parseInt(year)) || !validMonthValues.includes(month.toLowerCase())) {
      return dateValidationMessages[fieldName as keyof typeof dateValidationMessages].invalidCharError;
    } else if (!isValidDate(day, month, year)) {
      return dateValidationMessages[fieldName as keyof typeof dateValidationMessages].invalidDateError;
    }

    return true;
  }

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
        />

        <Dropdown
          id="country-of-nationality"
          label="Country of Nationality"
          options={countryList}
          errorMessage={errors?.countryOfNationality?.message ?? ""}
          formValue="countryOfNationality"
          required="Select a country."
        />

        <Controller
          name="dateOfBirth"
          control={control}
          defaultValue={{ day: '', month: '', year: '' }} 
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
        />

        <Dropdown
          id="country-of-issue"
          label="Country of Issue"
          hint="This is usually shown on the first page of the passport, at the top. Use the English spelling or the country code."
          options={countryList}
          errorMessage={errors?.countryOfIssue?.message ?? ""}
          formValue="countryOfIssue"
          required="Select a country."
        />

        <Controller
          name="passportIssueDate"
          control={control}
          defaultValue={{ day: '', month: '', year: '' }} 
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
          defaultValue={{ day: '', month: '', year: '' }} 
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
        />

        <FreeText
          id="address-2"
          label="Address line 2"
          errorMessage={errors?.applicantHomeAddress2?.message ?? ""}
          formValue="applicantHomeAddress2"
          required={false}
          patternValue={formRegex.lettersNumbersSpacesAndPunctuation}
          patternError="Home address must contain only letters, numbers, spaces and punctuation."
        />

        <FreeText
          id="address-3"
          label="Address line 3"
          errorMessage={errors?.applicantHomeAddress3?.message ?? ""}
          formValue="applicantHomeAddress3"
          required={false}
          patternValue={formRegex.lettersNumbersSpacesAndPunctuation}
          patternError="Home address must contain only letters, numbers, spaces and punctuation."
        />

        <FreeText
          id="town-or-city"
          label="Town/City"
          errorMessage={errors?.townOrCity?.message ?? ""}
          formValue="townOrCity"
          required="Enter the town or city of the applicant's home address."
          patternValue={formRegex.lettersSpacesAndPunctuation}
          patternError="Town name must contain only letters, spaces and punctuation."
        />
        
        <FreeText
          id="province-or-state"
          label="Province/State"
          errorMessage={errors?.provinceOrState?.message ?? ""}
          formValue="provinceOrState"
          required="Enter the province or state of the applicant's home address."
          patternValue={formRegex.lettersSpacesAndPunctuation}
          patternError="Province/state name must contain only letters, spaces and punctuation."
        />

        <Dropdown
          id="address-country"
          label="Country"
          options={countryList}
          errorMessage={errors?.country?.message ?? ""}
          formValue="country"
          required="Select a country."
        />

        <FreeText
          id="postcode"
          label="Postcode"
          errorMessage={errors?.postcode?.message ?? ""}
          formValue="postcode"
          required={false}
          patternValue={formRegex.lettersNumbersAndSpaces}
          patternError="Postcode must contain only letters, numbers and spaces."
        />

        <Button
          id="save-and-continue"
          type={ButtonType.DEFAULT}
          text="Save and continue"
          href="/applicant/confirmation"
          handleClick={() => {}}
        />

        {/* <pre>{JSON.stringify(applicant, null, 2)}</pre> */}
      </form>
    </FormProvider>
  )
}

export default ApplicantForm;
