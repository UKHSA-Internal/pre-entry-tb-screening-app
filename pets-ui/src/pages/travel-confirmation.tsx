import { useEffect } from "react";

import Confirmation from "@/components/confirmation/confirmation";
import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectApplication } from "@/redux/store";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/google-analytics-utils";

export default function TravelConfirmation() {
  const applicationData = useAppSelector(selectApplication);

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent(
      "travel_information_confirmed",
      applicationData.applicationId,
      "Travel Information",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container title="UK travel information confirmed - Complete UK pre-entry health screening - GOV.UK">
      <Confirmation
        confirmationText={"UK travel information confirmed"}
        furtherInfo={[
          "We have sent the UK travel information to UKHSA.",
          "You can now view a summary for this visa applicant.",
        ]}
        buttonText={"Continue"}
        buttonLink={"/tracker"}
        whatHappensNext
      />
    </Container>
  );
}
