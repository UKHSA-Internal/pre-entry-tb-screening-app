import { useEffect } from "react";

import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectApplicant, selectApplication } from "@/redux/store";
import MedicalScreeningFormFemaleQs from "@/sections/medical-screening-form-female-qs";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/google-analytics-utils";
import { calculateApplicantAge } from "@/utils/helpers";

export default function MedicalScreeningFemalePage() {
  const applicationData = useAppSelector(selectApplication);
  const applicantData = useAppSelector(selectApplicant);
  const applicantAge = calculateApplicantAge(applicantData.dateOfBirth);

  let backLinkUrl = "/record-medical-history-tb-symptoms";
  if (typeof applicantAge.ageInYears == "number" && applicantAge.ageInYears < 11) {
    backLinkUrl = "/medical-history-under-11-years-old";
  }

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent(
      "medical_history_female",
      applicationData.applicationId,
      "Medical history and TB symptoms",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container
      title="Medical history: female - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo={backLinkUrl}
    >
      <MedicalScreeningFormFemaleQs />
    </Container>
  );
}
