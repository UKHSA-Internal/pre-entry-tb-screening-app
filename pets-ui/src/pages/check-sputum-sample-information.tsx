import { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import Container from "@/components/container/container";
import SputumSummary from "@/sections/sputum-summary";

export default function CheckSputumSampleInformationPage() {
  const breadcrumbItems: IBreadcrumbItem[] = [
    {
      text: "Application progress tracker",
      href: "/tracker",
    },
  ];

  return (
    <Container
      title="Check sputum sample information and results"
      breadcrumbItems={breadcrumbItems}
    >
      <SputumSummary />
    </Container>
  );
}
