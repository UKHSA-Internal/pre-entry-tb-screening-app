import { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import Container from "@/components/container/container";
import SputumQuestionForm from "@/sections/sputum-question-form";

export default function SputumQuestionPage() {
  const breadcrumbItems: IBreadcrumbItem[] = [
    { text: "Application progress tracker", href: "/tracker" },
  ];

  return (
    <Container title="Select sputum collection status" breadcrumbItems={breadcrumbItems}>
      <SputumQuestionForm />
    </Container>
  );
}
