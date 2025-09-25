import { useEffect, useRef } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import ErrorSummary from "@/components/errorSummary/errorSummary";
import Heading from "@/components/heading/heading";
import Radio from "@/components/radio/radio";
import SubmitButton from "@/components/submitButton/submitButton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setReasonXrayWasNotTaken } from "@/redux/radiologicalOutcomeSlice";
import { selectRadiologicalOutcome } from "@/redux/store";
import { ReduxRadiologicalOutcomeDetailsType } from "@/types";
import { ButtonType, RadioIsInline } from "@/utils/enums";

const XrayNotRequiredReasonForm = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const radiologicalData = useAppSelector(selectRadiologicalOutcome);

  const methods = useForm<ReduxRadiologicalOutcomeDetailsType>({
    reValidateMode: "onSubmit",
  });
  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<ReduxRadiologicalOutcomeDetailsType> = (data) => {
    dispatch(setReasonXrayWasNotTaken(data.reasonXrayWasNotTaken));
    navigate("/medical-summary");
  };

  const errorsToShow = Object.keys(errors);
  const reasonXrayWasNotTakenRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (location.hash) {
      const target = location.hash.substring(1);
      if (target == "reason-xray-not-taken") {
        reasonXrayWasNotTakenRef.current?.scrollIntoView();
      }
    }
  }, [location]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {!!errors?.reasonXrayWasNotTaken && (
          <ErrorSummary errorsToShow={errorsToShow} errors={errors} />
        )}
        <Heading level={1} size="l" title="Reason X-ray is not required?" />
        <div ref={reasonXrayWasNotTakenRef}>
          <Radio
            id="reason-xray-not-taken"
            isInline={RadioIsInline.FALSE}
            answerOptions={["Child (under 11 years)", "Pregnant", "Other"]}
            sortAnswersAlphabetically={false}
            errorMessage={errors?.reasonXrayWasNotTaken?.message ?? ""}
            formValue="reasonXrayWasNotTaken"
            defaultValue={radiologicalData.reasonXrayWasNotTaken}
            required="Select a reason why X-ray is not required"
            divStyle={{ marginTop: 40 }}
          />
        </div>
        <SubmitButton id="Continue" type={ButtonType.DEFAULT} text="Continue" />
      </form>
    </FormProvider>
  );
};

export default XrayNotRequiredReasonForm;
