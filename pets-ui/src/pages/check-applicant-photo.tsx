import Container from "@/components/container/container";
import CheckApplicantPhoto from "@/sections/check-applicant-photo";

export default function CheckApplicantPhotoPage() {
  return (
    <Container
      title="Check visa applicant photo - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/upload-visa-applicant-photo"
    >
      <CheckApplicantPhoto />
    </Container>
  );
}
