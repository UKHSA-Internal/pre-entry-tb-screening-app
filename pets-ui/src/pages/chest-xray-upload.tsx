import "./chest-xray-upload.scss";

import { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
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
      <Heading level={1} size="l" title="Upload chest X-ray images" />
      <ChestXrayForm />
    </Container>
  );
}
