import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import { useAppSelector } from "@/redux/hooks";
import { selectMedicalScreening } from "@/redux/store";
import MedicalScreeningReview from "@/sections/medical-screening-summary";
import { ApplicationStatus, YesOrNo } from "@/utils/enums";

export default function MedicalSummaryPage() {
  const medicalData = useAppSelector(selectMedicalScreening);

  const getBackLink = () => {
    if (medicalData.status === ApplicationStatus.COMPLETE) {
      return "/tracker";
    }

    if (medicalData.chestXrayTaken === YesOrNo.NO) {
      return "/chest-xray-not-taken";
    }

    return "/chest-xray-question";
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
