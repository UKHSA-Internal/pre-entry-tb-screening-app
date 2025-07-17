import Container from "@/components/container/container";
import TbCertificateQuestionForm from "@/sections/tb-certificate-question-form";

export default function TbCertificateQuestionPage() {
  return (
    <Container title="Will you issue a TB clearance certificate - GOV.UK" backLinkTo="/tracker">
      <TbCertificateQuestionForm />
    </Container>
  );
}
