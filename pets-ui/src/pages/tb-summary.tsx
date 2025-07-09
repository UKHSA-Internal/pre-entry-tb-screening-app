import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import TbSummary from "@/sections/tb-summary";

export default function TbSummaryPage() {
  return (
    <Container title="TB Summary" backLinkTo="/tb-certificate-declaration">
      <Heading level={1} size="l" title="Check TB clearance certificate declaration" />
      <TbSummary />
    </Container>
  );
}
