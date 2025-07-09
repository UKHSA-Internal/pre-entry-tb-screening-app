import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import MedicalScreeningReview from "@/sections/medical-screening-summary";

export default function MedicalSummaryPage() {
  return (
    <Container title="Medical screening summary" backLinkTo="/medical-screening">
      <Heading level={1} size="l" title="Check medical screening" />
      <MedicalScreeningReview />
    </Container>
  );
}
