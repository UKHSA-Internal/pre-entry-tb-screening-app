import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import { useAppSelector } from "@/redux/hooks";
import { selectSputumDecision } from "@/redux/store";
import SputumDecisionSummary from "@/sections/sputum-decision-summary";
import { ApplicationStatus } from "@/utils/enums";

export default function SputumDecisionSummaryPage() {
  const sputumDecisionData = useAppSelector(selectSputumDecision);

  return (
    <Container
      title="Check sputum decision information - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo={
        sputumDecisionData.status == ApplicationStatus.COMPLETE
          ? "/tracker"
          : "/is-sputum-collection-required"
      }
    >
      <Heading level={1} size="l" title="Check sputum decision information" />
      <SputumDecisionSummary />
    </Container>
  );
}
