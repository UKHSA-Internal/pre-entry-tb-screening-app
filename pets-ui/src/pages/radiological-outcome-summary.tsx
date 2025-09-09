import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import { useAppSelector } from "@/redux/hooks";
import { selectRadiologicalOutcome } from "@/redux/store";
import ChestXraySummary from "@/sections/chest-xray-summary";
import { ApplicationStatus } from "@/utils/enums";

export default function ChestXraySummaryPage() {
  const radiologicalOutcomeData = useAppSelector(selectRadiologicalOutcome);

  return (
    <Container
      title="Check chest X-ray results and findings - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo={
        radiologicalOutcomeData.status == ApplicationStatus.COMPLETE
          ? "/tracker"
          : "/radiological-outcome-findings"
      }
    >
      <Heading level={1} size="l" title="Check chest X-ray results and findings" />
      <ChestXraySummary />
    </Container>
  );
}
