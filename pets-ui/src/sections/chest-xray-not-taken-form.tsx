import { useRef } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { ChestXrayDetailsType } from "@/applicant";
import ApplicantDataHeader from "@/components/applicantDataHeader/applicantDataHeader";
import Button from "@/components/button/button";
import ErrorDisplay from "@/components/errorDisplay/errorDisplay";
import Radio from "@/components/radio/radio";
import TextArea from "@/components/textArea/textArea";
import { selectApplicant } from "@/redux/applicantSlice";
import {
  selectChestXray,
  setReasonXrayWasNotTaken,
  setXrayWasNotTakenFurtherDetails,
} from "@/redux/chestXraySlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ButtonType, RadioIsInline } from "@/utils/enums";

const ChestXrayNotTakenForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const applicantData = useAppSelector(selectApplicant);
  const chestXrayData = useAppSelector(selectChestXray);

  const methods = useForm<ChestXrayDetailsType>({ reValidateMode: "onSubmit" });
  const {
    handleSubmit,
    formState: { errors },
    watch,
  } = methods;

  const onSubmit: SubmitHandler<ChestXrayDetailsType> = (data) => {
    updateReduxStore(data);
    navigate("/xray-not-taken-summary");
  };

  const updateReduxStore = (chestXrayData: ChestXrayDetailsType) => {
    dispatch(setReasonXrayWasNotTaken(chestXrayData.reasonXrayWasNotTaken));
    dispatch(setXrayWasNotTakenFurtherDetails(chestXrayData.xrayWasNotTakenFurtherDetails));
  };

  const errorsToShow = Object.keys(errors);

  const watchedReasonXrayNotTaken = watch("reasonXrayWasNotTaken") as unknown as string;

  const reasonXrayNotTakenRef = useRef<HTMLDivElement | null>(null);
  const xrayNotTakenFurtherDetailsRef = useRef<HTMLDivElement | null>(null);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {!!errorsToShow?.length && <ErrorDisplay errorsToShow={errorsToShow} errors={errors} />}
        <ApplicantDataHeader applicantData={applicantData} />
        <h1>Reason X-ray not taken</h1>
        <div ref={reasonXrayNotTakenRef}>
          <Radio
            id="reason-xray-not-taken"
            legend="Choose from the following options"
            isInline={RadioIsInline.FALSE}
            answerOptions={["Child", "Pregnant", "Other"]}
            sortAnswersAlphabetically={false}
            errorMessage={errors?.reasonXrayWasNotTaken?.message ?? ""}
            formValue="reasonXrayWasNotTaken"
            required="Select the reason why the chest X-ray was not taken."
          />
        </div>
        <h1>Notes</h1>
        <div ref={xrayNotTakenFurtherDetailsRef}>
          <TextArea
            id="xray-not-taken-further-details"
            label="If other, give further details"
            errorMessage={errors?.xrayWasNotTakenFurtherDetails?.message ?? ""}
            formValue="xrayWasNotTakenFurtherDetails"
            required={
              watchedReasonXrayNotTaken === "other" ? "Enter reason X-ray not taken." : false
            }
            rows={4}
            defaultValue={chestXrayData.xrayWasNotTakenFurtherDetails ?? ""}
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

export default ChestXrayNotTakenForm;
