import "./tb-certificate-declaration.scss";

import { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
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
      <Heading level={1} size="l" title="Enter TB clearance certificate declaration" />
      <TbCertificateDeclarationForm />
    </Container>
  );
}
