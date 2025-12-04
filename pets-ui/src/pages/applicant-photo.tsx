import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectApplicant } from "@/redux/store";
import ApplicantPhotoForm from "@/sections/applicant-photo-form";
import { ApplicationStatus } from "@/utils/enums";
import { sendGoogleAnalyticsJourneyEvent } from "@/utils/google-analytics-utils";

export default function ApplicantPhotoPage() {
  const applicant = useAppSelector(selectApplicant);
  const [searchParams] = useSearchParams();

  const fromParam = searchParams.get("from");
  let backLinkTo: string;
  if (fromParam === "check-applicant-details") {
    backLinkTo = "/check-applicant-details";
  } else if (fromParam === "tb-certificate-summary") {
    backLinkTo = "/tb-certificate-summary";
  } else if (applicant.status === ApplicationStatus.COMPLETE) {
    backLinkTo = "/tb-certificate-summary";
  } else {
    backLinkTo = "/enter-visa-applicant-personal-information";
  }

  useEffect(() => {
    sendGoogleAnalyticsJourneyEvent("upload_visa_applicant_photo", "UNK", "Visa Applicant Details");
  }, []);

  return (
    <Container
      title="Upload visa applicant photo - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo={backLinkTo}
    >
      <ApplicantPhotoForm />
    </Container>
  );
}
