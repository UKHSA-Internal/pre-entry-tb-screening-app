import Container from "@/components/container/container";
import ApplicantTravelVisaCategory from "@/sections/applicant-travel-visa-category";

export default function TravelVisaCategoryPage() {
  return (
    <Container
      title="Proposed visa category - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/tracker"
    >
      <ApplicantTravelVisaCategory />
    </Container>
  );
}
