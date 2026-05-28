import { useEffect, useRef, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate, useSearchParams } from "react-router";

import { putSputumRequirement } from "@/api/api";
import ErrorSummary from "@/components/errorSummary/errorSummary";
import Heading from "@/components/heading/heading";
import Radio from "@/components/radio/radio";
import Spinner from "@/components/spinner/spinner";
import SubmitButton from "@/components/submitButton/submitButton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setSputumDecisionRequired, setSputumDecisionStatus } from "@/redux/sputumDecisionSlice";
import { selectApplication, selectSputumDecision, selectUserDetails } from "@/redux/store";
import { ButtonClass, RadioIsInline, TaskStatus, YesOrNo } from "@/utils/enums";
import { sendGoogleAnalyticsFormErrorEvent } from "@/utils/google-analytics-utils";

interface SputumDecisionFormData {
  isSputumRequired: YesOrNo;
}

const SputumQuestionForm = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromParam = searchParams.get("from");
  const sputumDecisionData = useAppSelector(selectSputumDecision);
  const applicationData = useAppSelector(selectApplication);
  const userData = useAppSelector(selectUserDetails);
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<SputumDecisionFormData>({
    reValidateMode: "onSubmit",
    shouldFocusError: false,
  });
  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<SputumDecisionFormData> = async (data) => {
    dispatch(setSputumDecisionRequired(data.isSputumRequired));
    if (
      userData.isSuperUser &&
      sputumDecisionData.status === TaskStatus.COMPLETE &&
      applicationData.applicationId
    ) {
      setIsLoading(true);
      try {
        await putSputumRequirement(applicationData.applicationId, {
          sputumRequired: data.isSputumRequired,
        });

        if (fromParam === "/check-sputum-decision-information") {
          navigate("/check-sputum-decision-information");
        } else {
          navigate("/tb-certificate-summary");
        }
      } catch (error) {
        console.error(error);
        navigate("/sorry-there-is-problem-with-service");
      }
    } else {
      dispatch(setSputumDecisionStatus(TaskStatus.IN_PROGRESS));
      navigate("/check-sputum-decision-information");
    }
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
      {isLoading && <Spinner />}

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
