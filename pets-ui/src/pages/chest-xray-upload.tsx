import { useEffect } from "react";

import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectApplication } from "@/redux/store";
import ChestXrayForm from "@/sections/chest-xray-form";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/google-analytics-utils";

export default function ChestXrayUploadPage() {
  const applicationData = useAppSelector(selectApplication);

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent(
      "upload_chest_xray_images",
      applicationData.applicationId,
      "Upload chest X-ray images",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container
      title="Upload chest X-ray images - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/tracker"
    >
      <ChestXrayForm />
    </Container>
  );
}
