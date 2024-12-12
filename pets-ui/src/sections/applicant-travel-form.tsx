/* eslint-disable @typescript-eslint/no-misused-promises */
import { useForm, SubmitHandler, FormProvider } from "react-hook-form"
import { useNavigate } from "react-router-dom";
import { 
  attributeToComponentId,
  formRegex,
  visaOptions,
} from "@/utils/helpers"

import Button from "@/components/button/button"
import FreeText from "@/components/freeText/freeText"
import Dropdown from "@/components/dropdown/dropdown";
import { ButtonType } from "@/utils/enums";

import { useAppDispatch } from "@/redux/hooks";
import {
  setVisaType,
  setApplicantUkAddress1,
  setApplicantUkAddress2,
  setTownOrCity,
  setPostcode,
  setUkMobileNumber,
  setUkEmail,
} from "@/redux/travelSlice"

const ApplicantTravelForm = () => {
  const navigate = useNavigate();

  const methods = useForm<TravelDetailsType>({reValidateMode: 'onSubmit'})
  const { handleSubmit, formState: { errors } } = methods;

  const dispatch = useAppDispatch()
  const updateReduxStore = (travelData: TravelDetailsType) => {
    dispatch(setVisaType(travelData.visaType))
    dispatch(setApplicantUkAddress1(travelData.applicantUkAddress1))
    dispatch(setApplicantUkAddress2(travelData.applicantUkAddress2 ?? ""))
    dispatch(setTownOrCity(travelData.townOrCity))
    dispatch(setPostcode(travelData.postcode))
    dispatch(setUkMobileNumber(travelData.ukMobileNumber ?? ""))
    dispatch(setUkEmail(travelData.ukEmail))
  }

  const onSubmit: SubmitHandler<TravelDetailsType> = (data) => {
    console.log(data)
    updateReduxStore(data)
    navigate("/travel-summary")
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
          Visa type
        </h2>
        <Dropdown
          id="visa-type"
          options={visaOptions}
          errorMessage={errors?.visaType?.message ?? ""}
          formValue="visaType"
          required="Select a visa type."
        />

        <h2 className="govuk-label govuk-label--m">
          Applicant&apos;s UK address
        </h2>

        <FreeText
          id="address-1"
          label="Address line 1"
          errorMessage={errors?.applicantUkAddress1?.message ?? ""}
          formValue="applicantUkAddress1"
          required="Enter address line 1, typically the building and street."
          patternValue={formRegex.lettersNumbersSpacesAndPunctuation}
          patternError="Home address must contain only letters, numbers, spaces and punctuation."
        />

        <FreeText
          id="address-2"
          label="Address line 2 (optional)"
          errorMessage={errors?.applicantUkAddress2?.message ?? ""}
          formValue="applicantUkAddress2"
          required={false}
          patternValue={formRegex.lettersNumbersSpacesAndPunctuation}
          patternError="Home address must contain only letters, numbers, spaces and punctuation."
        />

        <FreeText
          id="town-or-city"
          label="Town/City"
          errorMessage={errors?.townOrCity?.message ?? ""}
          formValue="townOrCity"
          required="Enter town or city."
          patternValue={formRegex.lettersSpacesAndPunctuation}
          patternError="Town name must contain only letters, spaces and punctuation."
        />

        <FreeText
          id="postcode"
          label="Postcode"
          errorMessage={errors?.postcode?.message ?? ""}
          formValue="postcode"
          required="Enter full UK postcode."
          patternValue={formRegex.lettersNumbersAndSpaces}
          patternError="Postcode must contain only letters, numbers and spaces."
        />

        <h2 className="govuk-label govuk-label--m">
          Applicant&apos;s UK phone number
        </h2>

        <FreeText
          id="mobile-number"
          errorMessage={errors?.ukMobileNumber?.message ?? ""}
          formValue="ukMobileNumber"
          required="Enter UK mobile number."
          patternValue={formRegex.numbersOnly}
          patternError="Full name must contain only letters and spaces."
        />

        <h2 className="govuk-label govuk-label--m">
          Applicant&apos;s UK email
        </h2>

        <FreeText
          id="email"
          errorMessage={errors?.ukEmail?.message ?? ""}
          formValue="ukEmail"
          required="Enter UK email address."
          patternValue={formRegex.emailAddress}
          patternError="Email must be in correct format."
        />

        <Button
          id="save-and-continue"
          type={ButtonType.DEFAULT}
          text="Save and continue"
          href="/travel-confirmation"
          handleClick={() => {}}
        />
      </form>
    </FormProvider>
  )
}

export default ApplicantTravelForm;
