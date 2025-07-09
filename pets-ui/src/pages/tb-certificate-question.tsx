import { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import Container from "@/components/container/container";
import TbCertificateQuestionForm from "@/sections/tb-certificate-question-form";

export default function TbCertificateQuestionPage() {
  const breadcrumbItems: IBreadcrumbItem[] = [
    { text: "Application progress tracker", href: "/tracker" },
  ];

  return (
    <Container
      title="Will you issue a TB clearance certificate - GOV.UK"
      breadcrumbItems={breadcrumbItems}
    >
      <TbCertificateQuestionForm />
    </Container>
  );
}
