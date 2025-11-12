import { useEffect } from "react";

import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import { useAppSelector } from "@/redux/hooks";
import { selectApplication, selectChestXray } from "@/redux/store";
import ChestXraySummary from "@/sections/chest-xray-summary";
import { ApplicationStatus } from "@/utils/enums";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/helpers";

export default function ChestXraySummaryPage() {
  const applicationData = useAppSelector(selectApplication);
  const chestXrayData = useAppSelector(selectChestXray);

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent(
      "Check chest X-ray images",
      applicationData.applicationId,
      "Upload chest X-ray images",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container
      title="Check chest X-ray images - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo={
        chestXrayData.status == ApplicationStatus.COMPLETE
          ? "/tracker"
          : "/upload-chest-x-ray-images"
      }
    >
      <Heading level={1} size="l" title="Check chest X-ray images" />
      <ChestXraySummary />
    </Container>
  );
}
