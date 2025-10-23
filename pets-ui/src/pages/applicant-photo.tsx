import { useLocation } from "react-router-dom";

import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectApplicant } from "@/redux/store";
import ApplicantPhotoForm from "@/sections/applicant-photo-form";
import { ApplicationStatus } from "@/utils/enums";

export default function ApplicantPhotoPage() {
  const applicant = useAppSelector(selectApplicant);
  const location = useLocation();

  const fromParam = new URLSearchParams(location.search).get("from");
  const backLinkTo =
    fromParam === "check"
      ? "/check-applicant-details"
      : fromParam === "tb"
        ? "/tb-certificate-summary"
        : applicant.status === ApplicationStatus.COMPLETE
          ? "/tb-certificate-summary"
          : "/enter-applicant-information";

  return (
    <Container
      title="Upload visa applicant photo - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo={backLinkTo}
    >
      <ApplicantPhotoForm />
    </Container>
  );
}
