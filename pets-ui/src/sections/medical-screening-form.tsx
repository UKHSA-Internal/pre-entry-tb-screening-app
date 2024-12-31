/* eslint-disable @typescript-eslint/no-misused-promises */
import { useForm, SubmitHandler, FormProvider } from "react-hook-form"
import { useNavigate } from "react-router-dom";
import { 
  attributeToComponentId, 
  formRegex, 
} from "@/utils/helpers"

import Button from "@/components/button/button"
import FreeText from "@/components/freeText/freeText"
import Radio from "@/components/radio/radio";
import TextArea from "@/components/textArea/textArea";
import { ButtonType, RadioIsInline } from "@/utils/enums";

// import { useAppDispatch } from "@/redux/hooks";
// import { 
//   setFullName, 
// } from "@/redux/applicantSlice";

const MedicalScreeningForm = () => {
  const navigate = useNavigate();

  const methods = useForm<MedicalScreeningType>({reValidateMode: 'onSubmit'})
  const { handleSubmit, formState: { errors } } = methods;

  // const dispatch = useAppDispatch()
  // const updateReduxStore = (applicantData: ApplicantDetailsType) => {
  //   dispatch(setFullName(applicantData.fullName))
  // }

  const onSubmit: SubmitHandler<MedicalScreeningType> = (data) => {
    try {
      console.log(data) // updateReduxStore(data)
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      // await fetch("http://localhost:3005/dev/register-applicant", {
      //     method: "POST",
      //     body: JSON.stringify(data),
      //     headers: myHeaders,
      // })
      navigate("/medical-confirmation")
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

        <div>
          <dl className="govuk-summary-list">
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">
                Name
              </dt>
              <dd className="govuk-summary-list__value">
                APPLICANT NAME
              </dd>
            </div>
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">
                Date of Birth
              </dt>
              <dd className="govuk-summary-list__value">
                APPLICANT DOB
              </dd>
            </div>
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">
                Passport Number
              </dt>
              <dd className="govuk-summary-list__value">
                APPLICANT PASSPORT NUMBER
              </dd>
            </div>
          </dl>
        </div>
        
        <FreeText
          id="age"
          label="Applicant Age"
          errorMessage={errors?.age?.message ?? ""}
          formValue="age"
          required="Enter applicant's age in years."
          patternValue={formRegex.numbersOnly}
          patternError="Age must be a number."
          inputWidth={2}
          suffixText="years"
        />

        <Radio
          id="tb-symptoms"
          legend="Does the applicant have any TB symptoms?"
          isInline={RadioIsInline.TRUE}
          answerOptions={["Yes", "No"]}
          sortAnswersAlphabetically={false}
          errorMessage={errors?.tbSymptoms?.message ?? ""}
          formValue="tbSymptoms"
          required="Select whether the applicant has any TB symptoms."
        />

        <TextArea
          id="other-symptoms-detail"
          label='If you have selected "Other symptoms", list these'
          errorMessage={errors?.otherSymptomsDetail?.message ?? ""}
          formValue="otherSymptomsDetail"
          required={false}
          rows={4}
        />

        <TextArea
          id="under-eleven-conditions-detail"
          label='You can give details of the procedure or condition'
          errorMessage={errors?.underElevenConditionsDetail?.message ?? ""}
          formValue="underElevenConditionsDetail"
          required={false}
          rows={4}
        />

        <Radio
          id="previous-tb"
          legend="Has the applicant ever had tuberculosis?"
          isInline={RadioIsInline.TRUE}
          answerOptions={["Yes", "No"]}
          sortAnswersAlphabetically={false}
          errorMessage={errors?.previousTb?.message ?? ""}
          formValue="previousTb"
          required="Select whether the applicant has ever had tuberculosis."
        />

        <TextArea
          id="previous-tb-detail"
          label='If yes, give details'
          errorMessage={errors?.previousTbDetail?.message ?? ""}
          formValue="previousTbDetail"
          required={false}
          rows={4}
        />

        <Radio
          id="close-contact-with-tb"
          legend="Has the applicant had close contact with any person with active pulmonary tuberculosis within the past year?"
          hint="This might be sharing the same enclosed air space or household or other enclosed environment for a prolonged period, such as days or weeks"
          isInline={RadioIsInline.TRUE}
          answerOptions={["Yes", "No"]}
          sortAnswersAlphabetically={false}
          errorMessage={errors?.closeContactWithTb?.message ?? ""}
          formValue="closeContactWithTb"
          required="Select whether the applicant has had close contact with any person with active pulmonary tuberculosis within the past year."
        />

        <TextArea
          id="close-contact-with-tb-detail"
          label='If yes, give details'
          errorMessage={errors?.closeContactWithTbDetail?.message ?? ""}
          formValue="closeContactWithTbDetail"
          required={false}
          rows={4}
        />

        <Radio
          id="pregnant"
          legend="Is the applicant pregnant?"
          isInline={RadioIsInline.FALSE}
          answerOptions={["Yes", "No", "Don't know", "N/A"]}
          sortAnswersAlphabetically={false}
          errorMessage={errors?.pregnant?.message ?? ""}
          formValue="pregnant"
          required="Select whether the applicant is pregnant."
        />

        <Radio
          id="menstrual-periods"
          legend="Does the applicant have menstrual periods?"
          isInline={RadioIsInline.FALSE}
          answerOptions={["Yes", "No", "N/A"]}
          sortAnswersAlphabetically={false}
          errorMessage={errors?.menstrualPeriods?.message ?? ""}
          formValue="menstrualPeriods"
          required="Select whether the applicant has menstrual periods."
        />

        <TextArea
          id="physical-exam-notes"
          label='Physical examination notes'
          errorMessage={errors?.physicalExamNotes?.message ?? ""}
          formValue="physicalExamNotes"
          required={false}
          rows={4}
        />

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

export default MedicalScreeningForm;
