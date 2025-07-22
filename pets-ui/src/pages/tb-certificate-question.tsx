import Container from "@/components/container/container";
import TbCertificateQuestionForm from "@/sections/tb-certificate-question-form";

export default function TbCertificateQuestionPage() {
  return (
    <Container
      title="Will you issue a TB clearance certificate - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/tracker"
    >
      <TbCertificateQuestionForm />
    </Container>
  );
}
