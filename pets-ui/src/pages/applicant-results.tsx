import { useEffect } from "react";

import Container from "@/components/container/container";
import ApplicantEmptyResult from "@/sections/applicant-no-results";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/google-analytics-utils";

export default function ApplicantResultsPage() {
  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent("no_matching_record_found", "UNK", "Visa Applicant Details");
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
