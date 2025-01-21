/* eslint-disable @typescript-eslint/no-misused-promises */
import { useForm, SubmitHandler, FormProvider } from "react-hook-form"
import { useNavigate } from "react-router-dom";

import { formRegex, countryList } from "@/utils/helpers"
import Button from "@/components/button/button"
import FreeText from "@/components/freeText/freeText"
import Dropdown from "@/components/dropdown/dropdown";
import { ButtonType } from "@/utils/enums";

import { useAppDispatch } from "@/redux/hooks";
import { setCountryOfIssue, setPassportNumber } from "@/redux/applicantSlice";

type ApplicantSearchFormType  = {
  passportNumber: string
  countryOfIssue: string
}

const ApplicantSearchForm = () => {
  const navigate = useNavigate();

  const methods = useForm<ApplicantSearchFormType>({reValidateMode: 'onSubmit'})
  const { handleSubmit, formState: { errors } } = methods;

  const dispatch = useAppDispatch()
    const updateReduxStore = (applicantSearchData: ApplicantSearchFormType) => {
      dispatch(setPassportNumber(applicantSearchData.passportNumber))
      dispatch(setCountryOfIssue(applicantSearchData.countryOfIssue))
    }

  const onSubmit: SubmitHandler<ApplicantSearchFormType> = async (data) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      await fetch(`http://localhost:3005/dev/applicant-details?passportNumber=${data.passportNumber}&countryOfIssue=${data.countryOfIssue}`, {
          method: "GET",
          headers: myHeaders,
      })
      .then(() => {
        updateReduxStore(data)
        navigate("/applicant-results")
      })
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

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FreeText
          id="passport-number"
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
          hint="If you have more than one, use the nationality in the primary passport submitted by the applicant. Use the English spelling or the country code."
          options={countryList}
          errorMessage={errors?.countryOfIssue?.message ?? ""}
          formValue="countryOfIssue"
          required="Select a country."
        />

        <Button
          id="search"
          type={ButtonType.DEFAULT}
          text="Search"
          href="#"
          handleClick={() => {}}
        />
      </form>
    </FormProvider>
  )
}

export default ApplicantSearchForm;
