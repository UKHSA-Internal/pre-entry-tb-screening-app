import { useEffect, useRef } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { ReduxRadiologicalOutcomeDetailsType } from "@/applicant";
import ErrorSummary from "@/components/errorSummary/errorSummary";
import Heading from "@/components/heading/heading";
import Radio from "@/components/radio/radio";
import SubmitButton from "@/components/submitButton/submitButton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setSputumCollectionTaken } from "@/redux/radiologicalOutcomeSlice";
import { selectRadiologicalOutcome } from "@/redux/store";
import { ButtonType, RadioIsInline } from "@/utils/enums";

const SputumQuestionForm = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const radiologicalOutcomeData = useAppSelector(selectRadiologicalOutcome);

  const methods = useForm<ReduxRadiologicalOutcomeDetailsType>({
    reValidateMode: "onSubmit",
  });
  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<ReduxRadiologicalOutcomeDetailsType> = (data) => {
    dispatch(setSputumCollectionTaken(data.isSputumRequired));
    navigate("/chest-xray-summary");
  };

  const errorsToShow = Object.keys(errors);
  const isSputumRequiredRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (location.hash) {
      const target = location.hash.substring(1);
      if (target == "sputum-required") {
        isSputumRequiredRef.current?.scrollIntoView();
      }
    }
  }, [location]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {!!errors?.isSputumRequired && <ErrorSummary errorsToShow={errorsToShow} errors={errors} />}
        <Heading level={1} size="l" title="Is a sputum collection required?" />{" "}
        <div ref={isSputumRequiredRef}>
          <Radio
            id="sputum-required"
            isInline={RadioIsInline.TRUE}
            answerOptions={["Yes", "No"]}
            sortAnswersAlphabetically={false}
            errorMessage={errors?.isSputumRequired?.message ?? ""}
            formValue="isSputumRequired"
            defaultValue={radiologicalOutcomeData.isSputumRequired}
            required="Select yes if sputum collection is required"
            divStyle={{ marginTop: 40 }}
          />
        </div>
        <SubmitButton id="Continue" type={ButtonType.DEFAULT} text="Continue" />
      </form>
    </FormProvider>
  );
};

export default SputumQuestionForm;
