import Container from "@/components/container/container";
import ApplicantEmptyResult from "@/sections/applicant-no-results";

export default function ApplicantResultsPage() {
  return (
    <Container title="Applicant results" backLinkTo="/applicant-search">
      <ApplicantEmptyResult />
    </Container>
  );
}
