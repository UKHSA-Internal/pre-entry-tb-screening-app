import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectNavigation } from "@/redux/navigationSlice";
import { selectSputum } from "@/redux/sputumSlice";
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
    <Container title="Check sputum sample information and results" backLinkTo={backLinkUrl}>
      <SputumSummary />
    </Container>
  );
}
