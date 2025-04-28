import { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import Container from "@/components/container/container";
import ChestXrayQuestionForm from "@/sections/chest-xray-question-form";

export default function ChestXrayQuestionPage() {
  const breadcrumbItems: IBreadcrumbItem[] = [
    { text: "Application progress tracker", href: "/tracker" },
  ];

  return (
    <Container title="Select X-ray status" breadcrumbItems={breadcrumbItems}>
      <ChestXrayQuestionForm />
    </Container>
  );
}
