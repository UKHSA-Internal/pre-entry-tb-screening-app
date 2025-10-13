import Container from "@/components/container/container";
import ChestXrayQuestionForm from "@/sections/chest-xray-question-form";

export default function ChestXrayQuestionPage() {
  return (
    <Container
      title="Is an X-ray required? - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/medical-screening"
    >
      <ChestXrayQuestionForm />
    </Container>
  );
}
