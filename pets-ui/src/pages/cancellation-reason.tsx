import { useEffect, useRef } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";

import Container from "@/components/container/container";
import ErrorSummary from "@/components/errorSummary/errorSummary";
import Heading from "@/components/heading/heading";
import SplitRadio from "@/components/splitRadio/splitRadio";
import SubmitButton from "@/components/submitButton/submitButton";
import TextArea from "@/components/textArea/textArea";
import { setCancellationFurtherInfo, setCancellationReason } from "@/redux/applicationSlice";
import { ButtonClass, RadioIsInline } from "@/utils/enums";
import { formatCancellationReasonForDisplay } from "@/utils/helpers";

export default function CancellationReasonPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const methods = useForm<CancellationReasonType>({ reValidateMode: "onSubmit" });
  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const errorsToShow = Object.keys(errors);

  const cancellationReasonRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (location.hash) {
      const target = location.hash.substring(1);
      if (target == "why-are-you-cancelling-screening") {
        cancellationReasonRef.current?.scrollIntoView();
      }
    }
  }, [location]);

  useEffect(() => {
    dispatch(setCancellationReason(""));
    dispatch(setCancellationFurtherInfo(""));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  type CancellationReasonType = {
    cancellationReason: string;
    cancellationReasonOther: string;
    cancellationFurtherInfo?: string;
  };

  const onSubmit: SubmitHandler<CancellationReasonType> = (data) => {
    const cancellationReason =
      data.cancellationReason == "Other"
        ? data.cancellationReasonOther.trim()
        : formatCancellationReasonForDisplay(data.cancellationReason);
    dispatch(setCancellationReason(cancellationReason));
    dispatch(setCancellationFurtherInfo(data.cancellationFurtherInfo ?? ""));
    navigate("/are-you-sure-you-want-to-cancel-this-screening");
  };

  return (
    <Container
      title="Why are you cancelling this screening? - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/tracker"
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {!!errorsToShow?.length && <ErrorSummary errorsToShow={errorsToShow} errors={errors} />}

          <Heading level={1} size="l" title="Why are you cancelling this screening?" />

          <div ref={cancellationReasonRef}>
            <SplitRadio
              id="why-are-you-cancelling-screening"
              formValue="cancellationReason"
              errorMessage={errors?.cancellationReason?.message ?? ""}
              required="Select the reason you are cancelling this screening"
              hintOne="Cancelling because the visa applicant:"
              answerOptionsOne={[
                "Did not continue with sputum testing",
                "Had inconclusive sputum test results",
                "Did not attend their screening appointment",
                "Changed their travel plans and does not need TB screening",
              ]}
              hintTwo="Cancelling because the clinic:"
              answerOptionsTwo={[
                "Uploaded the wrong X-ray",
                "Submitted the wrong sputum decision",
                "Submitted an error in the screening details",
              ]}
              exclusiveAnswerOptionsTwo={["Other"]}
              conditionalInput={{
                triggerValue: "Other",
                id: "why-are-you-cancelling-screening-other",
                label: "Reason for cancelling",
                name: "cancellationReasonOther",
                required: "Reason for cancelling cannot be blank",
              }}
              isInline={RadioIsInline.FALSE}
              sortAnswersAlphabetically={false}
            />
          </div>

          <TextArea
            id="give-further-information"
            headingLevel={2}
            headingSize="m"
            heading="Give further information (optional)"
            formValue="cancellationFurtherInfo"
            errorMessage={errors?.cancellationFurtherInfo?.message ?? ""}
            required={false}
            rows={4}
          />

          <SubmitButton id="continue" class={ButtonClass.DEFAULT} text="Continue" />
        </form>
      </FormProvider>
    </Container>
  );
}
