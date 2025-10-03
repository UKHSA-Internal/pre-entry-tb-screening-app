import Container from "@/components/container/container";
import ApplicantTravelForm from "@/sections/applicant-travel-form";

export default function TravelDetailsPage() {
  return (
    <Container
      title="Travel information - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/tracker"
    >
      <ApplicantTravelForm />
    </Container>
  );
}
