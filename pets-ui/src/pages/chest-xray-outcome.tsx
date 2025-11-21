import { useEffect } from "react";

import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectApplication } from "@/redux/store";
import ChestXrayOutcomeForm from "@/sections/chest-xray-outcome-form";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/helpers";

export default function ChestXrayOutcomePage() {
  const applicationData = useAppSelector(selectApplication);

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent(
      "chest_xray_results",
      applicationData.applicationId,
      "Radiological outcome",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container
      title="Chest X-ray results - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/tracker"
    >
      <ChestXrayOutcomeForm />
    </Container>
  );
}
