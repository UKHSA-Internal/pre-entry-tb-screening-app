import Container from "@/components/container/container";
import SputumQuestionForm from "@/sections/sputum-question-form";

export default function SputumQuestionPage() {
  return (
    <Container
      title="Is sputum collection required? - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/tracker"
    >
      <SputumQuestionForm />
    </Container>
  );
}
