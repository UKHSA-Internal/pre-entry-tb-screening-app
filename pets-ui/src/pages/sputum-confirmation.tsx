import { useEffect } from "react";

import Confirmation from "@/components/confirmation/confirmation";
import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectApplication, selectSputum } from "@/redux/store";
import { ApplicationStatus, PositiveOrNegative } from "@/utils/enums";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/google-analytics-utils";

export default function SputumConfirmation() {
  const applicationData = useAppSelector(selectApplication);
  const sputumData = useAppSelector(selectSputum);

  const samples = [sputumData.sample1, sputumData.sample2, sputumData.sample3];

  const allDatesComplete = samples.every(
    (sample) =>
      sample.collection.dateOfSample.day &&
      sample.collection.dateOfSample.month &&
      sample.collection.dateOfSample.year &&
      sample.collection.collectionMethod,
  );

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

  const hasAnyResults = samples.some((sample) => {
    const hasSmearResult = sample.smearResults.smearResult !== PositiveOrNegative.NOT_YET_ENTERED;
    const hasCultureResult =
      sample.cultureResults.cultureResult !== PositiveOrNegative.NOT_YET_ENTERED;
    return hasSmearResult || hasCultureResult;
  });

  const confirmationText =
    sputumData.status === ApplicationStatus.COMPLETE || allResultsComplete
      ? "Sputum collection and results confirmed"
      : "Partial sputum sample information confirmed";

  const furtherInfo = (() => {
    if (allResultsComplete) {
      return [
        "We have sent sputum collection details and results to UKHSA.",
        "You can now view a summary for this visa applicant.",
      ];
    } else if (allDatesComplete && hasAnyResults) {
      return ["The panel physician should wait to confirm the remaining sputum sample results"];
    } else {
      return [
        "We have sent sputum collection details and results to UKHSA.",
        "You can now view a summary for this visa applicant.",
      ];
    }
  })();

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent(
      "sputum_sample_information_confirmed",
      applicationData.applicationId,
      "Sputum collection and results",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container title="Sputum sample information confirmed - Complete UK pre-entry health screening - GOV.UK">
      <Confirmation
        confirmationText={confirmationText}
        furtherInfo={furtherInfo}
        buttonText={"Continue"}
        buttonLink={"/tracker"}
        whatHappensNext
      />
    </Container>
  );
}
