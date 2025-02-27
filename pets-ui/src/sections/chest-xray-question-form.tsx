import { ChestXrayDetailsType } from "@/applicant";
import ApplicantDataHeader from "@/components/applicantDataHeader/applicantDataHeader";
import Button from "@/components/button/button";
import Radio from "@/components/radio/radio";
import { selectApplicant } from "@/redux/applicantSlice";
import { selectChestXray, setChestXrayTaken } from "@/redux/chestXraySlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ButtonType, RadioIsInline } from "@/utils/enums";
import { useRef } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { attributeToComponentId } from "@/utils/helpers";

const CxrQuestionForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const applicantData = useAppSelector(selectApplicant);
  useAppSelector(selectChestXray);

  const methods = useForm<ChestXrayDetailsType>({ reValidateMode: "onSubmit" });
  const {
    handleSubmit,
    formState: { errors },
    watch,
  } = methods;

  const onSubmit: SubmitHandler<ChestXrayDetailsType> = (data) => {
    updateReduxStore(data);
    data.chestXrayTaken === "yes"
      ? navigate("/chest-xray-upload")
      : navigate("/chest-xray-not-taken");
  };

  const updateReduxStore = (chestXrayData: ChestXrayDetailsType) => {
    dispatch(setChestXrayTaken(chestXrayData.chestXrayTaken));
  };

  const watchedChestXrayTaken = watch("chestXrayTaken") as unknown as string;

  const chestXrayTakenRef = useRef<HTMLDivElement | null>(null);

  watchedChestXrayTaken === "yes" ? setChestXrayTaken(true) : setChestXrayTaken(false);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {!!errors?.chestXrayTaken && (
          <div className="govuk-error-summary" data-module="govuk-error-summary">
            <div role="alert">
              <h2 className="govuk-error-summary__title">There is a problem</h2>
              <div className="govuk-error-summary__body">
                <ul className="govuk-list govuk-error-summary__list">
                  <li key={attributeToComponentId["chestXrayTaken"]}>
                    <a href={"#" + attributeToComponentId["chestXrayTaken"]}>
                      {errors["chestXrayTaken" as keyof typeof errors]?.message}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
        <ApplicantDataHeader applicantData={applicantData} />
        <h1>Has the visa applicant had a chest X-ray?</h1>
        <div ref={chestXrayTakenRef}>
          <Radio
            id="chest-xray-taken"
            legend="This would typically be the postero-anterior chest X-ray"
            isInline={RadioIsInline.TRUE}
            answerOptions={["Yes", "No"]}
            sortAnswersAlphabetically={false}
            errorMessage={errors?.chestXrayTaken?.message ?? ""}
            formValue="chestXrayTaken"
            required="Select whether the applicant has had a chest X-ray."
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

export default CxrQuestionForm;
