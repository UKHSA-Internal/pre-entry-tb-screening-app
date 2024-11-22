/* eslint-disable @typescript-eslint/no-misused-promises */
import { useForm, SubmitHandler, FormProvider } from "react-hook-form"
import { useNavigate } from "react-router-dom";

import { attributeToComponentId, formRegex, countryList } from "@/utils/helpers"
import Button, { ButtonType } from "@/components/button/button"
import FreeText from "@/components/freeText/freeText"
import Radio, { RadioIsInline } from "@/components/radio/radio";
// import DateTextInput from "@/components/dateTextInput/dateTextInput";
import Dropdown from "@/components/dropdown/dropdown";

type FormValues = {
  fullName: string
  sex: string
  dateOfBirth: {
    year: string | number;
    month: string | number;
    day: string | number;
  }
  countryOfNationality: string
}

const ApplicantFormTemp = () => {
  const navigate = useNavigate();

  const methods = useForm<FormValues>({reValidateMode: 'onSubmit'})

  const { handleSubmit, formState: { errors } } = methods;

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log(data)
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

        {/* <DateTextInput
          id={"birth-date"}
          autocomplete={false}
          errorMessage={errors?.dateOfBirth?.message ?? ""}
          formValue="dateOfBirth"
        /> */}

        <Button
          id="save-and-continue"
          type={ButtonType.DEFAULT}
          text="Save and continue"
          href="/applicant/confirmation"
          handleClick={() => {}}
        />
      </form>
    </FormProvider>
  )
}

export default ApplicantFormTemp;
