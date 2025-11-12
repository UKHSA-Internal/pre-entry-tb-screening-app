import { useEffect } from "react";

import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import { useAppSelector } from "@/redux/hooks";
import { selectApplication, selectRadiologicalOutcome } from "@/redux/store";
import RadiologicalOutcomeSummary from "@/sections/radiological-outcome-summary";
import { ApplicationStatus } from "@/utils/enums";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/helpers";

export default function RadiologicalOutcomeSummaryPage() {
  const applicationData = useAppSelector(selectApplication);
  const radiologicalOutcomeData = useAppSelector(selectRadiologicalOutcome);

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent(
      "Check chest X-ray results and findings",
      applicationData.applicationId,
      "Radiological outcome",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container
      title="Check chest X-ray results and findings - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo={
        radiologicalOutcomeData.status == ApplicationStatus.COMPLETE
          ? "/tracker"
          : "/enter-x-ray-findings"
      }
    >
      <Heading level={1} size="l" title="Check chest X-ray results and findings" />
      <RadiologicalOutcomeSummary />
    </Container>
  );
}
