/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { useRef } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { ChestXrayDetailsType } from "@/applicant";
import ApplicantDataHeader from "@/components/applicantDataHeader/applicantDataHeader";
import Button from "@/components/button/button";
import ErrorDisplay from "@/components/errorSummary/errorSummary";
import Heading from "@/components/heading/heading";
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

  const updateReduxStore = () => {
    dispatch(setReasonXrayWasNotTaken(chestXrayData.reasonXrayWasNotTaken));
    dispatch(setXrayWasNotTakenFurtherDetails(chestXrayData.xrayWasNotTakenFurtherDetails));
  };

  const onSubmit: SubmitHandler<ChestXrayDetailsType> = () => {
    updateReduxStore();
    navigate("/xray-not-taken-summary");
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
        <Heading level={2} title="Reason X-ray not taken" />
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
        <Heading level={2} title="Notes" />
        <div ref={xrayNotTakenFurtherDetailsRef}>
          <TextArea
            id="xray-not-taken-further-details"
            label="If other, give further details"
            errorMessage={errors?.xrayWasNotTakenFurtherDetails?.message ?? ""}
            formValue="xrayWasNotTakenFurtherDetails"
            required={
              watchedReasonXrayNotTaken === "Other" ? "Enter reason X-ray not taken." : false
            }
            rows={4}
            defaultValue={chestXrayData.xrayWasNotTakenFurtherDetails ?? ""}
          />
        </div>

        <Button
          id="Continue"
          type={ButtonType.DEFAULT}
          text="Continue"
          href="/xray-not-taken-summary"
          handleClick={() => {}}
        />
      </form>
    </FormProvider>
  );
};

export default ChestXrayNotTakenForm;
