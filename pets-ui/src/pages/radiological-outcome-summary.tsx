import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import { useAppSelector } from "@/redux/hooks";
import { selectRadiologicalOutcome } from "@/redux/store";
import RadiologicalOutcomeSummary from "@/sections/radiological-outcome-summary";
import { ApplicationStatus } from "@/utils/enums";

export default function RadiologicalOutcomeSummaryPage() {
  const radiologicalOutcomeData = useAppSelector(selectRadiologicalOutcome);

  return (
    <Container
      title="Check chest X-ray results and findings - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo={
        radiologicalOutcomeData.status == ApplicationStatus.COMPLETE
          ? "/tracker"
          : "/enter-x-ray-findings"
      }
    >
      <Heading level={1} size="l" title="Check chest X-ray results and findings" />
      <RadiologicalOutcomeSummary />
    </Container>
  );
}
