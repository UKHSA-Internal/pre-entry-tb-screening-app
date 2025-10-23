import { useLocation } from "react-router-dom";

import Container from "@/components/container/container";
import ApplicantForm from "@/sections/applicant-details-form";

export default function ContactDetailsPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const from = params.get("from");
  const backLinkTo =
    from === "check"
      ? "/check-applicant-details"
      : from === "tb"
        ? "/tb-certificate-summary"
        : "/do-you-have-visa-applicant-written-consent-for-tb-screening";
  return (
    <Container
      title="Enter applicant information - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo={backLinkTo}
    >
      <ApplicantForm />
    </Container>
  );
}
