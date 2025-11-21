import { useEffect } from "react";

import Confirmation from "@/components/confirmation/confirmation";
import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectApplication } from "@/redux/store";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/google-analytics-utils";

export default function MedicalConfirmation() {
  const applicationData = useAppSelector(selectApplication);

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent(
      "medical_history_and_tb_symptoms_confirmed",
      applicationData.applicationId,
      "Medical history and TB symptoms",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container title="Medical history and TB symptoms confirmed - Complete UK pre-entry health screening - GOV.UK">
      <Confirmation
        confirmationText={"Medical history and TB symptoms confirmed"}
        furtherInfo={["You can now return to the progress tracker."]}
        buttonText={"Continue"}
        buttonLink={"/tracker"}
        whatHappensNext
      />
    </Container>
  );
}
