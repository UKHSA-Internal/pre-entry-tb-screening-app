import { useEffect, useRef } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import ErrorSummary from "@/components/errorSummary/errorSummary";
import Heading from "@/components/heading/heading";
import Radio from "@/components/radio/radio";
import SubmitButton from "@/components/submitButton/submitButton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setReasonXrayNotRequired } from "@/redux/medicalScreeningSlice";
import { selectMedicalScreening } from "@/redux/store";
import { ReduxMedicalScreeningType } from "@/types";
import { ButtonType, RadioIsInline } from "@/utils/enums";

const ChestXrayNotTakenForm = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const medicalData = useAppSelector(selectMedicalScreening);

  const mapBackendToDisplay = (backendValue: string): string => {
    if (backendValue === "Child") {
      return "Child (under 11 years)";
    } else {
      return backendValue;
    }
  };

  const mapDisplayToBackend = (displayValue: string): string => {
    if (displayValue === "Child (under 11 years)") {
      return "Child";
    } else {
      return displayValue;
    }
  };

  type FormFields = ReduxMedicalScreeningType & { reasonXrayNotRequiredOtherTemp?: string };

  const methods = useForm<FormFields>({
    reValidateMode: "onSubmit",
  });
  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    let reasonValue = data.reasonXrayNotRequired || "";

    if (reasonValue === "Child (under 11 years)") {
      reasonValue = mapDisplayToBackend(reasonValue);
    } else if (reasonValue === "Other") {
      reasonValue = data.reasonXrayNotRequiredOtherTemp?.trim() || "";
    }

    dispatch(setReasonXrayNotRequired(reasonValue));
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
        {errorsToShow.length > 0 && <ErrorSummary errorsToShow={errorsToShow} errors={errors} />}
        <Heading level={1} size="l" title="Reason X-ray is not required?" />
        <div ref={reasonXrayWasNotTakenRef}>
          <Radio
            id="reason-xray-not-taken"
            isInline={RadioIsInline.FALSE}
            answerOptions={["Child (under 11 years)", "Pregnant", "Other"]}
            sortAnswersAlphabetically={false}
            errorMessage={(errors?.reasonXrayNotRequired?.message as string) ?? ""}
            formValue="reasonXrayNotRequired"
            defaultValue={mapBackendToDisplay(medicalData.reasonXrayNotRequired || "")}
            required="Select a reason why X-ray is not required"
            divStyle={{ marginTop: 40 }}
            conditionalInput={{
              triggerValue: "Other",
              id: "reason-xray-not-required-other-detail",
              label: "Reason not required",
              name: "reasonXrayNotRequiredOtherTemp",
              required: "Enter the reason why X-ray is not required",
            }}
          />
        </div>
        <SubmitButton id="Continue" type={ButtonType.DEFAULT} text="Continue" />
      </form>
    </FormProvider>
  );
};

export default ChestXrayNotTakenForm;
