import { useEffect, useRef } from "react";
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import Checkbox from "@/components/checkbox/checkbox";
import DateTextInput from "@/components/dateTextInput/dateTextInput";
import ErrorSummary from "@/components/errorSummary/errorSummary";
import Heading from "@/components/heading/heading";
import Radio from "@/components/radio/radio";
import SubmitButton from "@/components/submitButton/submitButton";
import SummaryList from "@/components/summaryList/summaryList";
import TextArea from "@/components/textArea/textArea";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setMedicalScreeningDetails,
  setMedicalScreeningStatus,
} from "@/redux/medicalScreeningSlice";
import { selectApplicant, selectMedicalScreening } from "@/redux/store";
import { DateType, ReduxMedicalScreeningType } from "@/types";
import { ApplicationStatus, ButtonType, RadioIsInline } from "@/utils/enums";
import { calculateApplicantAge, validateDate } from "@/utils/helpers";

const MedicalScreeningForm = () => {
  const navigate = useNavigate();

  const applicantData = useAppSelector(selectApplicant);
  const applicantAge = calculateApplicantAge(applicantData.dateOfBirth);
  let applicantAgeInYears = 0;
  let ageToDisplay = "";
  if (typeof applicantAge == "string") {
    ageToDisplay = "Unknown";
  } else if (applicantAge.years > 0) {
    applicantAgeInYears = applicantAge.years;
    ageToDisplay = `${applicantAge.years} year${applicantAge.years != 1 ? "s" : ""} old`;
  } else {
    ageToDisplay = `${applicantAge.months} month${applicantAge.months != 1 ? "s" : ""} old`;
  }

  const medicalData = useAppSelector(selectMedicalScreening);
  const methods = useForm<ReduxMedicalScreeningType>({
    reValidateMode: "onSubmit",
    defaultValues: {
      completionDate: medicalData.completionDate,
      age: medicalData.age,
      tbSymptoms: medicalData.tbSymptoms,
      tbSymptomsList: medicalData.tbSymptomsList,
      otherSymptomsDetail: medicalData.otherSymptomsDetail,
      underElevenConditions: medicalData.underElevenConditions,
      underElevenConditionsDetail: medicalData.underElevenConditionsDetail,
      previousTb: medicalData.previousTb,
      previousTbDetail: medicalData.previousTbDetail,
      closeContactWithTb: medicalData.closeContactWithTb,
      closeContactWithTbDetail: medicalData.closeContactWithTbDetail,
      pregnant: medicalData.pregnant,
      menstrualPeriods: medicalData.menstrualPeriods,
      physicalExamNotes: medicalData.physicalExamNotes,
    },
  });
  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<ReduxMedicalScreeningType> = (medicalScreeningData) => {
    dispatch(
      setMedicalScreeningDetails({ ...medicalScreeningData, age: applicantAgeInYears.toString() }),
    );
    dispatch(setMedicalScreeningStatus(ApplicationStatus.IN_PROGRESS));
    navigate("/is-an-x-ray-required");
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
        {!!errorsToShow?.length && <ErrorSummary errorsToShow={errorsToShow} errors={errors} />}

        <Heading level={1} size="l" title="Record medical history and TB symptoms" />
        <SummaryList keyValuePairList={[{ key: "Visa applicant's age", value: ageToDisplay }]} />

        <div className="govuk-!-margin-bottom-2">
          <Controller
            name="completionDate"
            control={methods.control}
            defaultValue={{
              day: medicalData.completionDate.day,
              month: medicalData.completionDate.month,
              year: medicalData.completionDate.year,
            }}
            rules={{
              validate: (value: DateType) => validateDate(value, "completionDate"),
            }}
            render={({ field: { value, onChange } }) => (
              <DateTextInput
                heading="When did the medical screening take place?"
                hint="For example, 30 6 2025"
                value={value}
                setDateValue={onChange}
                id={"medical-screening-completion-date"}
                autocomplete={false}
                showTodayYesterdayLinks
                errorMessage={methods.formState.errors?.completionDate?.message ?? ""}
              />
            )}
          />
        </div>

        <div ref={tbSymptomsRef}>
          <Radio
            id="tb-symptoms"
            heading="Does the visa applicant have any pulmonary TB symptoms?"
            isInline={RadioIsInline.TRUE}
            answerOptions={["Yes", "No"]}
            sortAnswersAlphabetically={false}
            errorMessage={errors?.tbSymptoms?.message ?? ""}
            formValue="tbSymptoms"
            required="Select whether the visa applicant has any pulmonary TB symptoms"
            defaultValue={medicalData.tbSymptoms}
          />
        </div>

        <div ref={tbSymptomsListRef}>
          <Checkbox
            id="tb-symptoms-list"
            heading="Which symptoms does the visa applicant have?"
            hint="Select all that apply"
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
          />
        </div>

        <div ref={otherSymptomsDetailRef}>
          <TextArea
            id="other-symptoms-detail"
            heading="Give further details (optional)"
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
            heading="If the visa applicant is a child aged 11 or under, have they ever had:"
            hint="Select all that apply"
            answerOptions={[
              "Thoracic surgery",
              "Cyanosis",
              "Chronic respiratory disease",
              "Respiratory insufficiency that limits activity",
              "None of these",
            ]}
            exclusiveAnswerOptions={["Not applicable - applicant is aged 11 or over"]}
            sortAnswersAlphabetically={false}
            errorMessage={errors?.underElevenConditions?.message ?? ""}
            formValue="underElevenConditions"
            required={false}
          />
        </div>

        <div ref={underElevenConditionsDetailRef}>
          <TextArea
            id="under-eleven-conditions-detail"
            heading="Give further details (optional)"
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
            heading="Has the visa applicant ever had pulmonary TB?"
            isInline={RadioIsInline.TRUE}
            answerOptions={["Yes", "No"]}
            sortAnswersAlphabetically={false}
            errorMessage={errors?.previousTb?.message ?? ""}
            formValue="previousTb"
            required="Select whether the visa applicant has ever had pulmonary TB"
            defaultValue={medicalData.previousTb}
          />
        </div>

        <div ref={previousTbDetailRef}>
          <TextArea
            id="previous-tb-detail"
            heading="Give further details (optional)"
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
            heading="Has the visa applicant had close contact with a person with active pulmonary TB in the past year?"
            hint="For example, sharing an enclosed air space such as within household, for a prolonged period of at least several days"
            isInline={RadioIsInline.TRUE}
            answerOptions={["Yes", "No"]}
            sortAnswersAlphabetically={false}
            errorMessage={errors?.closeContactWithTb?.message ?? ""}
            formValue="closeContactWithTb"
            required="Select whether the visa applicant has had close contact with any person with active pulmonary TB within the past year"
            defaultValue={medicalData.closeContactWithTb}
          />
        </div>

        <div ref={closeContactWithTbDetailRef}>
          <TextArea
            id="close-contact-with-tb-detail"
            label="Give further details (optional)"
            errorMessage={errors?.closeContactWithTbDetail?.message ?? ""}
            formValue="closeContactWithTbDetail"
            required={false}
            rows={4}
            labelStyle={{ fontWeight: 700 }}
            defaultValue={medicalData.closeContactWithTbDetail}
          />
        </div>

        <div ref={pregnantRef}>
          <Radio
            id="pregnant"
            heading="Is the visa applicant pregnant?"
            headingSize="s"
            isInline={RadioIsInline.FALSE}
            answerOptions={["Yes", "No", "Do not know"]}
            exclusiveAnswerOptions={["Not applicable (the visa applicant is not female)"]}
            sortAnswersAlphabetically={false}
            errorMessage={errors?.pregnant?.message ?? ""}
            formValue="pregnant"
            required="Select whether the visa applicant is pregnant"
            defaultValue={medicalData.pregnant}
          />
        </div>

        <div ref={menstrualPeriodsRef}>
          <Radio
            id="menstrual-periods"
            heading="Does the visa applicant have menstrual periods?"
            headingSize="s"
            isInline={RadioIsInline.FALSE}
            answerOptions={["Yes", "No", "Do not know"]}
            exclusiveAnswerOptions={["Not applicable (the visa applicant is not female)"]}
            sortAnswersAlphabetically={false}
            errorMessage={errors?.menstrualPeriods?.message ?? ""}
            formValue="menstrualPeriods"
            required="Select whether the visa applicant has menstrual periods"
            defaultValue={medicalData.menstrualPeriods}
          />
        </div>

        <div ref={physicalExamNotesRef}>
          <TextArea
            id="physical-exam-notes"
            heading="Physical examination notes (optional)"
            hint="Include physical symptoms of TB observed during the examination"
            errorMessage={errors?.physicalExamNotes?.message ?? ""}
            formValue="physicalExamNotes"
            required={false}
            rows={4}
            defaultValue={medicalData.physicalExamNotes}
          />
        </div>

        <SubmitButton id="save-and-continue" class={ButtonClass.DEFAULT} text="Continue" />
      </form>
    </FormProvider>
  );
};

export default MedicalScreeningForm;
