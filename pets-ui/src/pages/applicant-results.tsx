import Container from "@/components/container/container";
import ApplicantEmptyResult from "@/sections/applicant-no-results";

export default function ApplicantResultsPage() {
  return (
    <Container
      title="No matching record found - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/search-for-visa-applicant"
    >
      <ApplicantEmptyResult />
    </Container>
  );
}
