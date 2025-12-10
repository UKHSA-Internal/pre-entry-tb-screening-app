import { useEffect } from "react";

import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectApplication } from "@/redux/store";
import SputumCollectionForm from "@/sections/sputum-collection-form";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/google-analytics-utils";

export default function SputumCollectionPage() {
  const applicationData = useAppSelector(selectApplication);

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent(
      "enter_sputum_sample_collection_information",
      applicationData.applicationId,
      "Sputum collection and results",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container
      title="Sputum collection details - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/tracker"
    >
      <SputumCollectionForm />
    </Container>
  );
}
