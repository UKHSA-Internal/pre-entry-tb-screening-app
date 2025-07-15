import { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import Container from "@/components/container/container";
import TbCertificateNotIssuedForm from "@/sections/tb-certificate-not-issued-form";

export default function TbCertificateNotIssuedPage() {
  const breadcrumbItems: IBreadcrumbItem[] = [
    { text: "Application progress tracker", href: "/tracker" },
  ];

  return (
    <Container title="Why are you not issuing a certificate?" breadcrumbItems={breadcrumbItems}>
      <TbCertificateNotIssuedForm />
    </Container>
  );
}
