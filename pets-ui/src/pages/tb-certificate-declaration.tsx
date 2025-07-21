import Container from "@/components/container/container";
import TbCertificateDeclarationForm from "@/sections/tb-certificate-declaration-form";

export default function TbCertificateDeclarationPage() {
  return (
    <Container title="TB Certificate Declaration" backLinkTo="/tracker">
      <TbCertificateDeclarationForm />
    </Container>
  );
}
