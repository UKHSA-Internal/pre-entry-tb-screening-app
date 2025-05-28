import { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import Container from "@/components/container/container";
import Heading from "@/components/heading/heading";
import TbSummary from "@/sections/tb-summary";

export default function TbSummaryPage() {
  const breadcrumbItems: IBreadcrumbItem[] = [
    {
      text: "Application progress tracker",
      href: "/tracker",
    },
  ];
  return (
    <Container title="TB Summary" breadcrumbItems={breadcrumbItems}>
      <Heading level={1} size="l" title="Check TB clearance certificate declaration" />
      <TbSummary />
    </Container>
  );
}
