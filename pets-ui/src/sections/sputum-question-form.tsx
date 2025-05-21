import { useEffect, useRef } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { ReduxChestXrayDetailsType } from "@/applicant";
import ApplicantDataHeader from "@/components/applicantDataHeader/applicantDataHeader";
import ErrorSummary from "@/components/errorSummary/errorSummary";
import Heading from "@/components/heading/heading";
import Radio from "@/components/radio/radio";
import SubmitButton from "@/components/submitButton/submitButton";
import { selectApplicant } from "@/redux/applicantSlice";
import { selectChestXray, setSputumCollectionTaken } from "@/redux/chestXraySlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ButtonType, RadioIsInline } from "@/utils/enums";

const SputumQuestionForm = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const applicantData = useAppSelector(selectApplicant);
  const chestXrayData = useAppSelector(selectChestXray);

  const methods = useForm<ReduxChestXrayDetailsType>({ reValidateMode: "onSubmit" });
  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<ReduxChestXrayDetailsType> = (data) => {
    dispatch(setSputumCollectionTaken(data.sputumCollected));
    navigate("/chest-xray-summary");
  };

  const errorsToShow = Object.keys(errors);
  const sputumCollectedRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (location.hash) {
      const target = location.hash.substring(1);
      if (target == "sputum-collected") {
        sputumCollectedRef.current?.scrollIntoView();
      }
    }
  }, [location]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {!!errors?.sputumCollected && <ErrorSummary errorsToShow={errorsToShow} errors={errors} />}

        <Heading level={1} size="l" title="Sputum collection requirement" />
        <ApplicantDataHeader applicantData={applicantData} />
        <div ref={sputumCollectedRef}>
          <Radio
            heading="Is a sputum collection required?"
            id="sputum-collected"
            isInline={RadioIsInline.TRUE}
            answerOptions={["Yes", "No"]}
            sortAnswersAlphabetically={false}
            errorMessage={errors?.sputumCollected?.message ?? ""}
            formValue="sputumCollected"
            defaultValue={chestXrayData.sputumCollected}
            required="Select whether a sputum collection is required"
            divStyle={{ marginTop: 40 }}
          />
        </div>
        <SubmitButton id="Continue" type={ButtonType.DEFAULT} text="Continue" />
      </form>
    </FormProvider>
  );
};

export default SputumQuestionForm;
