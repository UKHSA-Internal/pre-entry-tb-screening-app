import Container from "@/components/container/container";
import TbCertificateDeclarationForm from "@/sections/tb-certificate-declaration-form";

export default function TbCertificateDeclarationPage() {
  return (
    <Container
      title="Enter clinic and certificate information - Complete UK pre-entry health screening - GOV.UK"
      backLinkTo="/will-you-issue-tb-clearance-certificate"
    >
      <TbCertificateDeclarationForm />
    </Container>
  );
}
