import { useEffect } from "react";
import { useNavigate } from "react-router";

import Button from "@/components/button/button";
import Confirmation from "@/components/confirmation/confirmation";
import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import { useAppSelector } from "@/redux/hooks";
import { selectApplication, selectSputum } from "@/redux/store";
import { ButtonClass, PositiveOrNegative, TaskStatus } from "@/utils/enums";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/google-analytics-utils";

export default function SputumConfirmation() {
  const applicationData = useAppSelector(selectApplication);
  const sputumData = useAppSelector(selectSputum);
  const navigate = useNavigate();

  const samples = [sputumData.sample1, sputumData.sample2, sputumData.sample3];

  const allResultsComplete = samples.every((sample) => {
    const hasCollectionData =
      sample.collection.dateOfSample.day &&
      sample.collection.dateOfSample.month &&
      sample.collection.dateOfSample.year &&
      sample.collection.collectionMethod;
    const hasSmearResult = sample.smearResults.smearResult !== PositiveOrNegative.NOT_YET_ENTERED;
    const hasCultureResult =
      sample.cultureResults.cultureResult !== PositiveOrNegative.NOT_YET_ENTERED;
    return hasCollectionData && hasSmearResult && hasCultureResult;
  });

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent(
      "sputum_sample_information_confirmed",
      applicationData.applicationId,
      "Sputum collection and results",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (sputumData.status === TaskStatus.COMPLETE || allResultsComplete) {
    return (
      <Container
        title={
          "Sputum collection and results confirmed - Complete UK pre-entry health screening - GOV.UK"
        }
      >
        <Confirmation
          confirmationText={"Sputum collection and results confirmed"}
          furtherInfo={[
            "We have sent sputum collection details and results to UKHSA.",
            "You can now view a summary for this visa applicant.",
          ]}
          buttonText={"Continue"}
          buttonLink={"/tracker"}
          whatHappensNext
        />
      </Container>
    );
  } else {
    return (
      <Container
        title={"Your progress has been saved - Complete UK pre-entry health screening - GOV.UK"}
      >
        <Heading level={1} size="l" title="Your progress has been saved" />
        <p className="govuk-body">The information you entered has been saved.</p>
        <Heading level={2} size="m" title="What happens next" />
        <p className="govuk-body">
          You need to enter results for all 3 sputum samples before you can complete the TB health
          screening.
        </p>
        <Button
          id="continue"
          class={ButtonClass.DEFAULT}
          text={"Continue"}
          handleClick={() => {
            navigate("/tracker");
          }}
        />
      </Container>
    );
  }
}
