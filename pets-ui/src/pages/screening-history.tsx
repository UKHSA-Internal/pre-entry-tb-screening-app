import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import ScreeningHistory from "@/sections/screening-history";

export default function ScreeningHistoryPage() {
  return (
    <Container
      title="Screening history - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/search-for-visa-applicant"
      shouldClearHistory={true}
      useTwoThirdsColumn={false}
    >
      <Heading level={1} size="l" title="Screening history" />
      <ScreeningHistory />
    </Container>
  );
}
