import { useEffect } from "react";

import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import { useAppSelector } from "@/redux/hooks";
import { selectApplication, selectMedicalScreening } from "@/redux/store";
import MedicalScreeningReview from "@/sections/medical-screening-summary";
import { ApplicationStatus, YesOrNo } from "@/utils/enums";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/google-analytics-utils";

export default function MedicalSummaryPage() {
  const applicationData = useAppSelector(selectApplication);
  const medicalData = useAppSelector(selectMedicalScreening);

  const getBackLink = () => {
    if (medicalData.status === ApplicationStatus.COMPLETE) {
      return "/tracker";
    } else if (medicalData.chestXrayTaken === YesOrNo.NO) {
      return "/reason-x-ray-not-required";
    } else {
      return "/is-an-x-ray-required";
    }
  };

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent(
      "medical_screening_summary",
      applicationData.applicationId,
      "Medical history and TB symptoms",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container
      title="Medical screening summary - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo={getBackLink()}
    >
      <Heading level={1} size="l" title="Check medical history and TB symptoms" />
      <MedicalScreeningReview />
    </Container>
  );
}
