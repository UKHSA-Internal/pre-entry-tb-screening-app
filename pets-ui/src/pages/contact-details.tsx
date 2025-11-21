import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import Container from "@/components/container/container";
import ApplicantForm from "@/sections/applicant-details-form";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/helpers";

export default function ContactDetailsPage() {
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from");
  let backLinkTo: string;
  if (from === "check-applicant-details") {
    backLinkTo = "/check-applicant-details";
  } else if (from === "tb-certificate-summary") {
    backLinkTo = "/tb-certificate-summary";
  } else {
    backLinkTo = "/do-you-have-visa-applicant-written-consent-for-tb-screening";
  }

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent("enter_applicant_information", "UNK", "Visa Applicant Details");
  }, []);

  return (
    <Container
      title="Enter applicant information - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo={backLinkTo}
    >
      <ApplicantForm />
    </Container>
  );
}
