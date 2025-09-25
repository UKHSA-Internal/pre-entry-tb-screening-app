import Container from "@/components/container/container";
import { useAppSelector } from "@/redux/hooks";
import { selectRadiologicalOutcome } from "@/redux/store";
import XrayQuestionForm from "@/sections/xray-question-form";
import { ApplicationStatus } from "@/utils/enums";

export default function XrayQuestionPage() {
  const radiologicalData = useAppSelector(selectRadiologicalOutcome);

  return (
    <Container
      title="Is an X-ray required? - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo={
        radiologicalData.status == ApplicationStatus.COMPLETE ? "/tracker" : "/medical-screening"
      }
    >
      <XrayQuestionForm />
    </Container>
  );
}
