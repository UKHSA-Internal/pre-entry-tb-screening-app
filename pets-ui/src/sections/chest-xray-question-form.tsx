import { useEffect, useRef } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { ReduxChestXrayDetailsType } from "@/applicant";
import ErrorSummary from "@/components/errorSummary/errorSummary";
import Heading from "@/components/heading/heading";
import Radio from "@/components/radio/radio";
import SubmitButton from "@/components/submitButton/submitButton";
import {
  clearChestXrayNotTakenDetails,
  clearChestXrayTakenDetails,
  setChestXrayStatus,
  setChestXrayTaken,
} from "@/redux/chestXraySlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectChestXray } from "@/redux/store";
import { ApplicationStatus, ButtonType, RadioIsInline, YesOrNo } from "@/utils/enums";

const ChestXrayQuestionForm = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const chestXrayData = useAppSelector(selectChestXray);

  const methods = useForm<ReduxChestXrayDetailsType>({ reValidateMode: "onSubmit" });
  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<ReduxChestXrayDetailsType> = (data) => {
    dispatch(setChestXrayTaken(data.chestXrayTaken));
    dispatch(setChestXrayStatus(ApplicationStatus.IN_PROGRESS));

    if (data.chestXrayTaken === YesOrNo.YES) {
      dispatch(clearChestXrayNotTakenDetails());
      navigate("/chest-xray-upload");
    } else {
      dispatch(clearChestXrayTakenDetails());
      navigate("/chest-xray-not-taken");
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

        <Heading level={1} size="l" title="Select X-ray status" />
        <div ref={chestXrayTakenRef}>
          <Radio
            heading="Has the visa applicant had a chest X-ray?"
            id="chest-xray-taken"
            label="This would typically be the postero-anterior chest X-ray"
            isInline={RadioIsInline.TRUE}
            answerOptions={["Yes", "No"]}
            sortAnswersAlphabetically={false}
            errorMessage={errors?.chestXrayTaken?.message ?? ""}
            formValue="chestXrayTaken"
            defaultValue={chestXrayData.chestXrayTaken}
            required="Select yes if the visa applicant has had a chest X-ray or no if they have not"
            divStyle={{ marginTop: 40 }}
          />
        </div>
        <SubmitButton id="Continue" type={ButtonType.DEFAULT} text="Continue" />
      </form>
    </FormProvider>
  );
};

export default ChestXrayQuestionForm;
