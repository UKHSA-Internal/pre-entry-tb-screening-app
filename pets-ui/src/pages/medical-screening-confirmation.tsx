import "./medical-screening-confirmation.scss";

import { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import Confirmation from "@/components/confirmation/confirmation";
import Container from "@/components/container/container";

export default function MedicalConfirmation() {
  const breadcrumbItems: IBreadcrumbItem[] = [
    {
      text: "Application progress tracker",
      href: "/tracker",
    },
  ];

  const furtherInfo = ["The applicant is now ready to conduct their chest x-ray or sputum test."];

  return (
    <Container title="Medical screening confirmation" breadcrumbItems={breadcrumbItems}>
      <Confirmation
        confirmationText={"Medical screening record created"}
        furtherInfo={furtherInfo}
        buttonText={"Continue to chest X-ray"}
        buttonLink={"/chest-xray-question"}
        whatHappensNext
      />
    </Container>
  );
}
