import { useEffect } from "react";

import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectApplication } from "@/redux/store";
import ChestXrayFindingsForm from "@/sections/chest-xray-findings-form";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/helpers";

export default function ChestXrayFindingsPage() {
  const applicationData = useAppSelector(selectApplication);

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent(
      "enter_xray_findings",
      applicationData.applicationId,
      "Radiological outcome",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container
      title="Enter X-ray findings - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/chest-x-ray-results"
    >
      <ChestXrayFindingsForm />
    </Container>
  );
}
