import { useEffect } from "react";

import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectApplication, selectSputum } from "@/redux/store";
import SputumResultsForm from "@/sections/sputum-results-form";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/google-analytics-utils";

export default function EnterSputumSampleResultsPage() {
  const applicationData = useAppSelector(selectApplication);
  const sputumData = useAppSelector(selectSputum);

  const allSputumSamplesSubmitted =
    sputumData.sample1.collection.submittedToDatabase &&
    sputumData.sample2.collection.submittedToDatabase &&
    sputumData.sample3.collection.submittedToDatabase;

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent(
      "enter_sputum_sample_results",
      applicationData.applicationId,
      "Sputum collection and results",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container
      title="Sputum results - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo={
        allSputumSamplesSubmitted ? "/tracker" : "/enter-sputum-sample-collection-information"
      }
    >
      <SputumResultsForm />
    </Container>
  );
}
