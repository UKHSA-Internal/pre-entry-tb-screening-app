import { useEffect } from "react";

import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectApplication } from "@/redux/store";
import SputumCollectionForm from "@/sections/sputum-collection-form";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/helpers";

export default function SputumCollectionPage() {
  const applicationData = useAppSelector(selectApplication);

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent(
      "Enter sputum sample collection information",
      applicationData.applicationId,
      "Sputum collection and results",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container
      title="Enter sputum sample collection information - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/tracker"
    >
      <SputumCollectionForm />
    </Container>
  );
}
