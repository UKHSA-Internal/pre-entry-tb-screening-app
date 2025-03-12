import "./chest-xray-summary.scss";

import { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import ChestXraySummary from "@/sections/chest-xray-summary";

export default function ChestXraySummaryPage() {
  const breadcrumbItems: IBreadcrumbItem[] = [
    {
      text: "Application progress tracker",
      href: "/tracker",
    },
  ];
  return (
    <Container title="Check chest X-ray information" breadcrumbItems={breadcrumbItems}>
      <Heading level={1} size="l" title="Check chest X-ray information" />
      <ChestXraySummary />
    </Container>
  );
}
