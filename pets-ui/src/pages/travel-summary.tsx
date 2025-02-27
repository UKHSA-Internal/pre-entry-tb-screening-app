import "./travel-summary.scss";

import { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import TravelReview from "@/sections/applicant-travel-summary";

export default function TravelSummaryPage() {
  const breadcrumbItems: IBreadcrumbItem[] = [
    {
      text: "Application progress tracker",
      href: "/tracker",
    },
  ];

  return (
    <Container title="Applicant Travel Information Summary" breadcrumbItems={breadcrumbItems}>
      <Heading level={1} size="l" title="Check travel information" />
      <TravelReview />
    </Container>
  );
}
