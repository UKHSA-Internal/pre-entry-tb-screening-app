import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import ChestXraySummary from "@/sections/chest-xray-summary";

export default function ChestXraySummaryPage() {
  return (
    <Container title="Check chest X-ray information" backLinkTo="/sputum-question">
      <Heading level={1} size="l" title="Check chest X-ray information" />
      <ChestXraySummary />
    </Container>
  );
}
