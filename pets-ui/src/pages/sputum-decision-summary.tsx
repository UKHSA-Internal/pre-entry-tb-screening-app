import { useEffect } from "react";

import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import { useAppSelector } from "@/redux/hooks";
import { selectApplication, selectSputumDecision } from "@/redux/store";
import SputumDecisionSummary from "@/sections/sputum-decision-summary";
import { ApplicationStatus } from "@/utils/enums";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/helpers";

export default function SputumDecisionSummaryPage() {
  const applicationData = useAppSelector(selectApplication);
  const sputumDecisionData = useAppSelector(selectSputumDecision);

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent(
      "Check sputum decision information",
      applicationData.applicationId,
      "Make a sputum decision",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container
      title="Check sputum decision information - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo={
        sputumDecisionData.status == ApplicationStatus.COMPLETE
          ? "/tracker"
          : "/is-sputum-collection-required"
      }
    >
      <Heading level={1} size="l" title="Check sputum decision information" />
      <SputumDecisionSummary />
    </Container>
  );
}
