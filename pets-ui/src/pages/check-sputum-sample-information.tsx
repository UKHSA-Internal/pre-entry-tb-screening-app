import { useEffect } from "react";

import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectApplication, selectSputum } from "@/redux/store";
import SputumSummary from "@/sections/sputum-summary";
import { ApplicationStatus } from "@/utils/enums";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/google-analytics-utils";

export default function CheckSputumSampleInformationPage() {
  const applicationData = useAppSelector(selectApplication);
  const sputumData = useAppSelector(selectSputum);

  let backLinkUrl = "/enter-sputum-sample-collection-information";
  if (sputumData.status === ApplicationStatus.COMPLETE) {
    backLinkUrl = "/tracker";
  }

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent(
      "check_sputum_collection_details_and_results",
      applicationData.applicationId,
      "Sputum collection and results",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container
      title="Check sputum collection details and results - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo={backLinkUrl}
    >
      <SputumSummary />
    </Container>
  );
}
