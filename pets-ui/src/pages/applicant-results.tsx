import { useEffect } from "react";

import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectApplication } from "@/redux/store";
import ApplicantEmptyResult from "@/sections/applicant-no-results";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/helpers";

export default function ApplicantResultsPage() {
  const applicationData = useAppSelector(selectApplication);

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent(
      "No matching record found",
      applicationData.applicationId,
      "Visa Applicant Details",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Container
      title="No matching record found - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/search-for-visa-applicant"
    >
      <ApplicantEmptyResult />
    </Container>
  );
}
