import { useEffect, useRef } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import ErrorSummary from "@/components/errorSummary/errorSummary";
import Heading from "@/components/heading/heading";
import Radio from "@/components/radio/radio";
import SubmitButton from "@/components/submitButton/submitButton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setChestXrayTaken, setReasonXrayNotRequired } from "@/redux/medicalScreeningSlice";
import { selectMedicalScreening } from "@/redux/store";
import { ReduxMedicalScreeningType } from "@/types";
import { ButtonType, RadioIsInline, YesOrNo } from "@/utils/enums";
import { sendGoogleAnalyticsFormErrorEvent } from "@/utils/helpers";
const ChestXrayQuestionForm = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const medicalData = useAppSelector(selectMedicalScreening);

  const methods = useForm<ReduxMedicalScreeningType>({
    reValidateMode: "onSubmit",
  });
  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<ReduxMedicalScreeningType> = (data) => {
    const xrayTakenValue = data.chestXrayTaken || YesOrNo.NULL;
    dispatch(setChestXrayTaken(xrayTakenValue));

    if (xrayTakenValue === YesOrNo.YES) {
      dispatch(setReasonXrayNotRequired(""));
      navigate("/check-medical-history-and-tb-symptoms");
    } else {
      navigate("/reason-x-ray-not-required");
    }
  };

  const errorsToShow = Object.keys(errors);
  useEffect(() => {
    if (errorsToShow.length > 0) {
      sendGoogleAnalyticsFormErrorEvent("Is an X-ray required?", errorsToShow);
    }
  }, [errorsToShow]);

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
            errorMessage={(errors?.chestXrayTaken?.message as string) ?? ""}
            formValue="chestXrayTaken"
            defaultValue={medicalData.chestXrayTaken || YesOrNo.NULL}
            required="Select yes if an X-ray is required"
            divStyle={{ marginTop: 40 }}
          />
        </div>
        <SubmitButton id="Continue" type={ButtonType.DEFAULT} text="Continue" />
      </form>
    </FormProvider>
  );
};

export default ChestXrayQuestionForm;
