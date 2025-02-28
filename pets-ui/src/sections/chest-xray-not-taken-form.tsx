import { useRef } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { ChestXrayDetailsType } from "@/applicant";
import ApplicantDataHeader from "@/components/applicantDataHeader/applicantDataHeader";
import Button from "@/components/button/button";
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
import { attributeToComponentId } from "@/utils/helpers";

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
        {!!errorsToShow?.length && (
          <div className="govuk-error-summary" data-module="govuk-error-summary">
            <div role="alert">
              <h2 className="govuk-error-summary__title">There is a problem</h2>
              <div className="govuk-error-summary__body">
                <ul className="govuk-list govuk-error-summary__list">
                  {errorsToShow.map((error) => (
                    <li key={attributeToComponentId[error]}>
                      <a href={"#" + attributeToComponentId[error]}>
                        {errors[error as keyof typeof errors]?.message}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
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
            required={watchedReasonXrayNotTaken === "other" ? "Please Provide Details" : false}
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
