import { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import Container from "@/components/container/container";
import SputumResultsForm from "@/sections/sputum-results-form";

export default function EnterSputumSampleResultsPage() {
  const breadcrumbItems: IBreadcrumbItem[] = [
    {
      text: "Application progress tracker",
      href: "/tracker",
    },
    {
      text: "Check sputum sample information and results",
      href: "/check-sputum-sample-information",
    },
  ];

  return (
    <Container title="Enter sputum sample results" breadcrumbItems={breadcrumbItems}>
      <SputumResultsForm />
    </Container>
  );
}
