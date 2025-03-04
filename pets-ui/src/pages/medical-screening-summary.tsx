import "./medical-screening-summary.scss";

import { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import MedicalScreeningReview from "@/sections/medical-screening-summary";

export default function MedicalSummaryPage() {
  const breadcrumbItems: IBreadcrumbItem[] = [
    {
      text: "Application progress tracker",
      href: "/tracker",
    },
  ];

  return (
    <Container title="Medical Screening Summary" breadcrumbItems={breadcrumbItems}>
      <Heading level={1} size="l" title="Check medical screening" />
      <MedicalScreeningReview />
    </Container>
  );
}
