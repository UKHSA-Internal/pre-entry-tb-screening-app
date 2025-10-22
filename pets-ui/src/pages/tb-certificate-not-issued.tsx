import Container from "@/components/container/container";
import TbCertificateNotIssuedForm from "@/sections/tb-certificate-not-issued-form";

export default function TbCertificateNotIssuedPage() {
  return (
    <Container
      title="Why are you not issuing a certificate? - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/will-you-issue-tb-clearance-certificate"
    >
      <TbCertificateNotIssuedForm />
    </Container>
  );
}
