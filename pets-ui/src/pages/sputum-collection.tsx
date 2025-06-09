import { IBreadcrumbItem } from "@/components/breadcrumb/breadcrumb";
import Container from "@/components/container/container";
import SputumCollectionForm from "@/sections/sputum-collection-form";

export default function SputumCollectionPage() {
  const breadcrumbItems: IBreadcrumbItem[] = [
    {
      text: "Application progress tracker",
      href: "/tracker",
    },
  ];

  return (
    <Container title="Enter sputum sample collection information" breadcrumbItems={breadcrumbItems}>
      <SputumCollectionForm />
    </Container>
  );
}
