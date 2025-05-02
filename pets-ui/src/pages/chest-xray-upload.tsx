import { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import Container from "@/components/container/container";
import ChestXrayForm from "@/sections/chest-xray-form";

export default function ChestXrayUploadPage() {
  const breadcrumbItems: IBreadcrumbItem[] = [
    {
      text: "Application progress tracker",
      href: "/tracker",
    },
  ];

  return (
    <Container title="Upload chest X-rays" breadcrumbItems={breadcrumbItems}>
      <ChestXrayForm />
    </Container>
  );
}
