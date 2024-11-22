import { useState } from "react"
import { useForm, SubmitHandler, FormProvider, useFormContext } from "react-hook-form"
import { useNavigate } from "react-router-dom";

import { countryList, attributeToComponentId } from "@/utils/helpers"
import Button, { ButtonType } from "@/components/button/button"
import DateTextInput from "@/components/dateTextInput/dateTextInput"
import Dropdown from "@/components/dropdown/dropdown"
import FreeText from "@/components/freeText/freeText"
import Radio, { RadioIsInline } from "@/components/radio/radio"

type FormValues = {
  fullName: string
  dateOfBirth: {
    year: string | number;
    month: string | number;
    day: string | number;
  }
  sex: string
  passportNumber: string
  countryOfNationality: string
  countryOfIssue: string
  passportIssueDate: {
    year: string | number;
    month: string | number;
    day: string | number;
  }
  passportExpiryDate: {
    year: string | number;
    month: string | number;
    day: string | number;
  } 
  applicantHomeAddress1: string
  applicantHomeAddress2?: string
  applicantHomeAddress3?: string
  townOrCity: string
  provinceOrState: string
  country: string
  postcode?: string
}

const ApplicantForm = () => {
  const { 
    register, 
    handleSubmit,
    formState: { errors },
    //  ...rest
  } = useForm<FormValues>({
    reValidateMode: 'onSubmit'
  })
  // const methods = useForm<FormValues>({reValidateMode: 'onSubmit'});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormValues>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      await fetch("http://localhost:3004/dev/register-applicant", {
          method: "POST",
          body: JSON.stringify(data),
          headers: myHeaders,
      })
      setHasSubmitted(true)
      setSubmittedData(data)
      navigate("/applicant/confirmation")
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error submitting POST request:")
        console.error(error?.message);
      } else {
        console.error("Error submitting POST request: unknown error type")
        console.error(error);
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // const errors = methods.formState.errors;
  // const handleSubmit = methods.handleSubmit;

  const errorsToShow = Object.keys(errors);

  return (
    // <FormProvider {...methods}>
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
                      <a href={"#" + attributeToComponentId[error]}>{errors[error as keyof typeof errors]?.message}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        }
        <FreeText
          {...register("fullName", { 
            required: "Enter name",
            pattern: {
              value: /[^a-zA-Z\s]+/,
              message: "Failed validation"
            }
          })}
          id="name"
          title="Applicant's Personal Details"
          label="Full Name"
          // handleChange={handleTextChange}
          errorMessage={errors?.fullName?.message ?? ""}
          handleChange={() => {}}
        />
        {/* <p>{errors?.fullName?.message}</p> */}
        {/* <p>{errorsToShow["fullName"]}</p> */}

        {/* <input 
          {...register("sex", { 
            required: "Enter sex",
            pattern: {
              value: /A-Za-z\s/, 
              message: "Sex must contain only letters and spaces."
            }
           })}
        />
        <p>{errors?.sex?.message}</p> */}

        <FreeText
          id="passportNumber"
          title="Applicant's PN"
          label="P Number"
          // handleChange={handleTextChange}
          errorMessage={""}
          handleChange={() => {}}
        />

        <DateTextInput
          {...register("dateOfBirth", { required: true })}
          id="birth-date"
          autocomplete={true}
          legend="Date of Birth"
          hint="For example, 31 3 2019"
          // handleChange={handleDateChange}
          // errorMessage={errorMessages.dateOfBirth}
          handleChange={() => {}}
          errorMessage=""
        />

        <Radio
          {...register("sex", { required: true })}
          id="applicants-sex"
          legend="Sex"
          isInline={RadioIsInline.TRUE}
          answerOptions={["Male", "Female"]}
          sortAnswersAlphabetically={false}
          // handleChange={handleRadioChange}
          // errorMessage={errorMessages.sex}
          handleChange={() => {}}
          errorMessage=""
        />

        <FreeText
          {...register("passportNumber", { required: true })}
          id="passport-number"
          title="Applicant's Passport Details"
          label="Passport Number"
          hint="For example, 1208297A"
          // handleChange={handleTextChange}
          // errorMessage={errorMessages.passportNumber}
          handleChange={() => {}}
          errorMessage=""
        />

        <Dropdown
          {...register("countryOfNationality", { required: true })}
          id="country-of-nationality"
          label="Country of Nationality"
          name="country"
          options={countryList}
          // handleOptionChange={handleDropdownChange}
          // errorMessage={errorMessages.countryOfNationality}
          handleOptionChange={() => {}}
          errorMessage=""
        />

        <Dropdown
          {...register("countryOfIssue", { required: true })}
          id="country-of-issue"
          label="Country of Issue"
          hint="This is usually shown on the first page of the passport, at the top. Use the English spelling or the country code."
          name="country"
          options={countryList}
          // handleOptionChange={handleDropdownChange}
          // errorMessage={errorMessages.countryOfIssue}
          handleOptionChange={() => {}}
          errorMessage=""
        />

        <DateTextInput
          {...register("passportIssueDate", { required: true })}
          id="passport-issue-date"
          autocomplete={false}
          legend="Issue Date"
          hint="For example, 31 3 2019"
          // handleChange={handleDateChange}
          // errorMessage={errorMessages.issueDate}
          handleChange={() => {}}
          errorMessage=""
        />

        <DateTextInput
          {...register("passportExpiryDate", { required: true })}
          id="passport-expiry-date"
          autocomplete={false}
          legend="Expiry Date"
          hint="For example, 31 3 2019"
          // handleChange={handleDateChange}
          // errorMessage={errorMessages.expiryDate}
          handleChange={() => {}}
          errorMessage=""
        />

        <FreeText
          {...register("applicantHomeAddress1", { required: true })}
          id="address-1"
          title="Applicant's Home Address"
          label="Address line 1"
          // handleChange={handleTextChange}
          // errorMessage={errorMessages.applicantHomeAddress1}
          handleChange={() => {}}
          errorMessage=""
        />

        <FreeText
          {...register("applicantHomeAddress2", { required: false })}
          id="address-2"
          label="Address line 2"
          // handleChange={handleTextChange}
          // errorMessage={errorMessages.applicantHomeAddress2}
          handleChange={() => {}}
          errorMessage=""
        />

        <FreeText
          {...register("applicantHomeAddress3", { required: false })}
          id="address-3"
          label="Address line 3"
          // handleChange={handleTextChange}
          // errorMessage={errorMessages.applicantHomeAddress3}
          handleChange={() => {}}
          errorMessage=""
        />

        <FreeText
          {...register("townOrCity", { required: true })}
          id="town-or-city"
          label="Town/City"
          // handleChange={handleTextChange}
          // errorMessage={errorMessages.townOrCity}
          handleChange={() => {}}
          errorMessage=""
        />
        
        <FreeText
          {...register("provinceOrState", { required: false })}
          id="province-or-state"
          label="Province/State"
          // handleChange={handleTextChange}
          // errorMessage={errorMessages.provinceOrState}
          handleChange={() => {}}
          errorMessage=""
        />

        <Dropdown
          {...register("country", { required: true })}
          id="address-country"
          label="Country"
          name="country"
          options={countryList}
          // handleOptionChange={handleDropdownChange}
          // errorMessage={errorMessages.country}
          handleOptionChange={() => {}}
          errorMessage=""
        />

        <FreeText
          {...register("postcode", { required: false })}
          id="postcode"
          label="Postcode"
          // handleChange={handleTextChange}
          // errorMessage={errorMessages.postcode}
          handleChange={() => {}}
          errorMessage=""
        />

        <Button
          id="save-and-continue"
          type={ButtonType.DEFAULT}
          text="Save and continue"
          href="/applicant/confirmation"
          // handleClick={handleButtonClick}
          handleClick={() => {}}
        />
    </form>
    // </FormProvider>
  )
}

export default ApplicantForm;
