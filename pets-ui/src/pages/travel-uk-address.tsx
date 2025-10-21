import Container from "@/components/container/container";
import ApplicantTravelAddressAndContactDetails from "@/sections/applicant-travel-uk-address";

export default function TravelAddressAndContactDetailsPage() {
  return (
    <Container
      title="Visa applicant's proposed UK address - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/proposed-visa-category"
    >
      <ApplicantTravelAddressAndContactDetails />
    </Container>
  );
}
