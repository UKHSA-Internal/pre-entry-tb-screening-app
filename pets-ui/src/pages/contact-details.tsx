import Container from "@/components/container/container";
import ApplicantForm from "@/sections/applicant-details-form";

export default function ContactDetailsPage() {
  return (
    <Container title="Applicant details form" backLinkTo="/no-matching-record-found">
      <ApplicantForm />
    </Container>
  );
}
