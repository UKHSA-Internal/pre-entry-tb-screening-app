import { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import Confirmation from "@/components/confirmation/confirmation";
import Container from "@/components/container/container";

export default function ApplicantConfirmation() {
  const breadcrumbItems: IBreadcrumbItem[] = [
    {
      text: "Application progress tracker",
      href: "/tracker",
    },
  ];

  const furtherInfo = ["You can now add travel information for this applicant."];

  return (
    <Container breadcrumbItems={breadcrumbItems} title="Applicant details confirmation">
      <Confirmation
        confirmationText={"Applicant record created"}
        furtherInfo={furtherInfo}
        buttonText={"Continue"}
        buttonLink={"/tracker"}
        whatHappensNext
      />
    </Container>
  );
}
