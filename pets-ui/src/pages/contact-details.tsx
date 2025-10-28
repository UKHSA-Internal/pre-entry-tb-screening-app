import { useSearchParams } from "react-router-dom";

import Container from "@/components/container/container";
import ApplicantForm from "@/sections/applicant-details-form";

export default function ContactDetailsPage() {
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from");
  let backLinkTo: string;
  if (from === "check") {
    backLinkTo = "/check-applicant-details";
  } else if (from === "tb") {
    backLinkTo = "/tb-certificate-summary";
  } else {
    backLinkTo = "/do-you-have-visa-applicant-written-consent-for-tb-screening";
  }
  return (
    <Container
      title="Enter applicant information - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo={backLinkTo}
    >
      <ApplicantForm />
    </Container>
  );
}
