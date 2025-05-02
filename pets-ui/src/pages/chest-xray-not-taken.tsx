import { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import Container from "@/components/container/container";
import ChestXrayNotTakenForm from "@/sections/chest-xray-not-taken-form";

export default function ChestXrayNotTaken() {
  const breadcrumbItems: IBreadcrumbItem[] = [
    {
      text: "Application progress tracker",
      href: "/tracker",
    },
  ];

  return (
    <Container title="Chest X-ray not taken" breadcrumbItems={breadcrumbItems}>
      <ChestXrayNotTakenForm />
    </Container>
  );
}
