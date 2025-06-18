import { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import Confirmation from "@/components/confirmation/confirmation";
import Container from "@/components/container/container";

export default function ChestXrayConfirmation() {
  const breadcrumbItems: IBreadcrumbItem[] = [
    {
      text: "Application progress tracker",
      href: "/tracker",
    },
  ];

  const furtherInfo = ["You can now return to the progress tracker."];

  return (
    <Container title="Radiological outcome confirmed" breadcrumbItems={breadcrumbItems}>
      <Confirmation
        confirmationText={"Radiological outcome confirmed"}
        furtherInfo={furtherInfo}
        buttonText={"Continue"}
        buttonLink={"/tracker"}
        whatHappensNext
      />
    </Container>
  );
}
