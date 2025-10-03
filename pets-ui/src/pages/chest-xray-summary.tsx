import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import { useAppSelector } from "@/redux/hooks";
import { selectChestXray } from "@/redux/store";
import ChestXraySummary from "@/sections/chest-xray-summary";
import { ApplicationStatus } from "@/utils/enums";

export default function ChestXraySummaryPage() {
  const chestXrayData = useAppSelector(selectChestXray);

  return (
    <Container
      title="Check chest X-ray information - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo={
        chestXrayData.status == ApplicationStatus.COMPLETE ? "/tracker" : "/sputum-question"
      }
    >
      <Heading level={1} size="l" title="Check chest X-ray information" />
      <ChestXraySummary />
    </Container>
  );
}
