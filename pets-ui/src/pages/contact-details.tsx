import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectApplication } from "@/redux/store";
import ApplicantForm from "@/sections/applicant-details-form";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/helpers";

export default function ContactDetailsPage() {
  const applicationData = useAppSelector(selectApplication);
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
    sendGoogleAnalyticsJourneyEvent(
      "Enter applicant information",
      applicationData.applicationId,
      "Visa Applicant Details",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
