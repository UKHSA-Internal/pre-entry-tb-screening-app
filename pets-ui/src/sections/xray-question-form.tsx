import { useEffect, useRef } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import ErrorSummary from "@/components/errorSummary/errorSummary";
import Heading from "@/components/heading/heading";
import Radio from "@/components/radio/radio";
import SubmitButton from "@/components/submitButton/submitButton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setChestXrayTaken, setReasonXrayWasNotTaken } from "@/redux/radiologicalOutcomeSlice";
import { selectRadiologicalOutcome } from "@/redux/store";
import { ReduxRadiologicalOutcomeDetailsType } from "@/types";
import { ButtonType, RadioIsInline, YesOrNo } from "@/utils/enums";

const XrayQuestionForm = () => {
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
    dispatch(setChestXrayTaken(data.chestXrayTaken));

    if (data.chestXrayTaken === YesOrNo.YES) {
      dispatch(setReasonXrayWasNotTaken(""));
      navigate("/medical-summary");
    } else {
      navigate("/xray-not-required-reason");
    }
  };

  const errorsToShow = Object.keys(errors);
  const chestXrayTakenRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (location.hash) {
      const target = location.hash.substring(1);
      if (target == "chest-xray-taken") {
        chestXrayTakenRef.current?.scrollIntoView();
      }
    }
  }, [location]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {!!errors?.chestXrayTaken && <ErrorSummary errorsToShow={errorsToShow} errors={errors} />}
        <Heading level={1} size="l" title="Is an X-ray required?" />{" "}
        <div ref={chestXrayTakenRef}>
          <Radio
            id="chest-xray-taken"
            isInline={RadioIsInline.TRUE}
            answerOptions={["Yes", "No"]}
            sortAnswersAlphabetically={false}
            errorMessage={errors?.chestXrayTaken?.message ?? ""}
            formValue="chestXrayTaken"
            defaultValue={radiologicalData.chestXrayTaken}
            required="Select yes if X-ray is required"
            divStyle={{ marginTop: 40 }}
          />
        </div>
        <SubmitButton id="Continue" type={ButtonType.DEFAULT} text="Continue" />
      </form>
    </FormProvider>
  );
};

export default XrayQuestionForm;
