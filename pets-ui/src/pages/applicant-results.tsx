import { useEffect } from "react";

import Container from "@/components/container/container";
import ApplicantEmptyResult from "@/sections/applicant-no-results";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/helpers";

export default function ApplicantResultsPage() {
  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent("No matching record found", "UNK", "Visa Applicant Details");
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
