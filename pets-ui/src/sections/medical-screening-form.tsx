import { useEffect, useRef } from "react";
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";

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
  setCloseContactWithTb,
  setCloseContactWithTbDetail,
  setMedicalScreeningCompletionDate,
  setMedicalScreeningStatus,
  setOtherSymptomsDetail,
  setPhysicalExamNotes,
  setPreviousTb,
  setPreviousTbDetail,
  setTbSymptoms,
  setTbSymptomsList,
} from "@/redux/medicalScreeningSlice";
import { selectApplicant, selectMedicalScreening } from "@/redux/store";
import { DateType } from "@/types";
import { ApplicationStatus, ButtonClass, RadioIsInline } from "@/utils/enums";
import { sendGoogleAnalyticsFormErrorEvent } from "@/utils/google-analytics-utils";
import {
  calculateApplicantAge,
  validateMedicalScreeningDate,
  validateTbSymptoms,
} from "@/utils/helpers";

interface MedicalScreeningInitialData {
  completionDate: DateType;
  tbSymptoms: string;
  tbSymptomsList: string[];
  otherSymptomsDetail: string;
  previousTb: string;
  previousTbDetail: string;
  closeContactWithTb: string;
  closeContactWithTbDetail: string;
  physicalExamNotes: string;
}

const MedicalScreeningForm = () => {
  const navigate = useNavigate();

  const applicantData = useAppSelector(selectApplicant);
  const applicantAge = calculateApplicantAge(applicantData.dateOfBirth);

  const medicalData = useAppSelector(selectMedicalScreening);
  const methods = useForm<MedicalScreeningInitialData>({
    reValidateMode: "onSubmit",
    defaultValues: {
      completionDate: medicalData.completionDate,
      tbSymptoms: medicalData.tbSymptoms,
      tbSymptomsList: medicalData.tbSymptomsList,
      otherSymptomsDetail: medicalData.otherSymptomsDetail,
      previousTb: medicalData.previousTb,
      previousTbDetail: medicalData.previousTbDetail,
      closeContactWithTb: medicalData.closeContactWithTb,
      closeContactWithTbDetail: medicalData.closeContactWithTbDetail,
      physicalExamNotes: medicalData.physicalExamNotes,
    },
  });
  const {
    handleSubmit,
    setError,
    formState: { errors },
  } = methods;

  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<MedicalScreeningInitialData> = (medicalScreeningData) => {
    const validationResult = validateTbSymptoms(
      medicalScreeningData.tbSymptomsList,
      medicalScreeningData.tbSymptoms,
    );
    if (validationResult !== true) {
      setError("tbSymptomsList", { type: "custom", message: validationResult });
      return;
    }

    dispatch(setMedicalScreeningCompletionDate(medicalScreeningData.completionDate));
    dispatch(setTbSymptoms(medicalScreeningData.tbSymptoms));
    dispatch(setTbSymptomsList(medicalScreeningData.tbSymptomsList));
    dispatch(setOtherSymptomsDetail(medicalScreeningData.otherSymptomsDetail));
    dispatch(setPreviousTb(medicalScreeningData.previousTb));
    dispatch(setPreviousTbDetail(medicalScreeningData.previousTbDetail));
    dispatch(setCloseContactWithTb(medicalScreeningData.closeContactWithTb));
    dispatch(setCloseContactWithTbDetail(medicalScreeningData.closeContactWithTbDetail));
    dispatch(setPhysicalExamNotes(medicalScreeningData.physicalExamNotes));
    dispatch(setMedicalScreeningStatus(ApplicationStatus.IN_PROGRESS));

    if (typeof applicantAge.ageInYears == "number" && applicantAge.ageInYears < 11) {
      navigate("/medical-history-under-11-years-old");
    } else if (applicantData.sex == "Female") {
      navigate("/medical-history-female");
    } else {
      navigate("/is-an-x-ray-required");
    }
  };

  const errorsToShow = Object.keys(errors);
  useEffect(() => {
    if (errorsToShow.length > 0) {
      sendGoogleAnalyticsFormErrorEvent("Record medical history and TB symptoms", errorsToShow);
    }
  }, [errorsToShow]);

  // Required to scroll to the correct element when a change link on the summary page is clicked
  const location = useLocation();
  const tbSymptomsRef = useRef<HTMLDivElement | null>(null);
  const tbSymptomsListRef = useRef<HTMLDivElement | null>(null);
  const otherSymptomsDetailRef = useRef<HTMLDivElement | null>(null);
  const previousTbRef = useRef<HTMLDivElement | null>(null);
  const previousTbDetailRef = useRef<HTMLDivElement | null>(null);
  const closeContactWithTbRef = useRef<HTMLDivElement | null>(null);
  const closeContactWithTbDetailRef = useRef<HTMLDivElement | null>(null);
  const physicalExamNotesRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (location.hash) {
      const target = location.hash.substring(1);
      const refMap: { [key: string]: HTMLElement | null } = {
        "tb-symptoms": tbSymptomsRef.current,
        "tb-symptoms-list": tbSymptomsListRef.current,
        "other-symptoms-detail": otherSymptomsDetailRef.current,
        "previous-tb": previousTbRef.current,
        "previous-tb-detail": previousTbDetailRef.current,
        "close-contact-with-tb": closeContactWithTbRef.current,
        "close-contact-with-tb-detail": closeContactWithTbDetailRef.current,
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
        <SummaryList
          keyValuePairList={[{ key: "Visa applicant's age", value: applicantAge.ageToDisplay }]}
        />

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
              validate: (value: DateType) => validateMedicalScreeningDate(value),
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
            heading="Does the visa applicant have any symptoms of pulmonary TB?"
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
            hint="For example, sharing an enclosed air space such as within a household, for a prolonged period of at least several days"
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
            heading="Give further details (optional)"
            errorMessage={errors?.closeContactWithTbDetail?.message ?? ""}
            formValue="closeContactWithTbDetail"
            required={false}
            rows={4}
            defaultValue={medicalData.closeContactWithTbDetail}
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

        <SubmitButton id="continue" class={ButtonClass.DEFAULT} text="Continue" />
      </form>
    </FormProvider>
  );
};

export default MedicalScreeningForm;
