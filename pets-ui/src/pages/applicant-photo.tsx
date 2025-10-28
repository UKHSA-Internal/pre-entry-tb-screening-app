import { useSearchParams } from "react-router-dom";

import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectApplicant } from "@/redux/store";
import ApplicantPhotoForm from "@/sections/applicant-photo-form";
import { ApplicationStatus } from "@/utils/enums";

export default function ApplicantPhotoPage() {
  const applicant = useAppSelector(selectApplicant);
  const [searchParams] = useSearchParams();

  const fromParam = searchParams.get("from");
  let backLinkTo: string;
  if (fromParam === "check") {
    backLinkTo = "/check-applicant-details";
  } else if (fromParam === "tb") {
    backLinkTo = "/tb-certificate-summary";
  } else if (applicant.status === ApplicationStatus.COMPLETE) {
    backLinkTo = "/tb-certificate-summary";
  } else {
    backLinkTo = "/enter-applicant-information";
  }

  return (
    <Container
      title="Upload visa applicant photo - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo={backLinkTo}
    >
      <ApplicantPhotoForm />
    </Container>
  );
}
