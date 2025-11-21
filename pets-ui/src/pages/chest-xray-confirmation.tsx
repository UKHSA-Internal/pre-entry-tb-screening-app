import { useEffect } from "react";

import Confirmation from "@/components/confirmation/confirmation";
import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectApplication } from "@/redux/store";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/helpers";

export default function ChestXrayConfirmation() {
  const applicationData = useAppSelector(selectApplication);

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent(
      "chest_xray_images_confirmed",
      applicationData.applicationId,
      "Upload chest X-ray images",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container title="Chest X-ray images confirmed - Complete UK pre-entry health screening - GOV.UK">
      <Confirmation
        confirmationText={"Chest X-ray images confirmed"}
        furtherInfo={[
          "We have sent the chest X-ray images to UKHSA.",
          "You can now view a summary for this visa applicant.",
        ]}
        buttonText={"Continue"}
        buttonLink={"/tracker"}
        whatHappensNext
      />
    </Container>
  );
}
