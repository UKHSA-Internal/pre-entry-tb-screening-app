import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import Dashboard from "@/sections/dashboard";

export default function DashboardPage() {
  return (
    <Container
      title="Screenings in progress - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/what-do-you-need-to-do"
      shouldClearHistory={true}
      useTwoThirdsColumn={false}
    >
      <Heading level={1} size="l" title="Screenings in progress" />
      <Dashboard />
    </Container>
  );
}
