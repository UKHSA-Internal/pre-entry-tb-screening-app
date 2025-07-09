import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import TravelReview from "@/sections/applicant-travel-summary";

export default function TravelSummaryPage() {
  return (
    <Container title="Applicant travel information summary" backLinkTo="/travel-details">
      <Heading level={1} size="l" title="Check travel information" />
      <TravelReview />
    </Container>
  );
}
