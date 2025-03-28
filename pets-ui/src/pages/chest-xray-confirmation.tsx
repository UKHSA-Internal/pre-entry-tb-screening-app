import "./chest-xray-confirmation.scss";

import { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import Confirmation from "@/components/confirmation/confirmation";
import Container from "@/components/container/container";
import LinkLabel from "@/components/linkLabel/LinkLabel";

export default function ChestXrayConfirmation() {
  const breadcrumbItems: IBreadcrumbItem[] = [
    {
      text: "Application progress tracker",
      href: "/tracker",
    },
  ];

  const furtherInfo = [
    "You cannot currently log sputum test information in this service.",
    <>
      Continue to TB certificate declaration or go to{" "}
      <LinkLabel to="/tracker" title="TB screening progress tracker" />.
    </>,
  ];

  return (
    <Container title="Chest X-ray Confirmation" breadcrumbItems={breadcrumbItems}>
      <Confirmation
        confirmationText={"Chest X-ray information recorded"}
        furtherInfo={furtherInfo}
        buttonText={"Continue"}
        buttonLink={"/tb-certificate-declaration"}
        whatHappensNext
      />
    </Container>
  );
}
