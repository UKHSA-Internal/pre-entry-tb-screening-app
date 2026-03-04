import { useEffect } from "react";

import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectApplication } from "@/redux/store";
import MedicalScreeningFormU11Qs from "@/sections/medical-screening-form-u11-qs";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/google-analytics-utils";

export default function MedicalScreeningU11Page() {
  const applicationData = useAppSelector(selectApplication);

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent(
      "medical_history_under_11_years_old",
      applicationData.applicationId,
      "Medical history and TB symptoms",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container
      title="Medical history: under 11 years old - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/record-medical-history-tb-symptoms"
    >
      <MedicalScreeningFormU11Qs />
    </Container>
  );
}
