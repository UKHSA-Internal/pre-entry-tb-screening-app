import { useEffect } from "react";

import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectApplication } from "@/redux/store";
import MedicalScreeningForm from "@/sections/medical-screening-form";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/helpers";

export default function MedicalScreeningPage() {
  const applicationData = useAppSelector(selectApplication);

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent(
      "record_medical_history_and_tb_symptoms",
      applicationData.applicationId,
      "Medical history and TB symptoms",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container
      title="Record medical history and TB symptoms - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/tracker"
    >
      <MedicalScreeningForm />
    </Container>
  );
}
