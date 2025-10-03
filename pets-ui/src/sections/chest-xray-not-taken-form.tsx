import { useEffect, useRef, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import ErrorSummary from "@/components/errorSummary/errorSummary";
import FreeText from "@/components/freeText/freeText";
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
    if (backendValue === "Child") return "Child (under 11 years)";
    return backendValue;
  };

  const mapDisplayToBackend = (displayValue: string): string => {
    if (displayValue === "Child (under 11 years)") return "Child";
    return displayValue;
  };

  const [selectedReason, setSelectedReason] = useState(
    mapBackendToDisplay(medicalData.reasonXrayNotRequired || ""),
  );

  const methods = useForm<ReduxMedicalScreeningType>({
    reValidateMode: "onSubmit",
  });
  const {
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;

  const watchedReason = watch("reasonXrayNotRequired");

  useEffect(() => {
    if (watchedReason) {
      if (
        watchedReason === "Child (under 11 years)" ||
        watchedReason === "Pregnant" ||
        watchedReason === "Other"
      ) {
        setSelectedReason(watchedReason);
      } else if (selectedReason !== "Other") {
        setSelectedReason("Other");
      }
    }
  }, [watchedReason, selectedReason]);

  const onSubmit: SubmitHandler<ReduxMedicalScreeningType> = (data) => {
    let reasonValue = data.reasonXrayNotRequired || "";

    if (reasonValue === "Child (under 11 years)") {
      reasonValue = mapDisplayToBackend(reasonValue);
    } else if (reasonValue === "Pregnant") {
      reasonValue = "Pregnant";
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

  const showErrorSummary =
    errorsToShow.length > 0 &&
    !(selectedReason === "Other" && errorsToShow.includes("reasonXrayNotRequired"));

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {showErrorSummary && <ErrorSummary errorsToShow={errorsToShow} errors={errors} />}
          <Heading level={1} size="l" title="Reason X-ray is not required?" />
          <div ref={reasonXrayWasNotTakenRef}>
            <Radio
              id="reason-xray-not-taken"
              isInline={RadioIsInline.FALSE}
              answerOptions={["Child (under 11 years)", "Pregnant", "Other"]}
              sortAnswersAlphabetically={false}
              errorMessage={
                selectedReason === "Other"
                  ? ""
                  : ((errors?.reasonXrayNotRequired?.message as string) ?? "")
              }
              formValue="reasonXrayNotRequired"
              defaultValue={mapBackendToDisplay(medicalData.reasonXrayNotRequired || "")}
              required="Select a reason why X-ray is not required"
              divStyle={{ marginTop: 40 }}
            />

            {selectedReason === "Other" && (
              <div
                className={`govuk-radios__conditional ${
                  errors?.reasonXrayNotRequired ? "govuk-radios__conditional--error" : ""
                }`}
              >
                {errors?.reasonXrayNotRequired && (
                  <span className="govuk-error-message">
                    <span className="govuk-visually-hidden">Error:</span>
                    {errors.reasonXrayNotRequired.message}
                  </span>
                )}
                <FreeText
                  id="reason-xray-not-required-other-detail"
                  label="Reason not required"
                  errorMessage=""
                  formValue="reasonXrayNotRequired"
                  required="Enter the reason why X-ray is not required"
                  patternValue={/.*/}
                  patternError=""
                  inputWidth={20}
                  defaultValue=""
                />
              </div>
            )}
          </div>
          <SubmitButton id="Continue" type={ButtonType.DEFAULT} text="Continue" />
        </form>
      </FormProvider>
    </>
  );
};

export default ChestXrayNotTakenForm;
