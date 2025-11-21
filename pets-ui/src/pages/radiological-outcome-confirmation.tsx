import { useEffect } from "react";

import Confirmation from "@/components/confirmation/confirmation";
import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectApplication } from "@/redux/store";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/google-analytics-utils";

export default function RadiologicalOutcomeConfirmation() {
  const applicationData = useAppSelector(selectApplication);

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent(
      "radiological_outcome_confirmed",
      applicationData.applicationId,
      "Radiological outcome",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container title="Radiological outcome confirmed - Complete UK pre-entry health screening - GOV.UK">
      <Confirmation
        confirmationText={"Radiological outcome confirmed"}
        furtherInfo={[
          "We have sent the radiological outcome to UKHSA.",
          "You can now return to the progress tracker.",
        ]}
        buttonText={"Continue"}
        buttonLink={"/tracker"}
        whatHappensNext
      />
    </Container>
  );
}
