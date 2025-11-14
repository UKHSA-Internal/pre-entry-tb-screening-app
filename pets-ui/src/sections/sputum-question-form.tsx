import { useEffect, useRef } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import ErrorSummary from "@/components/errorSummary/errorSummary";
import Heading from "@/components/heading/heading";
import Radio from "@/components/radio/radio";
import SubmitButton from "@/components/submitButton/submitButton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setSputumDecisionRequired, setSputumDecisionStatus } from "@/redux/sputumDecisionSlice";
import { selectSputumDecision } from "@/redux/store";
import { ApplicationStatus, ButtonClass, RadioIsInline, YesOrNo } from "@/utils/enums";
import { sendGoogleAnalyticsFormErrorEvent } from "@/utils/helpers";

interface SputumDecisionFormData {
  isSputumRequired: YesOrNo;
}

const SputumQuestionForm = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const sputumDecisionData = useAppSelector(selectSputumDecision);

  const methods = useForm<SputumDecisionFormData>({
    reValidateMode: "onSubmit",
  });
  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<SputumDecisionFormData> = (data) => {
    dispatch(setSputumDecisionRequired(data.isSputumRequired));
    dispatch(setSputumDecisionStatus(ApplicationStatus.IN_PROGRESS));

    navigate("/check-sputum-decision-information");
  };

  const errorsToShow = Object.keys(errors);
  useEffect(() => {
    if (errorsToShow.length > 0) {
      sendGoogleAnalyticsFormErrorEvent("Is sputum collection required?", errorsToShow);
    }
  }, [errorsToShow]);

  const isSputumRequiredRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (location.hash) {
      const target = location.hash.substring(1);
      if (target == "sputum-required") {
        isSputumRequiredRef.current?.scrollIntoView();
      }
    }
  }, [location]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {!!errors?.isSputumRequired && <ErrorSummary errorsToShow={errorsToShow} errors={errors} />}
        <Heading level={1} size="l" title="Is sputum collection required?" />{" "}
        <div ref={isSputumRequiredRef}>
          <Radio
            id="sputum-required"
            isInline={RadioIsInline.TRUE}
            answerOptions={["Yes", "No"]}
            sortAnswersAlphabetically={false}
            errorMessage={errors?.isSputumRequired?.message ?? ""}
            formValue="isSputumRequired"
            defaultValue={sputumDecisionData.isSputumRequired}
            required="Select yes if sputum collection is required"
            divStyle={{ marginTop: 40 }}
          />
        </div>
        <SubmitButton id="Continue" class={ButtonClass.DEFAULT} text="Continue" />
      </form>
    </FormProvider>
  );
};

export default SputumQuestionForm;
