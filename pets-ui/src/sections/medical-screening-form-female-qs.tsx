import { useEffect, useRef } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";

import ErrorSummary from "@/components/errorSummary/errorSummary";
import Heading from "@/components/heading/heading";
import Radio from "@/components/radio/radio";
import SubmitButton from "@/components/submitButton/submitButton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setMedicalScreeningStatus,
  setMenstrualPeriods,
  setPregnant,
} from "@/redux/medicalScreeningSlice";
import { selectMedicalScreening } from "@/redux/store";
import { ApplicationStatus, ButtonClass, RadioIsInline } from "@/utils/enums";
import { sendGoogleAnalyticsFormErrorEvent } from "@/utils/google-analytics-utils";

interface MedicalScreeningFemaleData {
  pregnant: string;
  menstrualPeriods: string;
}

const MedicalScreeningFormFemaleQs = () => {
  const navigate = useNavigate();

  const medicalData = useAppSelector(selectMedicalScreening);
  const methods = useForm<MedicalScreeningFemaleData>({
    reValidateMode: "onSubmit",
    defaultValues: {
      pregnant: medicalData.pregnant,
      menstrualPeriods: medicalData.menstrualPeriods,
    },
  });
  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<MedicalScreeningFemaleData> = (medicalScreeningData) => {
    dispatch(setPregnant(medicalScreeningData.pregnant));
    dispatch(setMenstrualPeriods(medicalScreeningData.menstrualPeriods));
    dispatch(setMedicalScreeningStatus(ApplicationStatus.IN_PROGRESS));
    navigate("/is-an-x-ray-required");
  };

  const errorsToShow = Object.keys(errors);
  useEffect(() => {
    if (errorsToShow.length > 0) {
      sendGoogleAnalyticsFormErrorEvent("Medical history: female", errorsToShow);
    }
  }, [errorsToShow]);

  // Required to scroll to the correct element when a change link on the summary page is clicked
  const location = useLocation();
  const pregnantRef = useRef<HTMLDivElement | null>(null);
  const menstrualPeriodsRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (location.hash) {
      const target = location.hash.substring(1);
      const refMap: { [key: string]: HTMLElement | null } = {
        pregnant: pregnantRef.current,
        "menstrual-periods": menstrualPeriodsRef.current,
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

        <Heading level={1} size="l" title="Medical history: female" />

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

        <SubmitButton id="continue" class={ButtonClass.DEFAULT} text="Continue" />
      </form>
    </FormProvider>
  );
};

export default MedicalScreeningFormFemaleQs;
