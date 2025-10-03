import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import { useAppSelector } from "@/redux/hooks";
import { selectMedicalScreening } from "@/redux/store";
import MedicalScreeningReview from "@/sections/medical-screening-summary";
import { ApplicationStatus } from "@/utils/enums";

export default function MedicalSummaryPage() {
  const medicalData = useAppSelector(selectMedicalScreening);

  return (
    <Container
      title="Check medical screening - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo={
        medicalData.status == ApplicationStatus.COMPLETE ? "/tracker" : "/medical-screening"
      }
    >
      <Heading level={1} size="l" title="Check medical screening" />
      <MedicalScreeningReview />
    </Container>
  );
}
