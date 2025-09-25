import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import { useAppSelector } from "@/redux/hooks";
import { selectMedicalScreening, selectRadiologicalOutcome } from "@/redux/store";
import MedicalScreeningReview from "@/sections/medical-screening-summary";
import { ApplicationStatus, YesOrNo } from "@/utils/enums";

export default function MedicalSummaryPage() {
  const medicalData = useAppSelector(selectMedicalScreening);
  const radiologicalData = useAppSelector(selectRadiologicalOutcome);

  const getBackLink = () => {
    if (medicalData.status === ApplicationStatus.COMPLETE) {
      return "/tracker";
    }

    if (radiologicalData.chestXrayTaken === YesOrNo.NO) {
      return "/xray-not-required-reason";
    }

    return "/xray-question";
  };

  return (
    <Container
      title="Medical screening summary - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo={getBackLink()}
    >
      <Heading level={1} size="l" title="Check medical screening" />
      <MedicalScreeningReview />
    </Container>
  );
}
