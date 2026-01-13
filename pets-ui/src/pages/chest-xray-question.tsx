import { useEffect } from "react";

import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectApplicant, selectApplication } from "@/redux/store";
import ChestXrayQuestionForm from "@/sections/chest-xray-question-form";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/google-analytics-utils";
import { calculateApplicantAge } from "@/utils/helpers";

export default function ChestXrayQuestionPage() {
  const applicationData = useAppSelector(selectApplication);
  const applicantData = useAppSelector(selectApplicant);
  const applicantAge = calculateApplicantAge(applicantData.dateOfBirth);

  let backLinkUrl = "/record-medical-history-tb-symptoms";
  if (applicantData.sex == "Female") {
    backLinkUrl = "/medical-history-female";
  } else if (typeof applicantAge.ageInYears == "number" && applicantAge.ageInYears < 11) {
    backLinkUrl = "/medical-history-under-11-years-old";
  }

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent(
      "is_an_xray_required",
      applicationData.applicationId,
      "Medical history and TB symptoms",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container
      title="Is an X-ray required? - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo={backLinkUrl}
    >
      <ChestXrayQuestionForm />
    </Container>
  );
}
