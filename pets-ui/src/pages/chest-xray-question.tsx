import { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import ChestXrayQuestionForm from "@/sections/chest-xray-question-form";

export default function ChestXrayQuestionPage() {
  const breadcrumbItems: IBreadcrumbItem[] = [
    { text: "Application progress tracker", href: "/tracker" },
  ];

  return (
    <Container title="Select X-ray status" breadcrumbItems={breadcrumbItems}>
      <Heading level={1} size="l" title="Select X-ray status" />
      <ChestXrayQuestionForm />
    </Container>
  );
}
