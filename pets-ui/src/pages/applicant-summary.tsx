import { useEffect } from "react";

import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import { useAppSelector } from "@/redux/hooks";
import { selectApplicant, selectApplication } from "@/redux/store";
import ApplicantReview from "@/sections/applicant-details-summary";
import { ApplicationStatus } from "@/utils/enums";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/helpers";

export default function ApplicantSummaryPage() {
  const applicantData = useAppSelector(selectApplicant);
  const applicationData = useAppSelector(selectApplication);

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent(
      "Check applicant details",
      applicationData.applicationId,
      "Visa Applicant Details",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container
      title="Check applicant details - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo={
        applicantData.status == ApplicationStatus.COMPLETE
          ? "/tracker"
          : "/upload-visa-applicant-photo"
      }
    >
      <Heading level={1} size="l" title="Check applicant details" />
      <ApplicantReview />
    </Container>
  );
}
