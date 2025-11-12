import { useEffect } from "react";

import Confirmation from "@/components/confirmation/confirmation";
import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectApplication } from "@/redux/store";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/helpers";

export default function TravelConfirmation() {
  const applicationData = useAppSelector(selectApplication);

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent(
      "Travel information confirmed",
      applicationData.applicationId,
      "Travel Information",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container title="Travel information confirmed - Complete UK pre-entry health screening - GOV.UK">
      <Confirmation
        confirmationText={"Travel information confirmed"}
        furtherInfo={["You can now return to the progress tracker."]}
        buttonText={"Continue"}
        buttonLink={"/tracker"}
        whatHappensNext
      />
    </Container>
  );
}
