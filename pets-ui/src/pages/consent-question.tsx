import { useEffect, useRef } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import Container from "@/components/container/container";
import ErrorSummary from "@/components/errorSummary/errorSummary";
import Radio from "@/components/radio/radio";
import SubmitButton from "@/components/submitButton/submitButton";
import { ButtonClass, RadioIsInline, YesOrNo } from "@/utils/enums";
import {
  sendGoogleAnalyticsFormErrorEvent,
  sendGoogleAnalyticsJourneyEvent,
} from "@/utils/helpers";

export default function ConsentQuestionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const methods = useForm<{ consent: YesOrNo }>({ reValidateMode: "onSubmit" });
  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent(
      "do_you_have_the_visa_applicants_written_consent_for_tb_screening",
      "UNK",
      "Visa Applicant Details",
    );
  }, []);

  const onSubmit: SubmitHandler<{ consent: YesOrNo }> = (data) => {
    if (data.consent == YesOrNo.YES) {
      navigate("/enter-applicant-information");
    } else {
      navigate("/get-written-consent");
    }
  };

  const errorsToShow = Object.keys(errors);
  useEffect(() => {
    if (errorsToShow.length > 0) {
      sendGoogleAnalyticsFormErrorEvent(
        "Do you have the visa applicant's written consent for TB screening?",
        errorsToShow,
      );
    }
  }, [errorsToShow]);

  const consentRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (location.hash) {
      const target = location.hash.substring(1);
      if (target == "do-you-have-consent") {
        consentRef.current?.scrollIntoView();
      }
    }
  }, [location]);

  return (
    <Container
      title="Do you have the visa applicant's written consent for TB screening? - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/no-matching-record-found"
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {!!errorsToShow?.length && <ErrorSummary errorsToShow={errorsToShow} errors={errors} />}

          <div ref={consentRef}>
            <Radio
              id="do-you-have-consent"
              heading="Do you have the visa applicant's written consent for TB screening?"
              headingLevel={1}
              headingSize="l"
              hint="The visa applicant (or their parent or guardian) must have signed a paper consent form before you start TB screening"
              isInline={RadioIsInline.TRUE}
              answerOptions={["Yes", "No"]}
              sortAnswersAlphabetically={false}
              errorMessage={errors?.consent?.message ?? ""}
              formValue="consent"
              required="Select yes if you have the visa applicant's written consent for TB screening"
            />
          </div>

          <SubmitButton id="continue" class={ButtonClass.DEFAULT} text="Continue" />
        </form>
      </FormProvider>
    </Container>
  );
}
