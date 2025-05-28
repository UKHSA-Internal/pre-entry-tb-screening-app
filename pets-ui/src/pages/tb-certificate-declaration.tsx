import { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import Container from "@/components/container/container";
import TbCertificateDeclarationForm from "@/sections/tb-certificate-declaration-form";

export default function TbCertificateDeclarationPage() {
  const breadcrumbItems: IBreadcrumbItem[] = [
    {
      text: "Application progress tracker",
      href: "/tracker",
    },
  ];
  return (
    <Container title="TB Certificate Declaration" breadcrumbItems={breadcrumbItems}>
      <TbCertificateDeclarationForm />
    </Container>
  );
}
