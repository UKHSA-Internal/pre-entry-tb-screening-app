import Container from "@/components/container/container";
import ApplicantForm from "@/sections/applicant-details-form";

export default function ContactDetailsPage() {
  return (
    <Container
      title="Enter applicant information - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/no-matching-record-found"
    >
      <ApplicantForm />
    </Container>
  );
}
