import "./chest-xray-confirmation.scss";

import { Link } from "react-router-dom";

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

  const furtherInfo = [
    "You cannot currently log sputum test information in this service.",
    <>
      Continue to TB certificate declaration or go to{" "}
      <Link to={"/tracker"} className="govuk-link" style={{ color: "#1d70b8" }}>
        TB screening progress tracker
      </Link>
      .
    </>,
  ];

  return (
    <Container title="Medical Screening Confirmation" breadcrumbItems={breadcrumbItems}>
      <Confirmation
        confirmationText={"Chest X-ray information recorded"}
        furtherInfo={furtherInfo}
        buttonText={"Continue"}
        buttonLink={"/tb-declaration"}
        whatHappensNext
      />
    </Container>
  );
}
