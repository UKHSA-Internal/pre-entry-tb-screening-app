import Container from "@/components/container/container";
import TbCertificateNotIssuedForm from "@/sections/tb-certificate-not-issued-form";

export default function TbCertificateNotIssuedPage() {
  return (
    <Container title="Why are you not issuing a certificate?" backLinkTo="/tb-certificate-question">
      <TbCertificateNotIssuedForm />
    </Container>
  );
}
