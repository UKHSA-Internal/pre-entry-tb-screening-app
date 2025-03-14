import "./travel-details.scss";

import { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import Confirmation from "@/components/confirmation/confirmation";
import Container from "@/components/container/container";

export default function TravelConfirmation() {
  const breadcrumbItems: IBreadcrumbItem[] = [
    {
      text: "Application progress tracker",
      href: "/tracker",
    },
  ];
  const furtherInfo = [
    "The applicant is now ready to conduct their medical screening with the panel physician.",
  ];

  return (
    <Container title="Travel details confirmation" breadcrumbItems={breadcrumbItems}>
      <Confirmation
        confirmationText={"Travel information record created"}
        furtherInfo={furtherInfo}
        buttonText={"Continue to medical screening"}
        buttonLink={"/medical-screening"}
        whatHappensNext
      />
    </Container>
  );
}
