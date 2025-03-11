import { useRef } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { ReduxChestXrayDetailsType } from "@/applicant";
import ApplicantDataHeader from "@/components/applicantDataHeader/applicantDataHeader";
import Button from "@/components/button/button";
import ErrorDisplay from "@/components/errorSummary/errorSummary";
import Heading from "@/components/heading/heading";
import Radio from "@/components/radio/radio";
import { selectApplicant } from "@/redux/applicantSlice";
import { selectChestXray, setChestXrayTaken } from "@/redux/chestXraySlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ButtonType, RadioIsInline } from "@/utils/enums";

const ChestXrayQuestionForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const applicantData = useAppSelector(selectApplicant);
  const chestXrayData = useAppSelector(selectChestXray);

  const methods = useForm<ReduxChestXrayDetailsType>({ reValidateMode: "onSubmit" });
  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<ReduxChestXrayDetailsType> = (data) => {
    updateReduxStore(data);
    if (data.chestXrayTaken === "Yes") {
      navigate("/chest-xray-upload");
    } else {
      navigate("/chest-xray-not-taken");
    }
  };

  const updateReduxStore = (chestXrayData: ReduxChestXrayDetailsType) => {
    dispatch(setChestXrayTaken(chestXrayData.chestXrayTaken));
  };
  const errorsToShow = Object.keys(errors);
  const chestXrayTakenRef = useRef<HTMLDivElement | null>(null);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {!!errors?.chestXrayTaken && <ErrorDisplay errorsToShow={errorsToShow} errors={errors} />}
        <ApplicantDataHeader applicantData={applicantData} />
        <Heading level={2} title="Has the visa applicant had a chest X-ray?" size="m" />
        <div ref={chestXrayTakenRef}>
          <Radio
            id="chest-xray-taken"
            legend="This would typically be the postero-anterior chest X-ray"
            isInline={RadioIsInline.TRUE}
            answerOptions={["Yes", "No"]}
            sortAnswersAlphabetically={false}
            errorMessage={errors?.chestXrayTaken?.message ?? ""}
            formValue="chestXrayTaken"
            defaultValue={chestXrayData.chestXrayTaken as string}
            required="Select yes if the visa applicant has had a chest X-ray or no if they have not."
          />
        </div>
        <Button
          id="Continue"
          type={ButtonType.DEFAULT}
          text="Continue"
          href="/"
          handleClick={() => {}}
        />
      </form>
    </FormProvider>
  );
};

export default ChestXrayQuestionForm;
