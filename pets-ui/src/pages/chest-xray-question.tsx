import Container from "@/components/container/container";
import ChestXrayQuestionForm from "@/sections/chest-xray-question-form";

export default function ChestXrayQuestionPage() {
  return (
    <Container title="Select X-ray status" backLinkTo="/tracker">
      <ChestXrayQuestionForm />
    </Container>
  );
}
