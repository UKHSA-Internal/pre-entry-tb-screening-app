import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectNavigation, selectSputum } from "@/redux/store";
import SputumSummary from "@/sections/sputum-summary";
import { ApplicationStatus } from "@/utils/enums";

export default function CheckSputumSampleInformationPage() {
  const navigationData = useAppSelector(selectNavigation);
  const sputumData = useAppSelector(selectSputum);

  let backLinkUrl = navigationData.checkSputumPreviousPage;
  if (sputumData.status === ApplicationStatus.COMPLETE) {
    backLinkUrl = "/tracker";
  }

  return (
    <Container
      title="Check sputum collection details and results - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo={backLinkUrl}
    >
      <SputumSummary />
    </Container>
  );
}
