import { useEffect, useRef } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import ErrorSummary from "@/components/errorSummary/errorSummary";
import Heading from "@/components/heading/heading";
import Radio from "@/components/radio/radio";
import SubmitButton from "@/components/submitButton/submitButton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setXrayResult } from "@/redux/radiologicalOutcomeSlice";
import { selectRadiologicalOutcome } from "@/redux/store";
import { ReduxRadiologicalOutcomeDetailsType } from "@/types";
import { ButtonClass, RadioIsInline } from "@/utils/enums";

const ChestXrayOutcomeForm = () => {
  const radiologicalOutcomeData = useAppSelector(selectRadiologicalOutcome);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const methods = useForm<ReduxRadiologicalOutcomeDetailsType>({ reValidateMode: "onSubmit" });
  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<ReduxRadiologicalOutcomeDetailsType> = (data) => {
    dispatch(setXrayResult(data.xrayResult));
    navigate("/enter-x-ray-findings");
  };

  const errorsToShow = Object.keys(errors);

  // Required to scroll to the correct element when a change link on the summary page is clicked
  const location = useLocation();
  const xrayResult = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (location.hash) {
      const target = location.hash.substring(1);
      const refMap: { [key: string]: HTMLElement | null } = {
        "xray-result": xrayResult.current,
      };
      const targetRef = refMap[target];
      if (targetRef) targetRef.scrollIntoView();
    }
  }, [location]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {!!errorsToShow?.length && <ErrorSummary errorsToShow={errorsToShow} errors={errors} />}

        <Heading level={1} size="l" title="Chest X-ray results" />

        <div ref={xrayResult}>
          <Radio
            id="xray-result"
            isInline={RadioIsInline.FALSE}
            answerOptions={["Chest X-ray normal", "Non-TB abnormality", "Old or active TB"]}
            sortAnswersAlphabetically={false}
            errorMessage={errors?.xrayResult?.message ?? ""}
            formValue="xrayResult"
            required="Select radiological outcome"
            defaultValue={radiologicalOutcomeData.xrayResult}
            divStyle={{ marginTop: 40 }}
          />
        </div>

        <SubmitButton id="save-and-continue" class={ButtonClass.DEFAULT} text="Continue" />
      </form>
    </FormProvider>
  );
};

export default ChestXrayOutcomeForm;
