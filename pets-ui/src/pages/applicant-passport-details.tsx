import { useEffect } from "react";
import { useSearchParams } from "react-router";

import Container from "@/components/container/container";
import ApplicantPassportDetailsForm from "@/sections/applicant-passport-details-form";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/google-analytics-utils";

export default function ApplicantPassportDetailsPage() {
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from");
  let backLinkTo: string;
  if (from === "check-visa-applicant-details") {
    backLinkTo = "/check-visa-applicant-details";
  } else if (from === "tb-certificate-summary") {
    backLinkTo = "/tb-certificate-summary";
  } else {
    backLinkTo = "/do-you-have-visa-applicant-written-consent-for-tb-screening";
  }

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent(
      "visa_applicant_passport_information",
      "UNK",
      "Visa Applicant Details",
    );
  }, []);

  return (
    <Container
      title="Visa applicant passport information - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo={backLinkTo}
    >
      <ApplicantPassportDetailsForm />
    </Container>
  );
}
