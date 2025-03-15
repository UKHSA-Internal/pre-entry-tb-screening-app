import "./tb-confirmation.scss";

import { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import Confirmation from "@/components/confirmation/confirmation";
import Container from "@/components/container/container";

export default function TbConfirmationPage() {
  const breadcrumbItems: IBreadcrumbItem[] = [
    {
      text: "Application progress tracker",
      href: "/tracker",
    },
  ];

  return (
    <Container title="TB screening complete" breadcrumbItems={breadcrumbItems}>
      <Confirmation
        confirmationText="TB screening complete"
        furtherInfo={["Thank you for recording the visa applicant's TB screening."]}
        buttonLink="/tracker"
        buttonText="Finish"
      />
    </Container>
  );
}
