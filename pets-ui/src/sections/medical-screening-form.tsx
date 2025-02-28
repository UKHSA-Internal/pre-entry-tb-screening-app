import { useEffect, useRef } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { MedicalScreeningType } from "@/applicant";
import Button from "@/components/button/button";
import Checkbox from "@/components/checkbox/checkbox";
import ErrorDisplay from "@/components/errorSummary/errorSummary";
import FreeText from "@/components/freeText/freeText";
import Radio from "@/components/radio/radio";
import TextArea from "@/components/textArea/textArea";
import { selectApplicant } from "@/redux/applicantSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectMedicalScreening, setMedicalScreeningDetails } from "@/redux/medicalScreeningSlice";
import { ButtonType, RadioIsInline } from "@/utils/enums";
import { formRegex } from "@/utils/helpers";

const MedicalScreeningForm = () => {
  const navigate = useNavigate();

  const methods = useForm<MedicalScreeningType>({ reValidateMode: "onSubmit" });
  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const applicantData = useAppSelector(selectApplicant);
  const medicalData = useAppSelector(selectMedicalScreening);
  const dispatch = useAppDispatch();
  const updateReduxStore = (medicalScreeningData: MedicalScreeningType) => {
    dispatch(setMedicalScreeningDetails(medicalScreeningData));
  };

  const onSubmit: SubmitHandler<MedicalScreeningType> = (data) => {
    updateReduxStore(data);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // TO DO: post medical screening info using application service
    navigate("/medical-summary");
  };

  const errorsToShow = Object.keys(errors);

  // Required to scroll to the correct element when a change link on the summary page is clicked
  const location = useLocation();
  const ageRef = useRef<HTMLDivElement | null>(null);
  const tbSymptomsRef = useRef<HTMLDivElement | null>(null);
  const tbSymptomsListRef = useRef<HTMLDivElement | null>(null);
  const otherSymptomsDetailRef = useRef<HTMLDivElement | null>(null);
  const underElevenConditionsRef = useRef<HTMLDivElement | null>(null);
  const underElevenConditionsDetailRef = useRef<HTMLDivElement | null>(null);
  const previousTbRef = useRef<HTMLDivElement | null>(null);
  const previousTbDetailRef = useRef<HTMLDivElement | null>(null);
  const closeContactWithTbRef = useRef<HTMLDivElement | null>(null);
  const closeContactWithTbDetailRef = useRef<HTMLDivElement | null>(null);
  const pregnantRef = useRef<HTMLDivElement | null>(null);
  const menstrualPeriodsRef = useRef<HTMLDivElement | null>(null);
  const physicalExamNotesRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (location.hash) {
      const target = location.hash.substring(1);
      const refMap: { [key: string]: HTMLElement | null } = {
        age: ageRef.current,
        "tb-symptoms": tbSymptomsRef.current,
        "tb-symptoms-list": tbSymptomsListRef.current,
        "other-symptoms-detail": otherSymptomsDetailRef.current,
        "under-eleven-conditions": underElevenConditionsRef.current,
        "under-eleven-conditions-detail": underElevenConditionsDetailRef.current,
        "previous-tb": previousTbRef.current,
        "previous-tb-detail": previousTbDetailRef.current,
        "close-contact-with-tb": closeContactWithTbRef.current,
        "close-contact-with-tb-detail": closeContactWithTbDetailRef.current,
        pregnant: pregnantRef.current,
        "menstrual-periods": menstrualPeriodsRef.current,
        "physical-exam-notes": physicalExamNotesRef.current,
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
        {!!errorsToShow?.length && <ErrorDisplay errorsToShow={errorsToShow} errors={errors} />}

        <div>
          <dl className="govuk-summary-list">
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Name</dt>
              <dd className="govuk-summary-list__value">{applicantData.fullName}</dd>
            </div>
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Date of Birth</dt>
              <dd className="govuk-summary-list__value">
                {applicantData.dateOfBirth.day}/{applicantData.dateOfBirth.month}/
                {applicantData.dateOfBirth.year}
              </dd>
            </div>
            <div className="govuk-summary-list__row">
              <dt className="govuk-summary-list__key">Passport Number</dt>
              <dd className="govuk-summary-list__value">{applicantData.passportNumber}</dd>
            </div>
          </dl>
        </div>

        <div ref={ageRef}>
          <FreeText
            id="age"
            label="Applicant Age"
            errorMessage={errors?.age?.message ?? ""}
            formValue="age"
            required="Enter applicant's age in years."
            patternValue={formRegex.numbersOnly}
            patternError="Age must be a number."
            inputWidth={3}
            suffixText="years"
            defaultValue={medicalData.age}
          />
        </div>

        <div ref={tbSymptomsRef}>
          <Radio
            id="tb-symptoms"
            legend="Does the applicant have any TB symptoms?"
            isInline={RadioIsInline.TRUE}
            answerOptions={["Yes", "No"]}
            sortAnswersAlphabetically={false}
            errorMessage={errors?.tbSymptoms?.message ?? ""}
            formValue="tbSymptoms"
            required="Select whether the applicant has any TB symptoms."
            defaultValue={medicalData.tbSymptoms}
          />
        </div>

        <div ref={tbSymptomsListRef}>
          <Checkbox
            id="tb-symptoms-list"
            legend="If yes, select which symptoms"
            answerOptions={[
              "Cough",
              "Night sweats",
              "Haemoptysis (coughing up blood)",
              "Weight loss",
              "Fever",
              "Other symptoms",
            ]}
            sortAnswersAlphabetically={false}
            errorMessage={errors?.tbSymptomsList?.message ?? ""}
            formValue="tbSymptomsList"
            required={false}
            defaultValue={medicalData.tbSymptomsList}
          />
        </div>

        <div ref={otherSymptomsDetailRef}>
          <TextArea
            id="other-symptoms-detail"
            label='If you have selected "Other symptoms", list these'
            errorMessage={errors?.otherSymptomsDetail?.message ?? ""}
            formValue="otherSymptomsDetail"
            required={false}
            rows={4}
            defaultValue={medicalData.otherSymptomsDetail}
          />
        </div>

        <div ref={underElevenConditionsRef}>
          <Checkbox
            id="under-eleven-conditions"
            legend="If the applicant is a child aged under 11, have they ever had:"
            answerOptions={[
              "Thoracic surgery",
              "Cyanosis",
              "Chronic respiratory disease",
              "Respiratory insufficiency that limits activity",
            ]}
            exclusiveAnswerOptions={[
              "None of these",
              "Not applicable - applicant is aged 11 or over",
            ]}
            sortAnswersAlphabetically={false}
            errorMessage={errors?.underElevenConditions?.message ?? ""}
            formValue="underElevenConditions"
            required={false}
            defaultValue={medicalData.underElevenConditions}
          />
        </div>

        <div ref={underElevenConditionsDetailRef}>
          <TextArea
            id="under-eleven-conditions-detail"
            label="You can give details of the procedure or condition"
            errorMessage={errors?.underElevenConditionsDetail?.message ?? ""}
            formValue="underElevenConditionsDetail"
            required={false}
            rows={4}
            defaultValue={medicalData.underElevenConditionsDetail}
          />
        </div>

        <div ref={previousTbRef}>
          <Radio
            id="previous-tb"
            legend="Has the applicant ever had tuberculosis?"
            isInline={RadioIsInline.TRUE}
            answerOptions={["Yes", "No"]}
            sortAnswersAlphabetically={false}
            errorMessage={errors?.previousTb?.message ?? ""}
            formValue="previousTb"
            required="Select whether the applicant has ever had tuberculosis."
            defaultValue={medicalData.previousTb}
          />
        </div>

        <div ref={previousTbDetailRef}>
          <TextArea
            id="previous-tb-detail"
            label="If yes, give details"
            errorMessage={errors?.previousTbDetail?.message ?? ""}
            formValue="previousTbDetail"
            required={false}
            rows={4}
            defaultValue={medicalData.previousTbDetail}
          />
        </div>

        <div ref={closeContactWithTbRef}>
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
            defaultValue={medicalData.closeContactWithTb}
          />
        </div>

        <div ref={closeContactWithTbDetailRef}>
          <TextArea
            id="close-contact-with-tb-detail"
            label="If yes, give details"
            errorMessage={errors?.closeContactWithTbDetail?.message ?? ""}
            formValue="closeContactWithTbDetail"
            required={false}
            rows={4}
            defaultValue={medicalData.closeContactWithTbDetail}
          />
        </div>

        <div ref={pregnantRef}>
          <Radio
            id="pregnant"
            legend="Is the applicant pregnant?"
            isInline={RadioIsInline.FALSE}
            answerOptions={["Yes", "No", "Don't know", "N/A"]}
            sortAnswersAlphabetically={false}
            errorMessage={errors?.pregnant?.message ?? ""}
            formValue="pregnant"
            required="Select whether the applicant is pregnant."
            defaultValue={medicalData.pregnant}
          />
        </div>

        <div ref={menstrualPeriodsRef}>
          <Radio
            id="menstrual-periods"
            legend="Does the applicant have menstrual periods?"
            isInline={RadioIsInline.FALSE}
            answerOptions={["Yes", "No", "N/A"]}
            sortAnswersAlphabetically={false}
            errorMessage={errors?.menstrualPeriods?.message ?? ""}
            formValue="menstrualPeriods"
            required="Select whether the applicant has menstrual periods."
            defaultValue={medicalData.menstrualPeriods}
          />
        </div>

        <div ref={physicalExamNotesRef}>
          <TextArea
            id="physical-exam-notes"
            label="Physical examination notes"
            errorMessage={errors?.physicalExamNotes?.message ?? ""}
            formValue="physicalExamNotes"
            required={false}
            rows={4}
            defaultValue={medicalData.physicalExamNotes}
          />
        </div>

        <Button
          id="save-and-continue"
          type={ButtonType.DEFAULT}
          text="Save and continue"
          href="/medical-summary"
          handleClick={() => {}}
        />
      </form>
    </FormProvider>
  );
};

export default MedicalScreeningForm;
