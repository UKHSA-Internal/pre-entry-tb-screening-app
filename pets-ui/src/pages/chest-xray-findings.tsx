import { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import Container from "@/components/container/container";
import ChestXrayFindingsForm from "@/sections/chest-xray-findings-form";

export default function ChestXrayFindingsPage() {
  const breadcrumbItems: IBreadcrumbItem[] = [
    {
      text: "Application progress tracker",
      href: "/tracker",
    },
  ];

  return (
    <Container breadcrumbItems={breadcrumbItems} title="Enter chest X-ray findings">
      <ChestXrayFindingsForm />
    </Container>
  );
}
