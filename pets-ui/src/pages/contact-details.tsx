import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectApplicant } from "@/redux/store";
import ApplicantForm from "@/sections/applicant-details-form";
import { ApplicationStatus } from "@/utils/enums";

export default function ContactDetailsPage() {
  const applicant = useAppSelector(selectApplicant);
  const backLinkTo =
    applicant.status === ApplicationStatus.COMPLETE
      ? "/tb-certificate-summary"
      : "/no-matching-record-found";

  return (
    <Container
      title="Enter applicant information - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo={backLinkTo}
    >
      <ApplicantForm />
    </Container>
  );
}
