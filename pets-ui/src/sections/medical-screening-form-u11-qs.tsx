import { useEffect, useRef } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";

import Checkbox from "@/components/checkbox/checkbox";
import ErrorSummary from "@/components/errorSummary/errorSummary";
import Heading from "@/components/heading/heading";
import SubmitButton from "@/components/submitButton/submitButton";
import TextArea from "@/components/textArea/textArea";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setMedicalScreeningStatus,
  setUnderElevenConditions,
  setUnderElevenConditionsDetail,
} from "@/redux/medicalScreeningSlice";
import { selectApplicant, selectMedicalScreening } from "@/redux/store";
import { ApplicationStatus, ButtonClass } from "@/utils/enums";
import { sendGoogleAnalyticsFormErrorEvent } from "@/utils/google-analytics-utils";

interface MedicalScreeningU11Data {
  underElevenConditions: string[];
  underElevenConditionsDetail: string;
}

const MedicalScreeningFormU11Qs = () => {
  const navigate = useNavigate();

  const applicantData = useAppSelector(selectApplicant);

  const medicalData = useAppSelector(selectMedicalScreening);
  const methods = useForm<MedicalScreeningU11Data>({
    reValidateMode: "onSubmit",
    defaultValues: {
      underElevenConditions: medicalData.underElevenConditions,
      underElevenConditionsDetail: medicalData.underElevenConditionsDetail,
    },
  });
  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<MedicalScreeningU11Data> = (medicalScreeningData) => {
    dispatch(setUnderElevenConditions(medicalScreeningData.underElevenConditions));
    dispatch(setUnderElevenConditionsDetail(medicalScreeningData.underElevenConditionsDetail));
    dispatch(setMedicalScreeningStatus(ApplicationStatus.IN_PROGRESS));

    if (applicantData.sex == "Female") {
      navigate("/medical-history-female");
    } else {
      navigate("/is-an-x-ray-required");
    }
  };

  const errorsToShow = Object.keys(errors);
  useEffect(() => {
    if (errorsToShow.length > 0) {
      sendGoogleAnalyticsFormErrorEvent("Medical history: under 11 years old", errorsToShow);
    }
  }, [errorsToShow]);

  // Required to scroll to the correct element when a change link on the summary page is clicked
  const location = useLocation();
  const underElevenConditionsRef = useRef<HTMLDivElement | null>(null);
  const underElevenConditionsDetailRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (location.hash) {
      const target = location.hash.substring(1);
      const refMap: { [key: string]: HTMLElement | null } = {
        "under-eleven-conditions": underElevenConditionsRef.current,
        "under-eleven-conditions-detail": underElevenConditionsDetailRef.current,
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

        <Heading level={1} size="l" title="Medical history: under 11 years old" />

        <div ref={underElevenConditionsRef}>
          <Checkbox
            id="under-eleven-conditions"
            heading="Has the visa applicant ever had:"
            hint="Select all that apply"
            answerOptions={[
              "Thoracic surgery",
              "Cyanosis",
              "Chronic respiratory disease",
              "Respiratory insufficiency that limits activity",
            ]}
            exclusiveAnswerOptions={["None of these"]}
            sortAnswersAlphabetically={false}
            errorMessage={errors?.underElevenConditions?.message ?? ""}
            formValue="underElevenConditions"
            required={`Select all that apply, or select "None of these"`}
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

        <SubmitButton id="continue" class={ButtonClass.DEFAULT} text="Continue" />
      </form>
    </FormProvider>
  );
};

export default MedicalScreeningFormU11Qs;
