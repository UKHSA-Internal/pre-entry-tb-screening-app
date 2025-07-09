import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import ApplicantReview from "@/sections/applicant-details-summary";

export default function ApplicantSummaryPage() {
  return (
    <Container title="Applicant details summary" backLinkTo="/applicant-photo">
      <Heading level={1} size="l" title="Check applicant details" />
      <ApplicantReview />
    </Container>
  );
}
