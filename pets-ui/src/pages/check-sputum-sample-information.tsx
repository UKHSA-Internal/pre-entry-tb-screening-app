import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectSputum } from "@/redux/store";
import SputumSummary from "@/sections/sputum-summary";
import { ApplicationStatus } from "@/utils/enums";

export default function CheckSputumSampleInformationPage() {
  const sputumData = useAppSelector(selectSputum);

  let backLinkUrl = "/enter-sputum-sample-collection-information";
  if (sputumData.status === ApplicationStatus.COMPLETE) {
    backLinkUrl = "/tracker";
  }

  return (
    <Container
      title="Check sputum sample information and results - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo={backLinkUrl}
    >
      <SputumSummary />
    </Container>
  );
}
