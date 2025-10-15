import Container from "@/components/container/container";
import ApplicantTravelAddressAndContactDetails from "@/sections/applicant-travel-uk-address";

export default function TravelDetailsPage() {
  return (
    <Container
      title="Travel information - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/tracker"
    >
      <ApplicantTravelAddressAndContactDetails />
    </Container>
  );
}
